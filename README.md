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

1. Instale o app:
   ```
   instale o Docker Desktop
   ```
2. Abra o Docker:
   ```
   o app Docker Desktop tem que estar aberto antes de rodar o docker na api
   ```
3. Inicie os serviços via terminal (modo detached recomendado):
    ```powershell
    docker compose up --build -d
    # ou (CLI legada)
    docker-compose up --build -d
    ```
4. Para encerrar o docker:
    ```powershell
    docker compose down
    # ou
    docker-compose down
    ```

Observações importantes:
- O `docker-compose.yml` atual mapeia a porta `6000:6000` para a API. Portanto, ao rodar com Docker, acesse: http://localhost:6000/api-docs
- Se rodar localmente (sem Docker), a porta padrão é 5000: http://localhost:5000/api-docs
- O compose inclui um serviço `db` com Postgres por padrão, mas esta API usa MongoDB. Você pode:
   - a) Usar uma instância externa de MongoDB (ex.: MongoDB Atlas) e definir `MONGO_URI` no `.env`;
   - b) Adaptar o compose para incluir MongoDB. Exemplo mínimo:
      ```yaml
      services:
         mongo:
            image: mongo:6
            restart: unless-stopped
            ports:
               - "27017:27017"
            volumes:
               - mongo-data:/data/db
      volumes:
         mongo-data:
      ```
      E então, no `.env` da API (ou env do container), ajustar: `MONGO_URI=mongodb://mongo:27017/seu_banco`.

Acesse a documentação Swagger em [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

Quando em Docker (porta 6000): [http://localhost:6000/api-docs](http://localhost:6000/api-docs)

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




