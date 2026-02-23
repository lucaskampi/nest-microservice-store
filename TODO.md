# Microservices Implementation TODO

## ✅ COMPLETED

### Phase 1: Store Service (Backend) 📦
- [x] Basic NestJS setup
- [x] Products CRUD operations
- [x] Prisma ORM with SQLite
- [x] Swagger documentation
- [x] Purchase Entity & Module
- [x] Purchase DTOs (CreatePurchase, Address, PurchaseItem, Voucher, InfoOrder, InfoProvider, InfoDelivery)
- [x] HTTP Clients for Inter-Service Communication (SupplierClient, CarrierClient)
- [x] Purchase Flow Implementation (RECEIVED → ORDER_REQUESTED → RESERVE_DELIVERED)
- [x] Basic error handling with state persistence
- [x] RabbitMQ integration for async processing
- [x] Health check endpoints (/health, /health/live, /health/ready)
- [x] Unit tests with Jest

### Phase 2: Supplier Service 🏭
- [x] NestJS project scaffolded
- [x] Mock endpoints (GET /api/info/:state, POST /api/order)
- [x] Basic service logic with mock data
- [x] Swagger documentation
- [x] Dockerfile
- [x] PostgreSQL integration with Prisma schema
- [x] Real entities (Product, Order, OrderItem, Provider)
- [x] RabbitMQ consumer for purchase.created queue
- [x] RabbitMQ publisher for order.completed queue
- [x] Health check endpoints
- [x] Unit tests with Jest

### Phase 3: Carrier Service 🚚
- [x] NestJS project scaffolded
- [x] Mock endpoint (POST /api/delivery)
- [x] Basic service logic with mock data
- [x] Swagger documentation
- [x] Dockerfile
- [x] MySQL integration with Prisma schema
- [x] Real entities (Delivery)
- [x] RabbitMQ consumer for order.completed queue
- [x] RabbitMQ publisher for delivery.completed queue
- [x] Health check endpoints
- [x] Unit tests with Jest

### Phase 4: API Gateway 🚪
- [x] NestJS Gateway created
- [x] JWT validation middleware
- [x] Route proxying to all services
- [x] Rate limiting (100 req/min)
- [x] CORS configuration
- [x] Request/Response logging
- [x] Protected vs Public routes
- [x] Swagger documentation
- [x] Health check endpoints
- [x] E2E tests with Supertest
- [x] Jest configuration

### Phase 5: Authentication Service 🔐
- [x] NestJS Auth service created
- [x] JWT token generation
- [x] User registration & login
- [x] Passport.js integration (local + JWT strategies)
- [x] Role-based access control (USER, ADMIN)
- [x] Password hashing with bcrypt
- [x] SQLite database with Prisma
- [x] Protected endpoints
- [x] Health check endpoints
- [x] Unit tests with Jest

### Infrastructure
- [x] Docker Compose configuration (all 5 services + PostgreSQL + MySQL + RabbitMQ + Jaeger)
- [x] Individual Dockerfiles for each service
- [x] Environment variable configuration
- [x] README files per service
- [x] Shared package (`packages/shared`) with common DTOs, enums, interfaces
- [x] GitHub Actions CI/CD workflow
- [x] Correlation ID middleware
- [x] Structured logging with Pino

## 🚧 IN PROGRESS / TODO

### Circuit Breaker
- [ ] Add Circuit Breaker (opossum library) to Store service for resilience
- [ ] Retry policies for failed external calls

### Service Discovery
- [ ] Consul setup (optional - can use Docker DNS)
- [ ] Dynamic service discovery in Gateway

### Config Server
- [ ] Centralized configuration service (optional)
- [ ] Environment-specific configs

### Monitoring & Logging
- [x] OpenTelemetry integration (basic setup)
- [x] Distributed tracing with Jaeger
- [x] Correlation IDs across services
- [x] Structured logging (Pino)
- [ ] Prometheus metrics collection
- [ ] Grafana dashboards

### Testing
- [x] Unit tests for each service
- [x] E2E tests through Gateway
- [ ] Contract tests between services
- [ ] Load testing

## 🎯 NEXT STEPS (Priority Order)

1. **High Priority**
   - [x] RabbitMQ async purchase flow
   - [x] PostgreSQL for Supplier
   - [x] MySQL for Carrier
   - [x] Shared DTOs package
   - [x] Health checks
   - [x] CI/CD pipeline
   - [ ] Add circuit breaker for resilience
   - [ ] Increase test coverage to 100%

2. **Medium Priority**
   - [x] Health checks and monitoring
   - [x] Better error handling and logging
   - [ ] Service Discovery (optional)

3. **Low Priority**
   - [ ] Config Server
   - [ ] Advanced observability
   - [ ] Load testing

## 🚀 FUTURE: SPLIT INTO SEPARATE REPOSITORIES

Once the monorepo is stable and tested:
- Split each service into its own repository
- Publish shared package to npm registry
- Set up independent CI/CD pipelines per service
- Configure Kubernetes manifests for deployment
