# nest-microservice-store

NestJS-based microservice store (inspired by Spring Boot microservices architecture).

## Overview

This is the **Store Service** in a microservices architecture. It coordinates purchase orders by communicating with Supplier and Carrier services.

## Features

### ✅ Completed
- **Products Module**: Full CRUD operations for products
- **Purchases Module**: Complete purchase flow with state management
  - Coordinates with Supplier service for order processing
  - Coordinates with Carrier service for delivery booking
  - Tracks purchase states: RECEIVED → ORDER_REQUESTED → RESERVE_DELIVERED
  - Error handling with state persistence
- **HTTP Clients**: Inter-service communication ready
- **Swagger Documentation**: Full API documentation at `/api/docs`
- **SQLite Database**: With Prisma ORM

## Quick Start

```bash
cd backend
npm install
npm run dev
```

Backend runs on http://localhost:4000/api
Swagger docs: http://localhost:4000/api/docs

## API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Purchases (NEW)
- `GET /api/purchases` - List all purchases
- `GET /api/purchases/:id` - Get purchase by ID
- `POST /api/purchases` - Create purchase order

## Purchase Flow

See [PURCHASE_FLOW.md](./PURCHASE_FLOW.md) for detailed documentation.

```
User Request
    ↓
Store Service
    ↓
1. Create Purchase (RECEIVED)
2. Get Provider Info → Supplier Service
3. Place Order → Supplier Service (ORDER_REQUESTED)
4. Book Delivery → Carrier Service (RESERVE_DELIVERED)
5. Return Complete Purchase with Voucher
```

## Architecture

This service is part of a planned microservices architecture:

- ✅ **Store Service** (Port 4000) - This repo
- 🔴 **Supplier Service** (Port 4001) - To be created
- 🔴 **Carrier Service** (Port 4002) - To be created
- 🔴 **API Gateway** (Port 5000) - To be created
- 🔴 **Auth Service** (Port 4088) - To be created
- 🔴 **Service Discovery** (Port 8761) - To be created

## Tech Stack

- **NestJS** - Backend framework
- **TypeScript** - Programming language
- **Prisma** - Database ORM
- **SQLite** - Database
- **Axios** - HTTP client for service communication
- **Swagger** - API documentation
- **Class Validator** - DTO validation

## Environment Variables

```env
PORT=4000
DATABASE_URL="file:./prisma/dev.db"
SUPPLIER_SERVICE_URL=http://localhost:4001/api
CARRIER_SERVICE_URL=http://localhost:4002/api
```

## Database

Migrations are managed with Prisma:

```bash
npx prisma migrate dev
npx prisma studio  # View database
```

## Development

```bash
npm run dev        # Development with hot reload
npm run build      # Build for production
npm run start      # Run production build
```

## Testing Purchase Flow

Currently, the purchase endpoint will fail because Supplier and Carrier services don't exist yet:

```bash
curl -X POST http://localhost:4000/api/purchases \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"id": 1, "amount": 2}],
    "address": {
      "street": "123 Main St",
      "number": 456,
      "state": "SP"
    }
  }'
```

## Next Steps

1. Create Supplier Service
2. Create Carrier Service
3. Implement Circuit Breaker pattern
4. Add Service Discovery
5. Create API Gateway
6. Add Authentication/Authorization

## Project Structure

```
backend/
├── src/
│   ├── products/         # Products CRUD module
│   ├── purchases/        # Purchase flow module (NEW)
│   │   ├── dto/         # Data transfer objects
│   │   ├── entities/    # Purchase entity
│   │   ├── purchases.controller.ts
│   │   ├── purchases.service.ts
│   │   └── purchases.module.ts
│   ├── http-clients/    # Inter-service communication (NEW)
│   │   ├── supplier.client.ts
│   │   ├── carrier.client.ts
│   │   └── http-clients.module.ts
│   ├── prisma/          # Database service
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/
└── package.json
```

## License

MIT
