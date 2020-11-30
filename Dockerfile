FROM node:12-alpine

WORKDIR /app

COPY package*.json yarn.lock ./

RUN npm install

COPY script.js . 

EXPOSE 3001

CMD "node" "script.js"