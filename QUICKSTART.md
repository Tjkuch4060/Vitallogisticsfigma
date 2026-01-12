# VitalLogistics Extensiv Integration - Quick Start

This guide will help you get the Extensiv integration up and running quickly.

## Prerequisites

Before you begin, make sure you have:

- ✅ Node.js 18+ or 20+ installed
- ✅ Redis installed and running
- ✅ Extensiv API credentials (provided in your SOW)

## Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies (if needed)
cd ..
npm install
```

### 2. Start Redis

Choose one method:

```bash
# macOS (Homebrew)
brew services start redis

# Linux (systemd)
sudo systemctl start redis

# Docker (easiest if you don't have Redis installed)
docker run -d -p 6379:6379 --name redis redis:7-alpine
```

Verify Redis is running:
```bash
redis-cli ping
# Should output: PONG
```

### 3. Start the Backend Server

```bash
cd server
npm run dev
```

You should see:
```
🚀 Server running on port 3001
Environment: development
✅ Redis connected
✅ Background jobs started
Inventory sync scheduled: every 10 minutes
Order status polling scheduled: every 5 minutes
```

### 4. Start the Frontend (Optional)

In a new terminal:
```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

## Verify Integration

### 1. Check Server Health

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-12T...",
  "redis": "connected",
  "uptime": 10.5
}
```

### 2. Test Inventory Sync

Manually trigger inventory sync:
```bash
curl -X POST http://localhost:3001/api/v1/inventory/sync
```

Expected response:
```json
{
  "success": true,
  "message": "Inventory synced successfully",
  "data": {
    "productsUpdated": 50,
    "syncedAt": "2026-01-12T..."
  }
}
```

### 3. View Synced Inventory

```bash
curl http://localhost:3001/api/v1/inventory
```

### 4. Test Product Fetch

```bash
curl http://localhost:3001/api/v1/products
```

## What's Running?

Once started, three background processes are active:

1. **Inventory Sync** - Every 10 minutes
   - Syncs product catalog and inventory levels
   - Caches in Redis for fast access

2. **Order Status Poller** - Every 5 minutes
   - Checks order status updates from Extensiv
   - Triggers notifications when status changes

3. **Order Queue** - Continuous
   - Processes order creation jobs
   - Exports orders to Extensiv
   - Retries on failure

## Directory Structure

```
Vitallogisticsfigma/
├── server/                    # Backend API (NEW)
│   ├── src/
│   │   ├── index.js          # Main server
│   │   ├── config/           # Redis config
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API routes
│   │   ├── services/
│   │   │   └── extensiv/     # Extensiv integration
│   │   ├── jobs/             # Background jobs
│   │   ├── middleware/       # Error handling
│   │   └── utils/            # Logging, Sentry
│   ├── logs/                 # Log files
│   ├── .env                  # Config (DO NOT COMMIT)
│   ├── package.json
│   └── README.md
├── src/                       # Frontend React app
├── package.json
└── QUICKSTART.md             # This file
```

## API Endpoints

Your backend exposes these endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/api/v1/products` | GET | Get products |
| `/api/v1/products/:id` | GET | Get product by ID |
| `/api/v1/inventory` | GET | Get inventory levels |
| `/api/v1/inventory/sync` | POST | Trigger manual sync |
| `/api/v1/orders` | POST | Create order |
| `/api/v1/orders` | GET | List orders |
| `/api/v1/orders/:id` | GET | Get order by ID |
| `/api/v1/orders/:id/status` | PATCH | Update order status |

## Configuration

All configuration is in `server/.env`:

```env
# Core settings
PORT=3001                              # Backend port
INVENTORY_SYNC_INTERVAL=10             # Sync every 10 minutes
ORDER_STATUS_POLL_INTERVAL=5           # Poll every 5 minutes
CACHE_TTL=900                          # Cache for 15 minutes

# Extensiv credentials (already configured)
EXTENSIV_CLIENT_ID=09892c4f-0fcc-42ae-bd52-cbd703152f71
EXTENSIV_CLIENT_SECRET=beO8LCFsEZEMuRhCAJWgutFARUThNjP
```

