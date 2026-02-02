# NestJS Microservices Store - Complete Architecture

> A production-ready microservices architecture built with NestJS, featuring API Gateway, JWT authentication, service orchestration, and inter-service communication. Inspired by Spring Boot microservices patterns, reimagined for the Node.js ecosystem.

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

## Project Overview

This is a **complete microservices ecosystem** demonstrating professional software architecture patterns. It's designed as a portfolio project showcasing:

- **Microservices Architecture** - 5 independent services working together
- **Authentication & Authorization** - JWT-based auth with role-based access control
- **API Gateway Pattern** - Single entry point with intelligent routing
- **Service Orchestration** - Complex multi-service workflows
- **Domain-Driven Design** - Separate bounded contexts (Store, Supplier, Carrier)
- **Containerization** - Docker & Docker Compose ready
- **API Documentation** - Swagger/OpenAPI for all services
- **Security** - Password hashing, token validation, protected routes

### What This Project Demonstrates

**For recruiters and potential employers**, this project shows expertise in:
- Building scalable distributed systems
- Implementing industry-standard authentication patterns
- Service-to-service communication and error handling
- Database design with multiple database types
- API design and documentation
- DevOps practices (Docker, environment configuration)
- Production-ready code organization and best practices

## Architecture

This is a **monorepo** containing all microservices in one place for easy development and testing. In production, these services would be deployed independently.

### Services Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT                                   │
└────────────────────┬────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│              API GATEWAY (Port 5000)                            │
│  • Single entry point for all services                          │
│  • JWT token validation                                         │
│  • Rate limiting & CORS                                         │
│  • Request/Response logging                                     │
└────┬─────────┬─────────┬─────────┬──────────────────────────────┘
  │         │         │         │
  │         │         │         └──────────┐
  │         │         │                    │
  ▼         ▼         ▼                    ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────────┐
│  AUTH   │ │  STORE  │ │SUPPLIER │ │   CARRIER    │
│  :4088  │ │  :4000  │ │  :4001  │ │    :4002     │
└─────────┘ └─────────┘ └─────────┘ └──────────────┘
│ SQLite  │ │ SQLite  │ │  Mock   │ │    Mock      │
│Users    │ │Products │ │  Data   │ │    Data      │
│JWT      │ │Purchases│ │         │ │              │
└─────────┘ └─────────┘ └─────────┘ └──────────────┘
```

### Service Responsibilities

| Service | Port | Purpose | Database | Status |
|---------|------|---------|----------|--------|
| **API Gateway** | 5000 | Routes requests, validates JWT, rate limiting | None | Complete |
| **Auth Service** | 4088 | User authentication, JWT token issuance | SQLite | Complete |
| **Store Service** | 4000 | Product catalog, purchase orchestration | SQLite | Complete |
| **Supplier Service** | 4001 | Order fulfillment, inventory management | Mock → PostgreSQL | Partial |
| **Carrier Service** | 4002 | Delivery scheduling, voucher generation | Mock → MySQL | Partial |

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker & Docker Compose (optional, for containerized setup)
- Git

### Option 1: Run All Services with Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/nest-microservice-store.git
cd nest-microservice-store

# Start all services
docker-compose up --build

# Services will be available at:
# - Gateway:  http://localhost:5000
# - Auth:     http://localhost:4088/api
# - Store:    http://localhost:4000/api
# - Supplier: http://localhost:4001/api
# - Carrier:  http://localhost:4002/api
```

### Option 2: Run Services Individually (Development)

Each service can be run independently for development:

```bash
# Terminal 1 - Auth Service
cd auth
npm install
npx prisma migrate dev
npm run dev

# Terminal 2 - Store Service  
cd backend
npm install
npx prisma migrate dev
npm run dev

# Terminal 3 - Supplier Service
cd supplier
npm install
npm run dev

# Terminal 4 - Carrier Service
cd carrier
npm install
npm run dev

# Terminal 5 - API Gateway
cd gateway
npm install
npm run dev
```

### First-Time Setup

After starting the services, create a test user:

```bash
# Register a new user
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Login to get JWT token
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Copy the access_token from the response and use it in requests:
# Authorization: Bearer YOUR_TOKEN_HERE
```

## API Usage Examples

### Public Endpoints (No Authentication Required)

```bash
# Get all products
curl http://localhost:5000/products

# Get single product
curl http://localhost:5000/products/1

# Create a product
curl -X POST http://localhost:5000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "sku": "LAP-001",
    "price": 999.99
  }'
```

### Protected Endpoints (JWT Required)

