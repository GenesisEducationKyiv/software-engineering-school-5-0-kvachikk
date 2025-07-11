# Weather Microservice

[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)](./LICENSE)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Prometheus](https://img.shields.io/badge/prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)

> Lightweight microservice that aggregates weather data from several public APIs, caches responses in Redis, exposes a REST interface and Prometheus metrics.

---

## Quick links

- **Swagger** – `/` once service is running (dev mode)
- **Sample request** – `/weather/forecast?city=Kyiv`
-

## Endpoints

| Method | Path                      | Description        |
| ------ | ------------------------- | ------------------ |
| GET    | `/weather/current?city=`  | Current weather    |
| GET    | `/weather/forecast?city=` | 3-day forecast     |
| GET    | `/metrics`                | Prometheus metrics |

---

## Run locally

```bash
git clone <repo-url>
cd weather-microservice
npm install
```

1. Copy `.env.example` to `.env` and fill in the API keys / Redis host.
2. Start:

```bash
npm start
```

Service listens on `$PORT` (default `3000`).

---

## Environment variables (`.env.example`)

```dotenv
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# WeatherAPI
WEATHERAPI_API_URL=https://api.weatherapi.com/v1
WEATHERAPI_API_KEY=xxxxxxxxxxxxxxxx

# OpenWeather
OPEN_WEATHER_API_URL=https://api.openweathermap.org/data/2.5
OPEN_WEATHER_API_KEY=xxxxxxxxxxxxxxxx

# OpenWeather GEO
OPEN_WEATHER_GEO_URL=http://api.openweathermap.org/geo/1.0/direct
OPEN_WEATHER_GEO_KEY=xxxxxxxxxxxxxxxx
```

---

## npm scripts

| Script              | Purpose                                |
| ------------------- | -------------------------------------- |
| `npm start`         | run prod build                         |
| `npm run start:dev` | run with ts-node + hot-reload          |
| `npm test`          | run all tests (unit → api e2e → arch)  |
| `npm run test:unit` | Jest unit tests                        |
| `npm run test:e2e`  | API e2e tests                          |
| `npm run test:arch` | dependency-cruiser architecture tests  |
| `npm run lint`      | ESLint                                 |
| `npm run build`     | tsc compile to `dist/`                 |
| `docker compose up` | run service + redis + prometheus stack |

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
- Monitoring – `Prometheus / Grafana`
- Containerisation – `Docker, docker-compose`

### Infrastructure

- **Cache** – `Redis` (via `cache-manager`)
- **Network** – `@nestjs/axios`
- **Logging** – `Winston`
