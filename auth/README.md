# Auth Service

Authentication microservice with JWT tokens.

## Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get current user (protected)
- `POST /api/auth/verify` - Verify JWT token

## Quick Start

```bash
cd auth
npm install
npx prisma migrate dev --name init
npm run dev
```

Service runs on http://localhost:4088/api

Swagger docs: http://localhost:4088/api/docs

## API Examples

### Register
```bash
curl -X POST http://localhost:4088/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:4088/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "USER"
  }
}
```

### Protected Route
```bash
curl http://localhost:4088/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Environment

```env
PORT=4088
JWT_SECRET=your-secret-key-change-in-production
DATABASE_URL="file:./prisma/dev.db"
```
