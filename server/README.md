# VitalLogistics Backend API

Backend service for VitalLogistics B2B Wholesale Portal with Extensiv WMS integration.

## Features

- **Extensiv WMS Integration**: Full OAuth 2.0 integration with Extensiv Warehouse Management System
- **Real-time Inventory Sync**: Automated inventory synchronization every 10-30 minutes
- **Order Management**: Create and track orders with automatic export to Extensiv
- **Order Status Polling**: Monitor order status updates every 5 minutes
- **Job Queue Processing**: Reliable job processing with Bull and Redis
- **Error Handling**: Comprehensive error handling with exponential backoff and retry logic
- **Logging & Monitoring**: Winston logging with Sentry integration for error tracking

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Queue**: Bull (Redis-backed)
- **HTTP Client**: Axios
- **Logging**: Winston
- **Error Tracking**: Sentry
- **Scheduling**: node-cron

## Prerequisites

- Node.js 18+ or 20+
- Redis 6+ (for caching and job queue)
- Extensiv WMS API credentials

## Installation

1. **Install dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

3. **Configure your `.env` file**:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=3001
   FRONTEND_URL=http://localhost:5173

   # Extensiv API Configuration
   EXTENSIV_BASE_URL=https://api.extensiv.com
   EXTENSIV_CLIENT_ID=09892c4f-0fcc-42ae-bd52-cbd703152f71
   EXTENSIV_CLIENT_SECRET=beO8LCFsEZEMuRhCAJWgutFARUThNjP
   EXTENSIV_CUSTOMER_ID=
   EXTENSIV_TOKEN_EXPIRY=3600

   # Redis Configuration
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=
   REDIS_DB=0

   # Sync Configuration
   INVENTORY_SYNC_INTERVAL=10
   ORDER_STATUS_POLL_INTERVAL=5
   CACHE_TTL=900

   # Sentry Configuration (Optional)
   SENTRY_DSN=
   SENTRY_ENVIRONMENT=development

   # Logging
   LOG_LEVEL=info
   ```

4. **Start Redis** (if not already running):
   ```bash
   # macOS (Homebrew)
   brew services start redis

   # Linux (systemd)
   sudo systemctl start redis

   # Docker
   docker run -d -p 6379:6379 redis:7-alpine
   ```

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:3001` (or your configured PORT).

## API Endpoints

### Health Check
```
GET /health
```
Returns server health status and Redis connection status.

### Products

#### Get All Products
```
GET /api/v1/products
Query Parameters:
  - category: Filter by category
  - brand: Filter by brand
  - inStock: boolean (true/false)
  - minPrice: number
  - maxPrice: number
```

#### Get Product by ID
```
GET /api/v1/products/:id
```

### Orders

#### Create Order
```
POST /api/v1/orders
Body: {
  "customer": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "companyName": "string"
  },
  "items": [
    {
      "sku": "string",
      "name": "string",
      "quantity": number,
      "price": number
    }
  ],
  "shipping": {
    "name": "string",
    "street": "string",
    "city": "string",
    "state": "string",
    "zip": "string"
  },
  "deliveryMethod": "delivery" | "pickup",
  "total": number
}
```

#### Get All Orders
```
GET /api/v1/orders
Query Parameters:
  - status: Order status
  - customer: Customer ID
  - startDate: ISO date string
  - endDate: ISO date string
  - limit: number (default: 50)
  - offset: number (default: 0)
```

#### Get Order by ID
```
GET /api/v1/orders/:id
```

#### Update Order Status
```
PATCH /api/v1/orders/:id/status
Body: {
  "status": "paid" | "picking" | "packed" | "shipped" | "delivered"
}
```

### Inventory

#### Get Inventory
```
GET /api/v1/inventory
```
Returns cached inventory data.

#### Trigger Manual Sync
```
POST /api/v1/inventory/sync
```
Manually triggers inventory sync from Extensiv.

## Background Jobs

### 1. Inventory Sync Worker
- **Schedule**: Every 10-30 minutes (configurable via `INVENTORY_SYNC_INTERVAL`)
- **Purpose**: Sync product inventory from Extensiv to Redis cache
- **Cache TTL**: 15 minutes (configurable via `CACHE_TTL`)

### 2. Order Status Poller
- **Schedule**: Every 5 minutes (configurable via `ORDER_STATUS_POLL_INTERVAL`)
- **Purpose**: Poll Extensiv for order status updates
- **Monitored Statuses**: `paid`, `picking`, `packed`, `shipped`

### 3. Order Processing Queue
- **Type**: Bull queue with Redis
- **Retries**: Up to 5 attempts with exponential backoff
- **Purpose**: Process order creation and export to Extensiv

## Architecture

```
server/
├── src/
│   ├── index.js                 # Main application entry point
│   ├── config/
│   │   └── redis.js             # Redis client configuration
│   ├── controllers/             # Request handlers
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── inventory.js
│   ├── routes/                  # API routes
│   │   ├── index.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── inventory.js
│   ├── services/
│   │   └── extensiv/            # Extensiv API integration
│   │       ├── authClient.js    # OAuth 2.0 client
│   │       ├── apiClient.js     # API request handler
│   │       ├── products.js      # Product service
│   │       ├── orders.js        # Order service
│   │       └── inventory.js     # Inventory service
│   ├── jobs/
│   │   ├── index.js             # Job orchestrator
│   │   ├── queues/
│   │   │   └── orderQueue.js    # Bull queue for orders
│   │   └── workers/
│   │       ├── inventorySync.js # Inventory sync worker
│   │       └── orderStatusPoller.js # Order polling worker
│   ├── middleware/
│   │   └── errorHandler.js      # Global error handling
│   └── utils/
│       ├── logger.js            # Winston logger
│       └── sentry.js            # Sentry integration
├── logs/                        # Log files (auto-generated)
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── package.json
└── README.md
```

