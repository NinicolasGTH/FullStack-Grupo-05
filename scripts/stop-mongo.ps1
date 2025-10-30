$pidPath = Join-Path $PSScriptRoot ".mongo.pid"
if (Test-Path $pidPath) {
  $pid = Get-Content $pidPath | Select-Object -First 1
  if ($pid) {
    try {
      Stop-Process -Id $pid -Force -ErrorAction Stop
      Write-Host "[mongo] Processo $pid finalizado."
      Remove-Item $pidPath -Force
    } catch {
      Write-Warning "[mongo] Não foi possível encerrar o processo $pid: $_"
    }
  }
} else {
  Write-Host "[mongo] Nenhum PID salvo. Se estiver rodando como serviço, pare com: Stop-Service MongoDB"
}
