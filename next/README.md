# Next Frontend (App Router)

Frontend em Next.js consumindo a sua API existente (Node/Express).

## Requisitos
- Node 18+
- Variável de ambiente `NEXT_PUBLIC_API_URL` apontando para sua API (ex.: `http://localhost:5000`).

## Como rodar
1. Copie o arquivo `.env.local.example` para `.env.local` e ajuste a URL da API.
2. Instale as dependências:
   - `npm install`
3. Rode o projeto:
   - `npm run dev`
4. Acesse `http://localhost:3000`.

## Páginas incluídas
- `/` Home
- `/login` Login
- `/register` Registro
- `/games` Listagem de jogos (com busca e paginação)
- `/games/[id]/edit` Editar jogo (apenas admin)
- `/admin` Painel do admin
- `/admin/games/new` Criar jogo (apenas admin)
 - `/chat` Chat em tempo real (Socket.IO)
 - `/wishlist` Minha wishlist (listar/remover)

## Notas
- O estado de autenticação é mantido em `localStorage` e revalidado via `/auth/me`.
- Para ver as rotas de admin, promova um usuário com `POST /auth/promote` na API e faça logout/login no front.
- Tailwind já está configurado em `globals.css` e `tailwind.config.js`.

## Operações suportadas
- Login/registro e persistência de sessão via `AuthContext`.
- CRUD de jogos no front (criar/editar/excluir — áreas de admin).
- Wishlist: adicionar na lista de jogos e listar/remover na página `/wishlist`.
- Chat em tempo real integrado ao backend (Socket.IO).

## Observações
- Defina `NEXT_PUBLIC_API_URL` apontando para a API (ex.: `http://localhost:5000`).
- O backend deve estar rodando antes do front.
- Caso promova um usuário a admin pela API, faça logout/login no front para aplicar a permissão.

## Integrantes do grupo
- [Preencha aqui o nome completo do Integrante 1]
- [Preencha aqui o nome completo do Integrante 2]
- [Preencha aqui o nome completo do Integrante 3]
- [Preencha aqui o nome completo do Integrante 4]