## Workflows

### Workflow 1: Order Creation
```
1. Customer completes payment (Stripe webhook)
2. POST /api/v1/orders creates order in portal
3. Order added to Bull queue for Extensiv export
4. Queue worker processes job:
   - Creates order in Extensiv via API
   - Stores extensivOrderId
   - Sends confirmation email
5. Retries automatically on failure (up to 5 attempts)
```

### Workflow 2: Order Status Updates
```
1. Cron job runs every 5 minutes
2. Fetch orders with status: paid, picking, packed, shipped
3. Poll Extensiv for current status
4. If status changed:
   - Update portal database
   - Trigger notifications (packed → pickup ready, delivered → confirmation)
```

### Workflow 3: Inventory Sync
```
1. Cron job runs every 10-30 minutes
2. Fetch all products from Extensiv
3. Transform and cache in Redis (15 min TTL)
4. Update PostgreSQL inventory cache table
5. Map brands and update product catalog
6. On failure: Use previous cache, log to Sentry
```

## Error Handling

The API implements comprehensive error handling:

- **401 Unauthorized**: Token refreshed automatically, request retried
- **429 Rate Limit**: Exponential backoff with retries
- **400 Bad Request**: Logged to Sentry, not retried
- **500 Server Error**: Retried with Bull queue, admin alerted

### Retry Strategy
- **Attempts**: 5 retries
- **Backoff**: Exponential (2s, 4s, 8s, 16s, 32s)
- **Queue**: Bull with Redis persistence

## Logging

Logs are written to:
- **Console**: Colorized output for development
- **Files**:
  - `logs/combined.log` - All logs
  - `logs/error.log` - Errors only
  - `logs/exceptions.log` - Uncaught exceptions
  - `logs/rejections.log` - Unhandled promise rejections

### Log Levels
- `error`: Errors that need attention
- `warn`: Warning conditions
- `info`: General informational messages (default)
- `debug`: Detailed debugging information

## Monitoring

### Sentry Integration
Configure Sentry for production error tracking:
```env
SENTRY_DSN=your_sentry_dsn_here
SENTRY_ENVIRONMENT=production
```

### Queue Monitoring
Monitor Bull queue health:
```javascript
GET /api/v1/queue/stats
```

Returns:
- Waiting jobs
- Active jobs
- Completed jobs
- Failed jobs
- Delayed jobs

## Testing

### Manual Testing

1. **Test Health Endpoint**:
   ```bash
   curl http://localhost:3001/health
   ```

2. **Test Product Fetch**:
   ```bash
   curl http://localhost:3001/api/v1/products
   ```

3. **Test Order Creation**:
   ```bash
   curl -X POST http://localhost:3001/api/v1/orders \
     -H "Content-Type: application/json" \
     -d '{
       "customer": {
         "name": "Test Customer",
         "email": "test@example.com"
       },
       "items": [
         {
           "sku": "TEST-001",
           "name": "Test Product",
           "quantity": 1,
           "price": 50.00
         }
       ],
       "shipping": {
         "street": "123 Main St",
         "city": "Minneapolis",
         "state": "MN",
         "zip": "55401"
       },
       "total": 50.00
     }'
   ```

4. **Test Manual Inventory Sync**:
   ```bash
   curl -X POST http://localhost:3001/api/v1/inventory/sync
   ```

## Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure Sentry DSN
- [ ] Set up Redis in production
- [ ] Configure proper CORS origins
- [ ] Set secure environment variables
- [ ] Enable HTTPS
- [ ] Set up log rotation
- [ ] Configure firewall rules
- [ ] Set up monitoring/alerts
- [ ] Test all API endpoints
- [ ] Verify Extensiv credentials

### Environment Variables to Update
```env
NODE_ENV=production
FRONTEND_URL=https://your-production-domain.com
SENTRY_DSN=your_sentry_dsn
REDIS_HOST=your_redis_host
REDIS_PASSWORD=your_redis_password
```

## Troubleshooting

### Redis Connection Issues
```bash
# Test Redis connection
redis-cli ping
# Should return: PONG

# Check Redis logs
tail -f /usr/local/var/log/redis.log  # macOS
sudo journalctl -u redis -f            # Linux
```

### Extensiv API Issues
Check logs for authentication errors:
```bash
tail -f logs/error.log | grep Extensiv
```

### Job Queue Not Processing
```bash
# Check Redis connection
redis-cli
> KEYS bull:*

# Monitor queue in real-time
npm install -g bull-board
bull-board
```

## Support

For issues or questions:
- Check logs in `logs/` directory
- Review Sentry dashboard for production errors
- Verify Extensiv API credentials
- Ensure Redis is running
- Check environment variables

## License

Proprietary - VitalLogistics
