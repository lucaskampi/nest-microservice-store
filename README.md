# NestJS Microservices Store - Complete Architecture

> A production-ready microservices architecture built with NestJS, featuring API Gateway, JWT authentication, RabbitMQ message queue, service orchestration, and inter-service communication. Inspired by Spring Boot microservices patterns.

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=flat&logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)
[![Jaeger](https://img.shields.io/badge/Jaeger-60BEF5?style=flat&logo=jaeger&logoColor=white)](https://www.jaegertracing.com/)

## Project Overview

This is a **complete microservices ecosystem** demonstrating professional software architecture patterns. Designed as a portfolio project showcasing:

- **Microservices Architecture** - 5 independent services with async communication
- **Message Queue** - RabbitMQ for event-driven architecture
- **Circuit Breaker** - Resilience pattern for external service calls
- **Authentication & Authorization** - JWT-based auth with role-based access control
- **API Gateway Pattern** - Single entry point with intelligent routing
- **Multi-Database Strategy** - SQLite, PostgreSQL, and MySQL
- **Distributed Tracing** - Jaeger + OpenTelemetry
- **Health Checks** - Liveness and readiness probes
- **Containerization** - Docker & Docker Compose ready
- **CI/CD** - GitHub Actions with test coverage

### What This Project Demonstrates

**For recruiters and potential employers**, this project shows expertise in:
- Building scalable distributed systems with async messaging
- Implementing industry-standard authentication patterns
- Service-to-service communication via message queues
- Multi-database architecture (SQLite, PostgreSQL, MySQL)
- API design and documentation
- DevOps practices (Docker, CI/CD)
- Resilience patterns (Circuit Breaker)
- Observability (Distributed Tracing)
- Production-ready code organization

## Architecture

This is a **monorepo** containing all microservices. In production, these services would be deployed independently.

### Services Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT                                   │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              API GATEWAY (Port 5000)                            │
│  • Single entry point for all services                         │
│  • JWT token validation                                        │
│  • Rate limiting & CORS                                        │
│  • Health checks                                               │
└────┬─────────┬─────────┬─────────┬──────────────────────────────┘
     │         │         │         │
     │         │         │         └──────────┐
     │         │         │                    │
     ▼         ▼         ▼                    ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────────┐
│  AUTH   │ │  STORE  │ │SUPPLIER │ │   CARRIER    │
│  :4088  │ │  :4000  │ │  :4001  │ │    :4002     │
└─────────┘ └─────────┘ └─────────┘ └──────────────┘
│ SQLite  │ │ SQLite  │ │PostgreSQL│ │    MySQL     │
│Users    │ │Products │ │Orders    │ │Deliveries    │
│JWT      │ │Purchases│ │Products  │ │Vouchers      │
└─────────┘ └────┬────┘ └────┬─────┘ └──────┬───────┘
                  │            │               │
                  │    ┌───────┴───────┐      │
                  │    │   RABBITMQ    │◄─────┘
                  │    │   :5672       │
                  │    │               │
                  │    │ purchase.     │ order.
                  │    │ created ──►   │ completed ──►
                  │    │               │ delivery.
                  │    └───────────────┘ completed
                  │
                  ▼
            ┌────────────────┐
            │    JAEGER     │
            │   :16686      │
            └────────────────┘
```

### Service Responsibilities

| Service | Port | Purpose | Database | Status |
|---------|------|---------|----------|--------|
| **API Gateway** | 5000 | Routes requests, validates JWT, rate limiting | None | ✅ Complete |
| **Auth Service** | 4088 | User authentication, JWT token issuance | SQLite | ✅ Complete |
| **Store Service** | 4000 | Product catalog, purchase orchestration | SQLite | ✅ Complete |
| **Supplier Service** | 4001 | Order fulfillment, inventory management | PostgreSQL | ✅ Complete |
| **Carrier Service** | 4002 | Delivery scheduling, voucher generation | MySQL | ✅ Complete |

### Infrastructure Services

| Service | Port | Purpose |
|---------|------|---------|
| **RabbitMQ** | 5672/15672 | Message queue for async communication |
| **Jaeger** | 16686 | Distributed tracing |
| **PostgreSQL** | 5432 | Supplier database |
| **MySQL** | 3306 | Carrier database |

## Async Purchase Flow

```
1. Client POST /purchases
         │
2. Gateway validates JWT
         │
3. Store creates Purchase (state: RECEIVED)
         │
4. Store publishes to 'purchase.created' queue
         │
5. Supplier consumes, processes, publishes 'order.completed'
         │
6. Carrier consumes, books delivery, publishes 'delivery.completed'
         │
7. Store updates Purchase (state: RESERVE_DELIVERED)
         │
8. Client can poll for purchase status
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker & Docker Compose

### Run All Services with Docker Compose

```bash
# Start all services (including databases, RabbitMQ, Jaeger)
docker-compose up --build

# Or run in background
docker-compose up -d
```

### Services Available
- **Gateway**: http://localhost:5000
- **Auth**: http://localhost:4088/api
- **Store**: http://localhost:4000/api
- **Supplier**: http://localhost:4001/api
- **Carrier**: http://localhost:4002/api
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)
- **Jaeger UI**: http://localhost:16686

### Run Locally (Without Docker)

```bash
# Install dependencies
npm install

# Start each service in separate terminals
npm run dev:auth      # Auth Service (4088)
npm run dev:store     # Store Service (4000)
npm run dev:supplier  # Supplier Service (4001)
npm run dev:carrier   # Carrier Service (4002)
npm run dev:gateway   # API Gateway (5000)
```

## API Usage

### Authentication

```bash
# Register
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Products (Public)

```bash
curl http://localhost:5000/products
curl http://localhost:5000/products/1
```

### Purchases (Protected)

```bash
# Get token first, then:
TOKEN="your-jwt-token"

# Create purchase
curl -X POST http://localhost:5000/purchases \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"id": 1, "amount": 2}],
    "address": {"street": "Main St", "number": 123, "state": "SP"}
  }'

