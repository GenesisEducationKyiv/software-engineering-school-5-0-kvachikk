# Subscription Microservice

[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)](./LICENSE)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

> **Microservice** that manages user subscriptions for weather notifications. Provides REST endpoints to subscribe, confirm e-mail and unsubscribe. Stores data in PostgreSQL.

---

## Endpoints

| Method | Path                  | Description                                      |
| ------ | --------------------- | ------------------------------------------------ |
| POST   | `/subscribe`          | Create new subscription (email, city, frequency) |
| GET    | `/confirm?token=`     | Confirm e-mail address & activate subscription   |
| GET    | `/unsubscribe?token=` | Deactivate subscription                          |

Swagger docs are served at `/` when `RUN_ENVIROMENT` ≠ `production`.

---

## Run locally

```bash
git clone
cd subscription-microservice
npm install

# copy env file and edit
cp .env.example .env

# start service
npm start            # prod build
npm run start:dev    # ts-node + hot-reload
```

Default port **3000** (override with `PORT`).

---

## Environment variables (`.env.example`)

```dotenv
PORT=3000
RUN_ENVIROMENT=development   # or test / production
URL=http://localhost:3000    # base URL (used in e-mail templates)

# PostgreSQL (Sequelize)
DEVELOPMENT_DB_URL=postgres//...............
TEST_DB_URL=postgres://.....................
PRODUCTION_DB_URL=postgres://...............
```

---

## The list of all used tools

### Core

- **Runtime** – `Node.js`
- **Language** – `TypeScript`
- **Framework** –` NestJS`
- **Package manager** – `npm`

### Tooling

- Linting – `ESLint`
- Formatting – `Prettier`
- Config – `dotenv`
- Docs – `Swagger`
- Tests – `Jest, Supertest (e2e), Dependency-Cruiser (arch)`
- Containerisation – `Docker, docker-compose`

### Infrastructure

- **Network** – `@nestjs/axios`
- **Logging** – `Winston`
