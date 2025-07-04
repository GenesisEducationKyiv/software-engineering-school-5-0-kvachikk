FROM node:24
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ENV RUN_ENVIRONMENT production
RUN npm run build

EXPOSE 3000

CMD npm run start
