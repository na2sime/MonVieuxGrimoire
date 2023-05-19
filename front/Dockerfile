FROM node:19

WORKDIR /app

COPY package.json .

RUN npm install

COPY P7-Dev-Web-livres .

EXPOSE 3000

CMD ["npm", "start"]

