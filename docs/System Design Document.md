# System Design Document: Weather Subscription API

## 1. System Requirements

Functional Requirements

- User can view the list of all available cities
- User can get the current weather and forecasts
- User can subscribe to weather updates for a specific city
- User can unsubscribe
- User can resubscribe
- User can change city for weather forecast
- User can write a letter to support team

- The system sends regular notifications (hourly, daily, weekly)
- The system warns about extreme weather events (thunderstorms, tornadoes, tsunamis)
- API for managing subscriptions (create, update, delete)
- Support for various notification types (email, webhook, push)

Non-Functional Requirements

- User-friendly frontend interaction (mobile & PC screens, dark & light theme, localization)
- Availability: 99.9% uptime
- Scalability: up to 1 million users and 1 billion notifications per day
- Reliability: guaranteed message delivery
- Performance: API response time under 1 second
- Security: authentication and data validation

Constraints

- Budget: 10 000$
- Deadline: 24 August 2025
- External API usage: max 1000 requests/hour
- Compliance: GDPR for users in the European Union

---

## 2. Load Estimation

Users and Traffic

- Active users: 50,000
- Subscriptions per user: 2-3 on average
- API requests: 1000 RPS (peak)
- Notifications: 500,000/day

Data

- User record: ~200 bytes
- Subscription record: ~300 bytes
- Weather cache: ~2 KB per city
- Total volume: ~100 GB/year

Bandwidth

- Incoming: 1 Mbps
- Outgoing: 5 Mbps (emails, webhooks)
- External API: 50 Mbps

## 3. High-Level Architecture

![High-Level Architecture](https://github.com/GenesisEducationKyiv/software-engineering-school-5-0-kvachikk/blob/hw-2-system-design/docs/High-level-architech.png?raw=true)

## 4. Detailed Component Design

4.1 API Service (Node.js / Express)
**Responsibilities:**

- Handling REST API requests
- User authentication
- Data validation
- CRUD operations for subscriptions

**Endpoints:**
- POST `/api/v1/subscription` - create a subscription
- GET `/api/v1/subscription/:id` - view one subscription
- PATCH `/api/v1/subscription/:id` - change (e.g. frequency)
- POST `/api/v1/subscription/:id/confirm` - confirm a subscription
- POST `/api/v1/subscription/:id/cancel` - cancel a subscription
- GET `/api/v1/subscription` - list of subscriptions

**Scaling:**

- Horizontal scaling via container orchestration

### 4.4 Weather API Integration

**Caching Strategy:**

- **L1 Cache (Redis):** 5-minute TTL for current weather data. This ensures users get fast responses without hitting the external API too often.
- **L2 Cache (Database):** 1-hour TTL for forecasts. Forecasts change less frequently, so it's safe to keep them a bit longer.
- **Fallback:** if the external weather API is unavailable, the system returns the last cached data so users still receive information.

This two-level caching helps reduce latency and lower the number of external requests, which is important due to the strict rate limit.

**Rate Limiting:**

```javascript
const rateLimiter = new RateLimiter({
    tokensPerInterval: 900, // 90% of the hourly limit
    interval: 'hour',
});
```

We use a rate limiter to make sure we don't exceed the API usage quota (1000 requests per hour). When the limit is close, we slow down or stop calls to the external API and rely on cached data instead. This helps avoid service disruptions and ensures the app works smoothly even under heavy load.
