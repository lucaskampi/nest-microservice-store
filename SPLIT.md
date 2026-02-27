# Migration Instructions

## Overview

This repo contains 5 services that need to be split into separate GitHub repos:

| New Repo | Source Folder | Port |
|----------|---------------|------|
| `nest-microservice-auth` | `auth/` | 4088 |
| `nest-microservice-supplier` | `supplier/` | 4001 |
| `nest-microservice-carrier` | `carrier/` | 4002 |
| `nest-microservice-gateway` | `gateway/` | 5000 |

**This repo (`nest-microservice-store`)** keeps: `backend/` (Store Service)

---

## For Each New Repo

### 1. Setup Steps

```bash
# Clone the new empty repo
git clone https://github.com/YOUR_ORG/nest-microservice-XXX.git
cd nest-microservice-XXX

# Copy source folder from this repo
cp -r ../nest-microservice-store/XXX/* .
cp -r ../nest-microservice-store/packages/shared ./packages

# Copy root config files
cp ../nest-microservice-store/tsconfig.json .
cp ../nest-microservice-store/.gitignore .
```

### 2. Update package.json

- Remove `"private": true` if you want to publish
- Change `"name": "XXX"` to match your repo (e.g., `"name": "nest-microservice-auth"`)
- Keep dependencies as-is

### 3. Update docker-compose service name

In the new repo's `Dockerfile`, the build context will be `.` instead of the folder name.

---

## Specific Instructions by Repo

### nest-microservice-auth (from `auth/`)

**Port:** 4088 | **Database:** SQLite

**Files to copy:**
```
auth/src/main.ts
auth/src/app.module.ts
auth/src/auth/local.strategy.ts
auth/src/auth/jwt.strategy.ts
auth/src/auth/auth.service.ts
auth/src/auth/auth.controller.ts
auth/src/users/users.service.ts
auth/src/health/health.controller.ts
auth/src/health/health.module.ts
auth/src/prisma/prisma.service.ts
auth/prisma/schema.prisma
auth/package.json
auth/tsconfig.json
auth/jest.config.js
auth/Dockerfile
auth/.gitignore
auth/.env.example
```

**CI Workflow:** Adapt from `.github/workflows/ci.yml` - keep only auth-related test steps.

**Docker Compose (local dev):**
```yaml
services:
  auth:
    build: .
    ports:
      - "4088:4088"
    environment:
      - PORT=4088
      - JWT_SECRET=your-secret-key
      - DATABASE_URL=file:./prisma/dev.db
    volumes:
      - ./prisma/dev.db:/app/prisma/dev.db
```

---

### nest-microservice-supplier (from `supplier/`)

**Port:** 4001 | **Database:** PostgreSQL

**Files to copy:**
```
supplier/src/main.ts
supplier/src/app.module.ts
supplier/src/app.controller.ts
supplier/src/app.service.ts
supplier/src/rabbitmq/rabbitmq.service.ts
supplier/src/rabbitmq/rabbitmq.module.ts
supplier/src/health/health.controller.ts
supplier/src/health/health.module.ts
supplier/src/prisma/prisma.service.ts
supplier/prisma/schema.prisma
supplier/package.json
supplier/tsconfig.json
supplier/jest.config.js
supplier/Dockerfile
supplier/.gitignore
supplier/.env.example
```

**Docker Compose (local dev):**
```yaml
services:
  supplier:
    build: .
    ports:
      - "4001:4001"
    environment:
      - PORT=4001
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/supplier
      - RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
```

---

### nest-microservice-carrier (from `carrier/`)

**Port:** 4002 | **Database:** MySQL

**Files to copy:**
```
carrier/src/main.ts
carrier/src/app.module.ts
carrier/src/app.controller.ts
carrier/src/app.service.ts
carrier/src/rabbitmq/rabbitmq.service.ts
carrier/src/rabbitmq/rabbitmq.module.ts
carrier/src/health/health.controller.ts
carrier/src/health/health.module.ts
carrier/src/prisma/prisma.service.ts
carrier/prisma/schema.prisma
carrier/package.json
carrier/tsconfig.json
carrier/jest.config.js
carrier/Dockerfile
carrier/.gitignore
carrier/.env.example
```

**Docker Compose (local dev):**
```yaml
services:
  carrier:
    build: .
    ports:
      - "4002:4002"
    environment:
      - PORT=4002
      - DATABASE_URL=mysql://root:root@mysql:3306/carrier
      - RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
```

---

### nest-microservice-gateway (from `gateway/`)

**Port:** 5000 | **Database:** None

**Files to copy:**
```
gateway/src/main.ts
gateway/src/app.module.ts
gateway/src/app.e2e-spec.ts
gateway/src/auth/jwt.strategy.ts
gateway/src/auth/auth.controller.ts
gateway/src/proxy/proxy.controller.ts
gateway/src/health/health.controller.ts
gateway/src/health/health.module.ts
gateway/package.json
gateway/tsconfig.json
gateway/jest.config.js
gateway/Dockerfile
gateway/.gitignore
```

**Environment variables needed:**
```
PORT=5000
JWT_SECRET=your-secret-key
AUTH_SERVICE_URL=http://auth:4088/api
STORE_SERVICE_URL=http://store:4000/api
SUPPLIER_SERVICE_URL=http://supplier:4001/api
CARRIER_SERVICE_URL=http://carrier:4002/api
```

---

## After All Repos Are Created

1. **Each repo** needs its own GitHub Actions workflow (adapted from `.github/workflows/ci.yml`)
2. **Each repo** should have proper CI/CD with tests
3. **This repo** (`nest-microservice-store`) keeps `backend/` and updates its `docker-compose.yml` to only include store + infra

---

## Shared Package

Each new repo copies `packages/shared/` locally. Alternatively, you can:
1. Publish `@nest-microservices/shared` to npm
2. Add as dependency in each service's `package.json`
