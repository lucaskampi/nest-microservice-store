# Purchase Flow Documentation

## Overview
The Store Service now includes a complete purchase flow that coordinates with Supplier and Carrier services to process customer orders.

## API Endpoints

### Purchase Endpoints

#### GET /api/purchases
List all purchases with their current states.

**Response:**
```json
[
  {
    "id": 1,
    "orderId": 5,
    "preparationTime": 3,
    "destinationAddress": "123 Main St, 456, SP",
    "deliveryDate": "2026-02-05T00:00:00.000Z",
    "voucher": 789,
    "state": "RESERVE_DELIVERED",
    "createdAt": "2026-01-31T18:00:00.000Z",
    "updatedAt": "2026-01-31T18:00:05.000Z"
  }
]
```

#### GET /api/purchases/:id
Get a specific purchase by ID.

#### POST /api/purchases
Create a new purchase order.

**Request Body:**
```json
{
  "items": [
    {
      "id": 1,
      "amount": 2
    },
    {
      "id": 3,
      "amount": 1
    }
  ],
  "address": {
    "street": "123 Main St",
    "number": 456,
    "state": "SP"
  }
}
```

**Response:** Purchase object with state information

## Purchase States

The purchase progresses through the following states:

1. **RECEIVED** - Initial state when purchase is created
2. **ORDER_REQUESTED** - Order placed with supplier
3. **RESERVE_DELIVERED** - Delivery booked and voucher obtained

## Purchase Flow

### Step-by-Step Process

```
1. CREATE PURCHASE (RECEIVED)
   └─ Save to database with RECEIVED state
   
2. GET PROVIDER INFO
   └─ Call Supplier Service: GET /api/info/{state}
   └─ Returns provider address
   
3. PLACE ORDER (ORDER_REQUESTED)
   └─ Call Supplier Service: POST /api/order
   └─ Send: [{ id: productId, amount: quantity }]
   └─ Returns: { id: orderId, preparationTime: days }
   └─ Update purchase state to ORDER_REQUESTED
   
4. BOOK DELIVERY (RESERVE_DELIVERED)
   └─ Calculate delivery date (current date + preparationTime)
   └─ Call Carrier Service: POST /api/delivery
   └─ Send: {
        orderId,
        deliveryDate,
        originAddress: provider.address,
        destinationAddress: customer address
      }
   └─ Returns: { number: voucherNumber, deliveryForecast: date }
   └─ Update purchase state to RESERVE_DELIVERED
   
5. RETURN COMPLETE PURCHASE
   └─ All information saved including voucher
```

## Error Handling

### Resilience Strategy

- If a service call fails, the purchase is returned in its current state
- The state field indicates how far the purchase progressed
- Clients can retry or reprocess based on the state

**Example Error Response:**
If the supplier service is down, the purchase will be returned with state `RECEIVED`:
```json
{
  "id": 1,
  "orderId": null,
  "preparationTime": null,
  "destinationAddress": "123 Main St, 456, SP",
  "deliveryDate": null,
  "voucher": null,
  "state": "RECEIVED",
  "createdAt": "2026-01-31T18:00:00.000Z",
  "updatedAt": "2026-01-31T18:00:00.000Z"
}
```

## Configuration

Service URLs are configured via environment variables:

```env
SUPPLIER_SERVICE_URL=http://localhost:4001/api
CARRIER_SERVICE_URL=http://localhost:4002/api
```

## Testing

### Local Testing

Currently, the Supplier and Carrier services don't exist yet. When calling POST /api/purchases, you'll get an error because these services are unavailable.

To fully test the purchase flow:

1. **Next Steps:** Create the Supplier Service (Port 4001) and Carrier Service (Port 4002)
2. Or use mock services for testing

### Test Purchase Request

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

## Architecture

```
Store Service (Port 4000)
├── Products Module (already existed)
│   └── CRUD operations for products
│
└── Purchases Module (NEW)
    ├── DTOs
    │   ├── CreatePurchaseDTO
    │   ├── AddressDTO
    │   ├── PurchaseItemDTO
    │   ├── VoucherDTO
    │   ├── InfoOrderDTO
    │   ├── InfoProviderDTO
    │   └── InfoDeliveryDTO
    │
    ├── Entities
    │   └── Purchase
    │
    ├── HTTP Clients
    │   ├── SupplierClient
    │   └── CarrierClient
    │
    ├── Service
    │   └── PurchasesService
    │       ├── findAll()
    │       ├── findOne()
    │       ├── makePurchase() - Main flow
    │       └── makePurchaseFallback()
    │
    └── Controller
        └── PurchasesController
```

## Database Schema

```prisma
model Purchase {
  id                 Int       @id @default(autoincrement())
  orderId            Int?
  preparationTime    Int?
  destinationAddress String
  deliveryDate       DateTime?
  voucher            Int?
  state              String    @default("RECEIVED")
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}
```

## What's Next?

1. ✅ **Store Service Purchase Flow** - COMPLETED
2. 🔴 **Create Supplier Service** - Required for testing
3. 🔴 **Create Carrier Service** - Required for testing
4. 🔴 **Add Circuit Breaker** - For better resilience
5. 🔴 **Add Service Discovery** - For dynamic service location
6. 🔴 **Add API Gateway** - For unified API access
7. 🔴 **Add Authentication** - For securing endpoints
