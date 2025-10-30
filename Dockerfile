# --- Estágio 1: Build ---
# Use uma imagem oficial do Node.js como base. A versão 'alpine' é leve.
FROM node:18-alpine AS base

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de definição de dependências
COPY package*.json ./

# Instala as dependências do projeto
# Usar 'npm ci' é recomendado para builds de produção pois usa o package-lock.json
RUN npm ci --only=production

# --- Estágio 2: Produção ---
FROM node:18-alpine

WORKDIR /usr/src/app

# Copia as dependências já instaladas do estágio 'base'
COPY --from=base /usr/src/app/node_modules ./node_modules

# Copia o código-fonte da aplicação
COPY . .

# Expõe a porta que sua aplicação usa
EXPOSE 5000

# Comando para iniciar a aplicação
CMD [ "node", "server.js" ]