[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)](./LICENSE)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)

- **Hosted API**: [software-engineering-school-5-0-kvachikk.onrender.com](https://software-engineering-school-5-0-kvachikk.onrender.com)
- **Swagger**: [software-engineering-school-5-0-kvachikk.onrender.com/docs](https://software-engineering-school-5-0-kvachikk.onrender.com/docs)
- **Example Request**: [software-engineering-school-5-0-kvachikk.onrender.com/api/weather?city=Rivne](https://software-engineering-school-5-0-kvachikk.onrender.com/api/weather?city=Rivne)


## [Testing](https://github.com/GenesisEducationKyiv/software-engineering-school-5-0-kvachikk/blob/hw-4-tests/docs/testing.md)

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
    npm run start
```

## How to set up ```.env``` [(.env.example)](https://github.com/GenesisEducationKyiv/software-engineering-school-5-0-kvachikk/blob/hw-5-gof/.env.example)
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
