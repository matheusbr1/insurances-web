# Receita de bolo

# Imagem base
FROM node:20-slim

# Definindo o diretório dentro do container
WORKDIR usr/src/front

# Copiando o package da aplicação para o container
COPY package.json .

# Instalando as dependencias do package
RUN npm install

# Copiando a aplicação
COPY . .

# Buildando a aplicação
RUN npm run build

# Rodando a Aplicação
CMD ["npm", "run", "preview", "--", "--host"]

# Expondo uma porta
EXPOSE 4173