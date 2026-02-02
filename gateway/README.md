# API Gateway

API Gateway for the microservices architecture.

## Features

- **Routing**: Proxies requests to Store, Supplier, and Carrier services
- **Authentication**: JWT validation via Auth service
- **Rate Limiting**: 100 requests per minute per IP
- **CORS**: Enabled for cross-origin requests
- **Logging**: Request/response logging with correlation IDs

## Routes

### Public (No Auth)
- `GET /products` → Store Service
- `GET /products/:id` → Store Service
- `POST /products` → Store Service

### Protected (Requires JWT)
- `GET /purchases` → Store Service
- `POST /purchases` → Store Service
- `GET /supplier/*` → Supplier Service
- `GET /carrier/*` → Carrier Service

### Auth Routes
- `POST /auth/register` → Auth Service
- `POST /auth/login` → Auth Service

## Quick Start

```bash
cd gateway
npm install
npm run dev
```

Gateway runs on http://localhost:5000

Swagger docs: http://localhost:5000/docs

## Usage Examples

### Register & Login
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

### Access Protected Routes
```bash
# Get purchases (requires token)
curl http://localhost:5000/purchases \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create purchase (requires token)
curl -X POST http://localhost:5000/purchases \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"id": 1, "amount": 2}],
    "address": {"street": "123 Main St", "number": 456, "state": "SP"}
  }'
```

### Public Routes (No Token)
```bash
# Get products
curl http://localhost:5000/products
```

## Environment Variables

```env
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
AUTH_SERVICE_URL=http://localhost:4088/api
STORE_SERVICE_URL=http://localhost:4000/api
SUPPLIER_SERVICE_URL=http://localhost:4001/api
CARRIER_SERVICE_URL=http://localhost:4002/api
```

## Architecture

```
Client → Gateway (5000)
         ├─ /auth/* → Auth Service (4088)
         ├─ /products → Store Service (4000) [Public]
         ├─ /purchases → Store Service (4000) [Protected]
         ├─ /supplier/* → Supplier Service (4001) [Protected]
         └─ /carrier/* → Carrier Service (4002) [Protected]
```
