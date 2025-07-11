# Emailer Microservice

[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)](./LICENSE)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Resend](https://img.shields.io/badge/email-Resend-ff69b4?style=for-the-badge)

> Lightweight **microservice** that stores newsletter subscriptions, renders templated e-mails and sends them on schedule via [Resend](https://resend.com/).

---

## Quick links

> Email delivery is triggered by internal cron jobs – there is no public REST API for this service.

---

## Run locally

```bash
 git clone
 cd emailer-microservice
 npm install
```

1. Copy `.env.example` into `.env` and fill in mandatory variables (DB & Resend)
2. Start:

```bash
npm start            # prod build
npm run start:dev    # ts-node + hot-reload
```

Service listens on `$PORT` (default `4000`).

---

## Environment variables (`.env.example`)

```dotenv
PORT=4000
RUN_ENVIROMENT=development        # or test / production
URL=http://localhost:4000         # base URL used in email templates

DEVELOPMENT_DB_URL=postgres:/...........
TEST_DB_URL=postgres://.................
PRODUCTION_DB_URL=postgres://...........

MAIL_PROVIDER_API_KEY=r_.........
MAIL_PROVIDER_SENDER_EMAIL=mail@..........
```

---

## npm scripts

| Script              | Purpose                |
| ------------------- | ---------------------- |
| `npm start`         | run prod build         |
| `npm run start:dev` | ts-node + hot-reload   |
| `npm test`          | run unit + arch tests  |
| `npm run lint`      | ESLint                 |
| `npm run build`     | tsc compile to `dist/` |
| `docker compose up` | service + postgres     |

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

- **Cache** – `Redis` (via `cache-manager`)
- **Network** – `@nestjs/axios`
- **Logging** – `Winston`
- **Scheduling** – `@nestjs/schedule`
- **Templates** -`Handlebars`
