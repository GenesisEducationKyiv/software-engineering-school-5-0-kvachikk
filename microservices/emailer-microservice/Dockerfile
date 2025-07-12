FROM node:24
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
ENV RUN_ENVIROMENT production
RUN npm run build

EXPOSE 3000 50052

CMD npm run start 