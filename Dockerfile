# Receita de bolo

# o MULT-STAGE-BUILD otimiza a imagem pois elimina o código-fonte da aplicação e quaisquer ferramentas e dependencias que são necessárias para o build

# --- Stage 1 ---
# Imagem base
FROM node:18-alpine3.19 as build

# Definindo o diretório dentro do container
WORKDIR usr/src/front

# Copiando o package da aplicação para o container
COPY package.json .

# Instalando todas as dependencias
RUN npm install

# Copiando a aplicação
COPY . .

# Buildando a aplicação
RUN npm run build

# Reinstalando somente dependencias de produção para otimizar a imagem
#RUN npm install --omit=dev && npm cache clean --force

# --- Stage 2 ---
FROM node:18-alpine3.19 as execution

# Definindo o diretório dentro do container
WORKDIR usr/src/front

# Copiando alguns arquivos da etapa anterior
COPY --from=build /usr/src/front/dist ./dist
COPY --from=build /usr/src/front/node_modules ./node_modules
COPY --from=build /usr/src/front/package.json ./package.json
COPY --from=build /usr/src/front/package-lock.json ./package-lock.json 

# Expondo uma porta
EXPOSE 4173

# Rodando a Aplicação
CMD ["npm", "run", "preview", "--", "--host"]