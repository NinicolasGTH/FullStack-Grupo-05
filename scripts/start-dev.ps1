param(
  [int]$Port = 27017
)

Write-Host "[dev] Iniciando MongoDB na porta $Port..."

function Test-PortOpen {
  param([string]$Host, [int]$Port)
  try {
    return (Test-NetConnection -ComputerName $Host -Port $Port -InformationLevel Quiet)
  } catch { return $false }
}

# 1) Tentar iniciar via serviço
$service = Get-Service -Name 'MongoDB' -ErrorAction SilentlyContinue
if ($service) {
  try {
    if ($service.Status -ne 'Running') {
      Start-Service -Name 'MongoDB' -ErrorAction Stop
      Start-Sleep -Seconds 2
    }
  } catch {
    Write-Warning "[mongo] Não foi possível iniciar o serviço MongoDB. Vou tentar modo processo do usuário."
  }
}

# 2) Se a porta ainda não estiver aberta, iniciar mongod.exe como processo do usuário
if (-not (Test-PortOpen -Host '127.0.0.1' -Port $Port)) {
  $mongoExe = Get-ChildItem "C:\Program Files\MongoDB\Server\*\bin\mongod.exe" -ErrorAction SilentlyContinue | Sort-Object FullName -Descending | Select-Object -First 1
  if (-not $mongoExe) {
    Write-Error "[mongo] mongod.exe não encontrado. Instale o MongoDB Community Server ou adicione mongod ao PATH."
    exit 1
  }

  $dbPath = Join-Path $env:USERPROFILE "mongodb\data"
  $logDir = Join-Path $env:USERPROFILE "mongodb\log"
  New-Item -ItemType Directory -Force -Path $dbPath | Out-Null
  New-Item -ItemType Directory -Force -Path $logDir | Out-Null
  $logPath = Join-Path $logDir "mongod.log"

  $args = @('--dbpath', $dbPath, '--logpath', $logPath, '--logappend', '--bind_ip', '127.0.0.1', '--port', "$Port")
  $proc = Start-Process -FilePath $mongoExe.FullName -ArgumentList $args -WindowStyle Minimized -PassThru
  $pidPath = Join-Path $PSScriptRoot ".mongo.pid"
  Set-Content -Path $pidPath -Value $proc.Id
  Write-Host "[mongo] mongod iniciado (PID $($proc.Id)). Aguardando porta..."

  $retries = 40
  while ($retries -gt 0) {
    Start-Sleep -Milliseconds 500
    if (Test-PortOpen -Host '127.0.0.1' -Port $Port) { break }
    $retries--
  }
  if ($retries -le 0) {
    Write-Warning "[mongo] Porta $Port não abriu. Últimas linhas do log:"
    if (Test-Path $logPath) { Get-Content $logPath -Tail 80 }
    exit 1
  }
}

if (Test-PortOpen -Host '127.0.0.1' -Port $Port) {
  Write-Host "[mongo] OK ouvindo em 127.0.0.1:$Port"
} else {
  Write-Error "[mongo] Falha ao iniciar MongoDB."
  exit 1
}

# 3) Iniciar API
Write-Host "[api] Iniciando servidor Express..."
# Ir para a raiz do projeto (scripts -> ..)
Set-Location (Resolve-Path (Join-Path $PSScriptRoot '..'))
$env:NODE_ENV = "dev"
node server.js