```bash
# First, get your token by logging in
TOKEN=$(curl -s -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  | jq -r '.access_token')

# Create a purchase (this triggers the full microservices flow)
curl -X POST http://localhost:5000/purchases \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"id": 1, "amount": 2}
    ],
    "address": {
      "street": "123 Main St",
      "number": 456,
      "state": "SP"
    }
  }'

# Get all purchases
curl http://localhost:5000/purchases \
  -H "Authorization: Bearer $TOKEN"

# Get user profile
curl http://localhost:5000/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

## The Purchase Flow (Microservices in Action)

This demonstrates the power of microservices orchestration:

```
1. Client sends POST /purchases with items and address
        ↓
2. Gateway validates JWT token
        ↓
3. Gateway forwards to Store Service
        ↓
4. Store creates Purchase (state: RECEIVED)
        ↓
5. Store → Supplier: GET /info/:state (get provider address)
        ↓
6. Store → Supplier: POST /order (place order)
        ↓
7. Store updates Purchase (state: ORDER_REQUESTED)
        ↓
8. Store → Carrier: POST /delivery (book delivery)
        ↓
9. Store updates Purchase (state: RESERVE_DELIVERED)
        ↓
10. Store returns complete Purchase with voucher
        ↓
11. Gateway returns response to client
```

Each step is independently handled by different services, demonstrating true microservices architecture.

## API Documentation

Each service has its own Swagger documentation:

- **Gateway**: http://localhost:5000/docs
- **Auth**: http://localhost:4088/api/docs
- **Store**: http://localhost:4000/api/docs
- **Supplier**: http://localhost:4001/api/docs
- **Carrier**: http://localhost:4002/api/docs

## Why a Monorepo?

This project uses a **monorepo structure** for several strategic reasons:

### Development Benefits
- **Fast local development** - Run and test all services together
- **Shared development environment** - Consistent Node/npm versions
- **Easy refactoring** - Change interfaces across services atomically
- **Simplified dependency management** - Single node_modules per service
- **Unified CI/CD during development** - Test integration in one pipeline

### Current Structure
```
nest-microservice-store/
├── gateway/          # API Gateway (Port 5000)
├── auth/            # Auth Service (Port 4088)
├── backend/         # Store Service (Port 4000)
├── supplier/        # Supplier Service (Port 4001)
├── carrier/         # Carrier Service (Port 4002)
├── docker-compose.yml
└── README.md
```

## Migration Path: Monorepo → Separate Repositories

**This is designed to be split later.** Here's the planned evolution:

### Phase 1: Monorepo (Current) ✅
- All services in one repo
- Shared development and testing
- Fast iteration and learning

### Phase 2: Preparation
- [ ] Extract shared DTOs to `packages/shared`
- [ ] Add service-specific CI/CD workflows
- [ ] Create independent Docker images
- [ ] Document inter-service contracts

### Phase 3: Split into Microrepos
Each service becomes its own repository:
- `nest-microservice-gateway`
- `nest-microservice-auth`
- `nest-microservice-store`
- `nest-microservice-supplier`
- `nest-microservice-carrier`
- `nest-microservices-shared` (npm package)

### Migration Strategy
```bash
# Use git subtree to preserve history
git subtree split -P gateway -b gateway-only
git push git@github.com:user/nest-microservice-gateway.git gateway-only:main

