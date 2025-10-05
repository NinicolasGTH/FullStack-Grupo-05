# API de Jogos

API REST para catálogo de jogos, autenticação de usuários, wishlist e documentação Swagger.

## Tecnologias
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticação
- Swagger para documentação

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
3. Inicie o servidor:
   ```bash
   npm start
   ```
4. Acesse a documentação Swagger em [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

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




