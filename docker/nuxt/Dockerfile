FROM node:21-alpine3.18

WORKDIR /home/node/app

COPY frontend/package.json ./
RUN npm install

CMD ["npm", "run", "dev", "--", "-o"]