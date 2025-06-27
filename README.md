[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)](./LICENSE)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)

- **Hosted API**: [software-engineering-school-5-0-kvachikk.onrender.com](https://software-engineering-school-5-0-kvachikk.onrender.com)
- **Example Request**: [/weather?city=Rivne](https://software-engineering-school-5-0-kvachikk.onrender.com/weather?city=Rivne)

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

## How to set up ```.env``` [(.env.example)](https://github.com/GenesisEducationKyiv/software-engineering-school-5-0-kvachikk/blob/hw-6-redis/.env.example)
##### Resend (email provider)
1. Register domain via any provider (for example [Google Cloud](https://cloud.google.com/domains/docs/register-domain))
2. Register it on Resend.com
3. Get API KEY and SENDER EMAIL
```dotenv
MAIL_PROVIDER_API_KEY=re_...........
MAIL_PROVIDER_SENDER_EMAIL=mail@mail.com......
```
<br>

#### OpenWeatherMap (weather forecast provider)
1. Register account  [openweathermap.org](https://openweathermap.org/)
2. Get API_KEY (appid)

```dotenv
OPEN_WEATHER_API_URL=https://api.openweathermap.org/data/2.5
COORDINATES_API_URL=http://api.openweathermap.org/geo/1.0/direct?q=
OPEN_WEATHER_API_KEY=234sdf..........
```
<br>

#### WeatherAPI (additional weather forecast provider)
1. Register account  [weatherapi.com](https://www.weatherapi.com/)
2. Get API_KEY 
```dotenv
WEATHERAPI_API_URL=https://api.weatherapi.com/v1
WEATHERAPI_API_KEY=adf234..........
```

<br>

#### Hosted Database
1. You can use any Postgres database provider (for example [Neon](https://neon.com/))
2. Get connection string and paste into ```.env```
```dotenv
TEST_DB_URL=postgresql://.....
DEVELOPMENT_DB_URL=postgresql://.....
PRODUCTION_DB_URL=postgresql://......
```

<br>

#### Redis (cache manager)
```dotenv
REDIS_HOST=localhost
REDIS_PORT=6379
```

---


## Testing
```
npm test            # runs unit -> api e2e -> ui e2e
```

green check marks will be shown at each stage, if you do not see them, then the tests have failed


## run tests separately:

### unit tests
```
npm run test:unit
```

### api e2e tests
```
npm run test:e2e
```

### ui e2e tests (playwright)
```
npm install
```
```
npx playwright install --with-deps
``` 
```
npm run test:ui
```

## ci pipelines
* github actions already has three jobs:
    * `unit-tests` – jest unit tests
    * `e2e-api-tests` – jest api tests
    * `ui-tests` – playwright ui tests

all jobs run automatically on every push and pull request.
