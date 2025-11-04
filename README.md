# API de Jogos

API REST para catálogo de jogos, autenticação de usuários, wishlist e documentação Swagger.

## Tecnologias
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticação
- Swagger para documentação

## Propósito e público-alvo
Esta API fornece um catálogo de jogos com autenticação e wishlist para uso em um front-end temático (cyberpunk). O objetivo é demonstrar um backend completo (auth, CRUD, documentação e execução local/Docker) que pode ser consumido pelo front.

Público-alvo: turma e avaliadores da disciplina, além de qualquer pessoa interessada em um exemplo de API de jogos.

### Funcionalidades
- Registro e login com JWT
- CRUD de jogos (criação restrita a administrador)
- Wishlist por usuário (adicionar/remover/listar)
- Documentação interativa via Swagger em `/api-docs`
- Base para recursos em tempo real com Socket.IO (chat/notificações futuras)

## Como rodar o projeto

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure o arquivo `.env` com suas variáveis:
   ```env
   MONGO_URI=mongodb://localhost:27017/seu_banco
   JWT_SECRET=seu_segredo
   DEV_ADMIN_SECRET=seu_segredo_admin
   ```
3. Inicie o servidor (porta padrão 5000 se `PORT` não for definido):
   ```powershell
   npm start
   ```

   ## Frontend (Next.js)

   O frontend em Next.js está na pasta `next/` e consome esta API.

   1. Copie `next/.env.local.example` para `next/.env.local` e ajuste `NEXT_PUBLIC_API_URL` para a URL da API (ex.: `http://localhost:5000`).
   2. Instale as dependências do frontend:
      ```powershell
      cd next; npm install
      ```
   3. Rode o servidor de desenvolvimento do Next:
      ```powershell
      npm run dev
      ```
   4. Acesse o frontend em http://localhost:3000.

   Notas:
   - A documentação da API continua em http://localhost:5000/api-docs (ou 6000 se estiver usando Docker conforme abaixo).
   - O Socket.IO no backend já está configurado para aceitar origem `http://localhost:3000`.
   - Faça login no front; para ver telas de admin, promova um usuário via endpoint apropriado e refaça login.

## Como rodar o projeto com Docker

1) Pré-requisito
- Instale o Docker Desktop e deixe-o aberto.

2) Subir API + MongoDB com Docker Compose
```powershell
docker compose up --build -d
# ou (CLI legada)
docker-compose up --build -d
```

3) Parar serviços
```powershell
docker compose down
# ou
docker-compose down
```

Observações importantes:
- O `docker-compose.yml` deste repo sobe dois serviços: `api` (Node/Express) e `mongo` (MongoDB 6).
- O mapeamento da API é `6000:5000` (host:container). Com Docker, acesse: http://localhost:6000/api-docs
- Sem Docker (local), a API fica por padrão em http://localhost:5000/api-docs
- A variável `MONGO_URI` já está definida no compose para apontar para o serviço `mongo` (`mongodb://mongo:27017/gamesdb`). Não é necessário ter Mongo instalado localmente para usar o compose.

Acesse a documentação Swagger:
- Local (sem Docker): [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- Com Docker (porta 6000): [http://localhost:6000/api-docs](http://localhost:6000/api-docs)

## Principais Endpoints

### Autenticação
- `POST /auth/register` — Registrar novo usuário
- `POST /auth/login` — Login
- `GET /auth/me` — Perfil do usuário (token JWT)

### Jogos
- `GET /games` — Listar jogos
- `POST /games` — Criar jogo (admin)

### Wishlist
- `GET /wishlist` — Listar wishlist do usuário
- `POST /wishlist/{gameId}` — Adicionar jogo à wishlist
- `DELETE /wishlist/{gameId}` — Remover jogo da wishlist

## Como documentar novos endpoints
- Adicione o novo endpoint ao arquivo `docs/swagger.js` dentro do objeto `paths`.
- Siga o padrão dos exemplos já existentes.

## Convenções de commit (sugestão)
- `feat`: nova funcionalidade
- `fix`: correção de bug
- `docs`: mudanças em documentação
- `chore`: tarefas de manutenção/configuração

> Observação: mantenha mensagens de commit claras e descritivas, citando o escopo (ex.: `feat(games): adicionar paginação na listagem`). Isso atende ao requisito de commits bem descritos.




