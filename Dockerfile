# Usa uma imagem oficial do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Instala ferramentas de build (gcc, make, etc.) necessárias para compilar pacotes como o 'mysql2'
# O 'apk add' é o gerenciador de pacotes da distribuição Alpine
RUN apk add --no-cache python3 make gcc g++

# Copia package.json e package-lock.json da pasta 'backend' 
# para o diretório de trabalho atual ('/app') no container.
COPY backend/package*.json ./ 

# Instala as dependências.
RUN npm install --omit=dev

# Copia o restante do código. Agora que as dependências estão instaladas,
# copiamos o código completo da aplicação que está em 'backend/'
COPY backend/ . 

# Expõe a porta que o seu bot/servidor Express usa (exemplo: 3000)
# Se o seu bot não tem servidor web, essa linha pode ser opcional.
EXPOSE 3000

# Comando para iniciar sua aplicação
# Certifique-se que o seu script 'start' no package.json está correto
CMD [ "npm", "start" ]