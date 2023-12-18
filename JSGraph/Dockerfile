FROM node:20-alpine

WORKDIR /app

COPY . /app
RUN npm install

EXPOSE 4000

ENTRYPOINT [ "node", "/app/index.js" ]