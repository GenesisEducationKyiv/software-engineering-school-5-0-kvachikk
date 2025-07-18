[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)](./LICENSE)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)

# Weather API
- **Link**: [software-engineering-school-5-0-kvachikk.onrender.com](https://software-engineering-school-5-0-kvachikk.onrender.com)
- **Example Request**: [/weather/forecast?city=Kyiv](https://software-engineering-school-5-0-kvachikk.onrender.com/weather/forecast?city=Kyiv)

---

## Running locally:

```bash
git clone https://github.com/GenesisEducationKyiv/software-engineering-school-5-0-kvachikk
```

```bash
cd software-engineering-school-5-0-kvachikk
```

```bash
npm install
```

```
----YOU MUST SETUP .env ------
```

```bash
npm start
```

## How to set up ```.env``` [(.env.example)](https://github.com/GenesisEducationKyiv/software-engineering-school-5-0-kvachikk/blob/main/.env.example)
#### Redis
```dotenv
REDIS_HOST=localhost
REDIS_PORT=6379
```

#### Database
1. You can use any Postgres database provider (for example [Neon](https://neon.com/))
2. Get connection string and paste into ```.env```
```dotenv
TEST_DB_URL=postgresql://.....
DEVELOPMENT_DB_URL=postgresql://.....
PRODUCTION_DB_URL=postgresql://......
```

#### Resend (email provider)
1. Register domain via any provider (for example [Google Cloud](https://cloud.google.com/domains/docs/register-domain))
2. Register it on Resend.com
3. Get API KEY and SENDER EMAIL
```dotenv
MAIL_PROVIDER_API_KEY=re_PXd54sfg...........
MAIL_PROVIDER_SENDER_EMAIL=mail@mail.com..........
```

#### WeatherAPI (weather forecast provider)
1. Register account  [weatherapi.com](https://www.weatherapi.com/)
2. Get API_KEY
```dotenv
WEATHERAPI_API_URL=https://api.weatherapi.com/v1
WEATHERAPI_API_KEY=adf234..........
```

#### OpenWeatherMap (weather forecast provider)
1. Register account  [openweathermap.org](https://openweathermap.org/)
2. Get API_KEY (appid)

```dotenv
OPEN_WEATHER_API_URL=https://api.openweathermap.org/data/2.5
OPEN_WEATHER_API_KEY=asdas...........
```

#### OpenWeatherGeo
```dotenv
OPEN_WEATHER_GEO_URL=http://api.openweathermap.org/geo/1.0/direct
OPEN_WEATHER_GEO_KEY=asdas...........
```

---


## Testing
```
npm test            # runs unit -> api e2e -> ui e2e
```

green check marks will be shown at each stage, if you do not see them, then the tests have failed


## run tests separately:

### UNIT tests
```
npm run test:unit
```

### API e2e tests
```
npm run test:e2e
```

### UI e2e tests (playwright)
```
npm install
```
```
npx playwright install --with-deps
``` 
```
npm run test:ui
```

### architecture tests (dependency rules, import structure):
```
npm run test:arch
```

# List of all used tools
- runtime - ```Node.js```
- language - ```TypeScript```
- framework - ```NestJS```
- package management - ```npm```

<br/>

- linting - ```ESLint```
- formatting - ```Prettier```
- configurations - ```dotenv```
- API documentation - ```Swagger (via @nestjs/swagger)```

<br/>

- CI/CD - ```GitHub Actions```
- containerization - ```Docker, docker-compose```
- monitoring - ```Prometheus```
- visualization - ```Grafana```
- logging - ```Winston, nest-winston```
- caching - ```Redis (via cache-manager, cache-manager-redis-store, ioredis)```

<br/>

- ORM - ```Sequelize, sequelize-typescript```
- database - ```PostgreSQL (main), SQLite (for tests)```
- database migration - ```Umzug (via Sequelize CLI)```

<br/>

- network - ```Axios (via @nestjs/axios)```
- cross-origin resource sharing - ```cors```
- email sending - ```Resend (resend npm package)```

<br/>

- validation - ```Joi```
- templating - ```Handlebars```
- scheduling - ```@nestjs/schedule```
- Unit & e2e testing  - ```Jest, @nestjs/testing, supertest```
- UI e2e testing - ```Playwright (@playwright/test, playwright)```
- architecture testing - ```Dependency Cruiser (dependency-cruiser)```

<br/>

- static file serving -``` @nestjs/serve-static```