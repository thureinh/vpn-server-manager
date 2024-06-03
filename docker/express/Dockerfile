FROM node:21-alpine3.18

WORKDIR /home/node/app

COPY backend/package.json ./
COPY backend/prisma ./prisma

RUN npm install

CMD ["npm" ,"run","start-dev"]