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

### Phase 2: Supplier Service 🏭
- [x] NestJS project scaffolded
- [x] Mock endpoints (GET /api/info/:state, POST /api/order)
- [x] Basic service logic with mock data
- [x] Swagger documentation
- [x] Dockerfile
- [ ] Database (PostgreSQL + Prisma schema)
- [ ] Real entities (Product, Order, OrderItem, InfoProvider)

### Phase 3: Carrier Service 🚚
- [x] NestJS project scaffolded
- [x] Mock endpoint (POST /api/delivery)
- [x] Basic service logic with mock data
- [x] Swagger documentation
- [x] Dockerfile
- [ ] Database (MySQL + Prisma schema)
- [ ] Real entities (Delivery)

### Phase 5: API Gateway 🚪
- [x] NestJS Gateway created
- [x] JWT validation middleware
- [x] Route proxying to all services
- [x] Rate limiting (100 req/min)
- [x] CORS configuration
- [x] Request/Response logging
- [x] Protected vs Public routes
- [x] Swagger documentation

### Phase 6: Authentication Service 🔐
- [x] NestJS Auth service created
- [x] JWT token generation
- [x] User registration & login
- [x] Passport.js integration (local + JWT strategies)
- [x] Role-based access control (USER, ADMIN)
- [x] Password hashing with bcrypt
- [x] SQLite database with Prisma
- [x] Protected endpoints

### Infrastructure
- [x] Docker Compose configuration (all 5 services)
- [x] Individual Dockerfiles for each service
- [x] Environment variable configuration
- [x] README files per service

## 🚧 IN PROGRESS / TODO

### Phase 1: Store Service Enhancements
- [ ] Circuit Breaker & Resilience (opossum library)
- [ ] Retry policies for external calls
- [ ] Better timeout handling

### Phase 2: Supplier Service - Database
- [ ] PostgreSQL integration
- [ ] Prisma schema with Product, Order, OrderItem entities
- [ ] Database migrations
- [ ] Real business logic for inventory management

### Phase 3: Carrier Service - Database
- [ ] MySQL integration
- [ ] Prisma schema with Delivery entity
- [ ] Database migrations
- [ ] Real delivery scheduling logic

### Phase 4: Service Discovery 🔍
- [ ] Consul setup (recommended for Node.js)
- [ ] Service registration on startup
- [ ] Health check endpoints
- [ ] Dynamic service discovery in Gateway
- [ ] Load balancing across instances

### Phase 7: Config Server ⚙️
- [ ] Centralized configuration service
- [ ] Environment-specific configs (dev, staging, prod)
- [ ] Secrets management
- [ ] Config refresh without restart

### Phase 8: Monitoring & Logging 📊
- [ ] OpenTelemetry integration
- [ ] Distributed tracing with Jaeger
- [ ] Correlation IDs across services
- [ ] Prometheus metrics collection
- [ ] Grafana dashboards
- [ ] Centralized logging (ELK Stack or Loki)
- [ ] Winston/Pino structured logging
- [ ] Error alerting (Sentry or similar)

### Shared Package
- [ ] Create `packages/shared` with common DTOs
- [ ] TypeScript types for inter-service communication
- [ ] Shared validation rules
- [ ] Common error types

### Testing
- [ ] Unit tests for each service
- [ ] Integration tests
- [ ] E2E tests through Gateway
- [ ] Contract tests between services
- [ ] Load testing

### CI/CD
- [ ] GitHub Actions workflows
- [ ] Automated testing
- [ ] Docker image builds
- [ ] Deployment pipelines

## 🎯 NEXT STEPS (Priority Order)

1. **High Priority**
   - Add circuit breaker to Store service
   - Persist Supplier service (PostgreSQL)
   - Persist Carrier service (MySQL)
   - Create shared DTOs package

2. **Medium Priority**
   - Service Discovery (Consul)
   - Health checks and monitoring
   - Better error handling and logging

3. **Low Priority**
   - Config Server
   - Full observability stack
   - Advanced testing suite

## 🚀 FUTURE: SPLIT INTO SEPARATE REPOSITORIES

Once the monorepo is stable and tested:
- Split each service into its own repository
- Publish shared package to npm registry
- Set up independent CI/CD pipelines per service
- Configure Kubernetes manifests for deployment

