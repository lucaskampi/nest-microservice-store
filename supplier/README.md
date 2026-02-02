# Supplier Service

Supplier microservice for the store system.

## Endpoints

- `GET /api/info/:state` - Get provider information by state
- `POST /api/order` - Place order with supplier

## Quick Start

```bash
cd supplier
npm install
npm run dev
```

Service runs on http://localhost:4001/api

Swagger docs: http://localhost:4001/api/docs

## API Examples

### Get Provider Info
```bash
curl http://localhost:4001/api/info/SP
```

Response:
```json
{
  "address": "Rua das Flores, 456, São Paulo"
}
```

### Place Order
```bash
curl -X POST http://localhost:4001/api/order \
  -H "Content-Type: application/json" \
  -d '[{"id": 1, "amount": 2}]'
```

Response:
```json
{
  "id": 1234,
  "preparationTime": 3
}
```

## Environment

```env
PORT=4001
```