## Logs

Logs are in `server/logs/`:

```bash
# View all logs
tail -f server/logs/combined.log

# View errors only
tail -f server/logs/error.log

# Search for Extensiv-related logs
grep "Extensiv" server/logs/combined.log
```

## Common Commands

```bash
# Start development server
cd server && npm run dev

# Start production server
cd server && npm start

# Manually trigger inventory sync
curl -X POST http://localhost:3001/api/v1/inventory/sync

# Check Redis cache
redis-cli
> KEYS *
> GET extensiv:access_token
> GET inventory:all

# View queue jobs
redis-cli
> KEYS bull:*
> LLEN bull:order-processing:wait
```

## Troubleshooting

### Redis not connected

**Error**: `Redis Client Error: connect ECONNREFUSED`

**Solution**:
```bash
# Check if Redis is running
redis-cli ping

# If not, start it:
brew services start redis  # macOS
sudo systemctl start redis # Linux
docker start redis         # Docker
```

### Port already in use

**Error**: `EADDRINUSE: address already in use :::3001`

**Solution**:
```bash
# Find process using port 3001
lsof -i :3001

# Kill it
kill -9 <PID>

# Or change PORT in server/.env
PORT=3002
```

### Extensiv API errors

**Error**: `Invalid Extensiv credentials`

**Solution**:
1. Verify credentials in `server/.env`
2. Check if Extensiv API is accessible
3. Review error logs: `tail -f server/logs/error.log`

## Next Steps

### 1. Frontend Integration (Recommended)

Update your React app to use the backend API instead of mock data.

**Files to update**:
- `src/app/context/CartContext.tsx` - Use backend API for cart operations
- `src/app/pages/Catalog.tsx` - Fetch products from `/api/v1/products`
- `src/app/pages/Dashboard.tsx` - Fetch orders from `/api/v1/orders`
- `src/app/pages/Checkout.tsx` - Create orders via `/api/v1/orders`

**Example**:
```typescript
// Before (mock data)
const products = mockData.products;

// After (real API)
const products = await fetch('http://localhost:3001/api/v1/products')
  .then(res => res.json())
  .then(data => data.data);
```

### 2. Add Database (PostgreSQL)

The current implementation uses cache only. For production:

1. Set up PostgreSQL database
2. Create schema for orders, products, customers
3. Update controllers to persist data
4. Add database migrations

### 3. Stripe Integration

Complete the payment flow:

1. Set up Stripe webhook endpoint
2. Handle `payment_intent.succeeded` event
3. Create order in database
4. Queue for Extensiv export

### 4. Email Notifications

Set up email service (SendGrid, AWS SES):

1. Order confirmation emails
2. Pickup ready notifications
3. Shipping notifications
4. Delivery confirmations

### 5. Production Deployment

When ready for production:

1. Update `NODE_ENV=production` in `.env`
2. Set up production Redis instance
3. Configure Sentry for error tracking
4. Set up HTTPS
5. Configure CORS properly
6. Set up monitoring/alerts

## Resources

- **Backend README**: `server/README.md` - Full documentation
- **Integration Guide**: `server/INTEGRATION_GUIDE.md` - Deep dive into Extensiv integration
- **API Docs**: See README for all endpoints and usage

## Support

Having issues? Check:

1. **Logs**: `server/logs/error.log`
2. **Redis**: `redis-cli ping`
3. **Server**: `curl http://localhost:3001/health`
4. **Environment**: Verify `server/.env` settings

## Summary

You now have:

✅ Backend server running on port 3001
✅ Extensiv OAuth 2.0 integration
✅ Inventory sync every 10 minutes
✅ Order status polling every 5 minutes
✅ Order processing queue with retries
✅ Redis caching for performance
✅ Comprehensive error handling and logging

Your B2B portal is now integrated with Extensiv WMS! 🎉