# Repeat for each service
```

### Benefits After Split
- Independent deployment cycles
- Team ownership per service
- Service-specific CI/CD pipelines
- Smaller codebases and faster builds
- 🔒 Better access control and security boundaries

## Technical Highlights

### 1. API Gateway Pattern
- **Centralized Entry Point**: All client requests go through one gateway
- **JWT Validation**: Token verification happens once at the gateway
- **Rate Limiting**: 100 requests per minute per IP
- **Service Abstraction**: Clients don't need to know about internal service topology

### 2. Microservices Communication
- **HTTP/REST**: Synchronous service-to-service calls
- **Error Resilience**: Services return last known state on failure
- **State Management**: Purchase state tracked through entire flow

### 3. Authentication & Security
- **JWT Tokens**: Stateless authentication
- **Bcrypt Password Hashing**: Industry-standard password security
- **Passport.js Strategies**: Local (email/password) and JWT validation
- **Role-Based Access Control**: USER and ADMIN roles
- **Protected Routes**: Fine-grained authorization

### 4. Database Architecture
- **Multi-Database Strategy**: Each service can have its own database type
  - Auth: SQLite (lightweight for user data)
  - Store: SQLite (development - can migrate to PostgreSQL)
  - Supplier: PostgreSQL (planned - for complex inventory)
  - Carrier: MySQL (planned - for delivery tracking)
- **Prisma ORM**: Type-safe database access
- **Migrations**: Version-controlled schema changes

### 5. Development Best Practices
- **TypeScript**: Full type safety across all services
- **NestJS**: Enterprise-grade Node.js framework
- **Swagger/OpenAPI**: Auto-generated API documentation
- **Docker**: Containerized services for consistent environments
- **Environment Configuration**: 12-factor app principles
- **Modular Architecture**: Clear separation of concerns

## Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **NestJS** | Backend framework | ^10.0 |
| **TypeScript** | Programming language | ^5.0 |
| **Prisma** | ORM & Migrations | ^4.16 |
| **Passport.js** | Authentication | ^0.7 |
| **JWT** | Token-based auth | ^10.0 |
| **Bcrypt** | Password hashing | ^5.1 |
| **Swagger** | API Documentation | ^8.0 |
| **Axios** | HTTP client | ^1.13 |
| **Docker** | Containerization | Latest |
| **SQLite/PostgreSQL/MySQL** | Databases | Various |

## Project Structure

```
nest-microservice-store/
│
├── gateway/                    # API Gateway Service
│   ├── src/
│   │   ├── auth/              # Auth proxy controller
│   │   ├── proxy/             # Service routing logic
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
│
├── auth/                       # Authentication Service
│   ├── prisma/
│   │   └── schema.prisma      # User model
│   ├── src/
│   │   ├── auth/              # JWT strategies
│   │   ├── users/             # User management
│   │   └── main.ts
│   └── package.json
│
├── backend/                    # Store Service
│   ├── prisma/
│   │   └── schema.prisma      # Product & Purchase models
│   ├── src/
│   │   ├── products/          # Product CRUD
│   │   ├── purchases/         # Purchase orchestration
│   │   ├── http-clients/      # Supplier & Carrier clients
│   │   └── main.ts
│   └── package.json
│
├── supplier/                   # Supplier Service
│   ├── src/
│   │   ├── app.service.ts     # Order & inventory logic
│   │   └── main.ts
│   └── package.json
│
├── carrier/                    # Carrier Service
│   ├── src/
│   │   ├── app.service.ts     # Delivery scheduling
│   │   └── main.ts
│   └── package.json
│
├── docker-compose.yml          # All services orchestration
├── TODO.md                     # Implementation checklist
├── ARCHITECTURE.md             # Architecture diagrams
├── PURCHASE_FLOW.md            # Purchase flow documentation
└── README.md                   # This file
```

## Learning Outcomes

This project demonstrates understanding of:

### Software Architecture
- Microservices design patterns
- API Gateway pattern
- Service mesh concepts
- Domain-Driven Design (DDD)
- Separation of concerns

### Backend Development
- RESTful API design
- Authentication & authorization
- Database modeling
- ORM usage and migrations
- Error handling and resilience

### DevOps & Infrastructure
- Containerization with Docker
- Service orchestration
- Environment management
- Multi-service deployment
- Port management and networking

### Security
- JWT token lifecycle
- Password hashing
- Protected routes
- CORS configuration
- Rate limiting

## Roadmap & Next Steps

### Immediate Improvements (In Progress)
- [ ] Circuit Breaker pattern for resilience (using opossum)
- [ ] Persist Supplier service with PostgreSQL
- [ ] Persist Carrier service with MySQL
- [ ] Create `packages/shared` for common DTOs
- [ ] Health check endpoints for all services

### Medium-term Goals
- [ ] Service Discovery with Consul
- [ ] Distributed tracing with OpenTelemetry & Jaeger
- [ ] Centralized logging with ELK Stack
- [ ] Prometheus metrics & Grafana dashboards
- [ ] Redis for session management and caching
- [ ] Message queue (RabbitMQ/Kafka) for async communication

### Long-term Vision
- [ ] Kubernetes deployment manifests
- [ ] CI/CD pipelines (GitHub Actions)
- [ ] Split into separate repositories
- [ ] Publish shared package to npm
- [ ] Integration & E2E test suites
- [ ] Load testing with k6 or Artillery
- [ ] Admin dashboard for monitoring

## Contributing

This is a portfolio project, but feedback and suggestions are welcome! Feel free to:
- Open issues for bugs or suggestions
- Submit pull requests for improvements
- Star the repository if you find it useful

## 📝 License

MIT License - feel free to use this project for learning and portfolio purposes.

## About This Project

This microservices architecture was built as a **portfolio demonstration project** to showcase:
- Professional software engineering practices
- Full-stack TypeScript development
- Complex distributed systems design
- Production-ready code quality

**Inspired by**: Spring Boot microservices patterns from [spring-microservice-loja](https://github.com/alessandracruz/Formacao-Microservicos-com-Spring-Cloud)

**Built with**: Modern Node.js ecosystem (NestJS, TypeScript, Prisma)

---

**Portfolio Note**: This project represents a complete, working microservices architecture suitable for production use (after adding monitoring and production databases). It demonstrates the ability to design, build, and deploy distributed systems with modern tools and best practices.

## Contact

Questions about this project? Feel free to reach out or open an issue.

---

If you find this project helpful for learning microservices, please give it a star!
