## Key Features
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-green.svg)

- **Hosted API**: [https://software-engineering-school-5-0-kvachikk.onrender.com](https://software-engineering-school-5-0-kvachikk.onrender.com)
- **Swagger**: [https://software-engineering-school-5-0-kvachikk.onrender.com/docs](https://software-engineering-school-5-0-kvachikk.onrender.com/docs)
- **Example Request**: [https://software-engineering-school-5-0-kvachikk.onrender.com/api/weather?city=Rivne](https://software-engineering-school-5-0-kvachikk.onrender.com/api/weather?city=Rivne)

> **Known Issue**: Gmail's anti-spam system automatically follows all links in emails, which can cause automatic confirmation of subscriptions. The API works perfectly with other email providers like Proton Mail. Changing to POST requests would fix this, but that would require modifying the swagger specification.

## Running locally:
   ```
   git clone https://github.com/GenesisEducationKyiv/software-engineering-school-5-0-kvachikk
   ```
   ```
   cd software-engineering-school-5-0-kvachikk
   ```
   ```
   npm install
   ```
   ```
   npm start
   ```

Other available commands:
- `npm test`
- `npm run dev` (nodemon will restart local server when notice changes on project)


## Implemented Features

I tried to implement all the requirements that were given, maybe I missed something small, but the project still implements absolutely all the points of the task 

- **Weather Data Endpoint**: GET `/api/weather?city={city}` - Retrieves current weather for a specified city, including temperature, humidity, and weather description.
- **Subscription Endpoint**: POST `/api/subscribe` - Subscribes an email to weather updates for a specific city with selected frequency (daily or hourly).
- **Confirmation Endpoint**: GET `/api/confirm/{token}` - Confirms email subscription via token sent in the confirmation email.
- **Unsubscribe Endpoint**: GET `/api/unsubscribe/{token}` - Allows users to unsubscribe from weather updates using a token included in each weather update email.
- **Full API Documentation**: Available via Swagger UI at the `/docs` endpoint.
- **Bonus Features**:
  - Deployed API on Render hosting
  - Simple HTML subscription page
  - API covered with functional tests

---

## Technology Stack

### Core Technologies
- Node.js with Express.js
- PostgreSQL database (hosted on NeonDB) (tested with DataGrip)
- Sequelize ORM

### Key Dependencies
```
- axios@1.9.0
- cors@2.8.5
- dotenv@16.5.0
- express-validator@7.2.1
- express@5.1.0
- handlebars@4.7.8
- helmet@8.1.0
- jest@29.7.0
- morgan@1.10.0
- node-cron@4.0.5
- nodemailer@7.0.3
- nodemon@3.1.10
- pg-hstore@2.3.4
- pg@8.16.0
- sequelize-cli@6.6.3
- sequelize@6.37.7
- supertest@7.1.0
- swagger-ui-express@5.0.1
- umzug@3.8.2
- yamljs@0.3.0
```