# Get all purchases
curl http://localhost:5000/purchases \
  -H "Authorization: Bearer $TOKEN"
```

### Health Checks

```bash
# Main health check
curl http://localhost:5000/health

# Liveness probe
curl http://localhost:5000/health/live

# Readiness probe
curl http://localhost:5000/health/ready
```

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:cov
```

## Project Structure

```
nest-microservice-store/
├── .github/workflows/     # GitHub Actions CI/CD
├── packages/shared/       # Shared DTOs, enums, message types
├── auth/                 # Auth Service (SQLite)
├── backend/              # Store Service (SQLite)
├── supplier/             # Supplier Service (PostgreSQL)
├── carrier/              # Carrier Service (MySQL)
├── gateway/               # API Gateway
├── docker-compose.yml    # All services + infrastructure
├── COMMIT.md             # Atomic commit guide
└── README.md
```

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **NestJS** | Backend framework |
| **TypeScript** | Programming language |
| **Prisma** | ORM & Migrations |
| **RabbitMQ** | Message queue |
| **Jaeger** | Distributed tracing |
| **Passport.js** | Authentication |
| **JWT** | Token-based auth |
| **Docker** | Containerization |

## Portfolio Highlights

This project demonstrates:

1. **Microservices Architecture** - 5 independent services
2. **Event-Driven Design** - RabbitMQ message queues
3. **Resilience Patterns** - Circuit breaker implementation
4. **Multi-Database** - SQLite, PostgreSQL, MySQL
5. **Observability** - Jaeger tracing
6. **Production Patterns** - Health checks, rate limiting
7. **CI/CD** - GitHub Actions with coverage

## License

MIT License - feel free to use for learning and portfolio purposes.
