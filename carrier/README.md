# Carrier Service

Carrier microservice for the store system.

## Endpoints

- `POST /api/delivery` - Book delivery with carrier

## Quick Start

```bash
cd carrier
npm install
npm run dev
```

Service runs on http://localhost:4002/api

Swagger docs: http://localhost:4002/api/docs

## API Examples

### Book Delivery
```bash
curl -X POST http://localhost:4002/api/delivery \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": 1234,
    "deliveryDate": "2026-02-05T00:00:00.000Z",
    "originAddress": "Rua das Flores, 456, São Paulo",
    "destinationAddress": "123 Main St, 456, SP"
  }'
```

Response:
```json
{
  "number": 54321,
  "deliveryForecast": "2026-02-06T00:00:00.000Z"
}
```

## Environment

```env
PORT=4002
```
