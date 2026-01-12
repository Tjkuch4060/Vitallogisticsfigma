# Extensiv Integration Guide

This guide explains how the VitalLogistics B2B Portal integrates with Extensiv WMS.

## Overview

The integration provides three main data flows:

1. **Product Catalog & Inventory Sync** - Pull product data and stock levels
2. **Order Creation** - Push orders for fulfillment
3. **Order Status Updates** - Track fulfillment progress

## Authentication

### OAuth 2.0 Flow

Extensiv uses OAuth 2.0 Client Credentials flow:

```
1. Request access token with client credentials
2. Receive token (valid for 3600 seconds)
3. Cache token in Redis
4. Use token for all API requests
5. Auto-refresh when expired
```

**Implementation**: `src/services/extensiv/authClient.js`

### Token Caching

- Tokens are cached in Redis with key: `extensiv:access_token`
- Cache TTL: 3540 seconds (60 seconds buffer before expiry)
- Auto-refresh on 401 responses

## API Client

**File**: `src/services/extensiv/apiClient.js`

### Features

- Automatic token management
- Exponential backoff retry logic
- Comprehensive error handling
- Request/response logging

### Error Handling Matrix

| Status Code | Action | Retry? |
|------------|--------|--------|
| 401 | Refresh token, clear cache | Yes |
| 429 | Exponential backoff | Yes |
| 400 | Log error, capture in Sentry | No |
| 404 | Return null | No |
| 500-504 | Log, capture, retry | Yes |

### Retry Configuration

```javascript
{
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  strategy: 'exponential' // 1s, 2s, 4s
}
```

## Data Flows

### 1. Inventory Sync (Workflow 3)

**Purpose**: Keep product catalog and inventory levels up-to-date

**Schedule**: Every 10-30 minutes (configurable)

**Worker**: `src/jobs/workers/inventorySync.js`

**Flow**:
```
1. Cron job triggers at configured interval
2. Call Extensiv API: GET /api/v1/inventory
3. Transform Extensiv data to portal format
4. Cache in Redis (TTL: 15 minutes)
5. Update database (PostgreSQL)
6. Map brands (create new if needed)
```

**Data Mapping**:
```javascript
Extensiv → Portal
{
  sku → sku
  product_name → name
  brand/manufacturer → brand
  quantity_available → stock
  price/unit_price → price
  thc_content/thc_mg → thc
  batch_number/lot_number → batchNumber
  coa_url/certificate_url → coaLink
}
```

**Error Handling**:
- On failure: Use previous cache
- Log to Winston and Sentry
- Continue cron schedule (don't break)

**Manual Trigger**:
```bash
POST /api/v1/inventory/sync
```

### 2. Order Creation (Workflow 1)

**Purpose**: Export orders to Extensiv for fulfillment

**Trigger**: Payment confirmation (Stripe webhook)

**Queue**: `src/jobs/queues/orderQueue.js`

**Flow**:
```
1. Payment succeeds (Stripe webhook)
2. Create order in portal database (status: "paid")
3. Calculate brand payouts (70/30 split)
4. Add job to Bull queue
5. Queue worker processes job:
   a. Transform order to Extensiv format
   b. POST to Extensiv: /api/v1/orders
   c. Store extensivOrderId in database
   d. Update order status to "exported"
6. Send confirmation email to customer
```

**Job Configuration**:
```javascript
{
  attempts: 5,
  backoff: {
    type: 'exponential',
    delay: 2000 // 2s, 4s, 8s, 16s, 32s
  },
  removeOnComplete: 100,
  removeOnFail: 500
}
```

**Order Data Transformation**:
```javascript
Portal → Extensiv
{
  customer: {
    name, email, phone, companyName
  },
  shipping_address: {
    street1, street2, city, state, zip, country
  },
  line_items: [
    { sku, quantity, price, description }
  ],
  order_number,
  order_date,
  delivery_method,
  metadata: {
    portal_order_id,
    delivery_zone,
    total_amount,
    payment_status
  }
}
```

**Retry Logic**:
- **Retriable Errors**: 429 (rate limit), 500+ (server errors)
- **Non-retriable Errors**: 400 (bad request)
- **Max Attempts**: 5
- **On Exhaustion**: Admin alert, mark as failed

### 3. Order Status Polling (Workflow 2)

**Purpose**: Monitor order fulfillment progress

**Schedule**: Every 5 minutes

**Worker**: `src/jobs/workers/orderStatusPoller.js`

**Monitored Statuses**:
- `paid` - Payment confirmed, awaiting fulfillment
- `picking` - Items being picked in warehouse
- `packed` - Order packed, ready for shipment
- `shipped` - Order in transit

**Flow**:
```
1. Cron job triggers every 5 minutes
2. Query database for orders with monitored statuses
3. For each order:
   a. GET status from Extensiv: /api/v1/orders/{id}/status
   b. Compare with database status
   c. If changed:
      - Update database
      - Trigger status-specific actions
4. Log results
```

**Status Change Actions**:

| Status | Action |
|--------|--------|
| `packed` | Send "Ready for pickup" notification (if pickup) OR Schedule delivery partner (if delivery) |
| `shipped` | Send tracking notification with tracking number |
| `delivered` | Send delivery confirmation email |
| `cancelled` | Handle cancellation, refund process |

**Implementation**:
```javascript
// Status change handler
switch (newStatus) {
  case 'packed':
    if (order.deliveryMethod === 'pickup') {
      await sendPickupReadyNotification(order);
    } else {
      await scheduleDelivery(order);
    }
    break;

  case 'shipped':
    await sendShippingNotification(order);
    break;

  case 'delivered':
    await sendDeliveryConfirmation(order);
    break;
}
```

## Caching Strategy

### Redis Cache Keys

- `extensiv:access_token` - OAuth token (TTL: 3540s)
- `inventory:all` - Full inventory list (TTL: 900s)
- `inventory:sku:{sku}` - Individual product inventory (TTL: 900s)
- `products:{query}` - Product search results (TTL: 900s)
- `product:{id}` - Single product (TTL: 900s)

### Cache TTLs

- **Access Token**: 3540 seconds (59 minutes)
- **Inventory**: 900 seconds (15 minutes)
- **Products**: 900 seconds (15 minutes)

### Graceful Degradation

If Extensiv API fails:
1. Return cached data (even if expired)
2. Add `source: 'stale_cache'` to response
3. Include warning message
4. Log error to Sentry

## API Endpoints Used

### Extensiv API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/oauth/token` | POST | Get access token |
| `/api/v1/products` | GET | List all products |
| `/api/v1/products/{id}` | GET | Get product details |
| `/api/v1/inventory` | GET | Get all inventory |
| `/api/v1/inventory/{sku}` | GET | Get inventory by SKU |
| `/api/v1/orders` | POST | Create order |
| `/api/v1/orders` | GET | List orders |
| `/api/v1/orders/{id}` | GET | Get order details |
| `/api/v1/orders/{id}/status` | GET | Get order status |
| `/api/v1/orders/{id}` | PATCH | Update order |

### Portal API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/products` | GET | Get products (from cache/Extensiv) |
| `/api/v1/products/{id}` | GET | Get product by ID |
| `/api/v1/inventory` | GET | Get cached inventory |
| `/api/v1/inventory/sync` | POST | Manually trigger sync |
| `/api/v1/orders` | POST | Create new order |
| `/api/v1/orders` | GET | List orders |
| `/api/v1/orders/{id}` | GET | Get order details |
| `/api/v1/orders/{id}/status` | PATCH | Update order status |

## Monitoring & Observability

### Logging

**Winston Transports**:
- Console (development)
- File: `logs/combined.log` (all logs)
- File: `logs/error.log` (errors only)
- File: `logs/exceptions.log` (uncaught exceptions)

**Key Log Events**:
- Token refresh
- API requests/responses
- Job processing
- Status changes
- Errors and retries

### Sentry Integration

**Captured Events**:
- API errors (4xx, 5xx)
- Job failures
- Token refresh failures
- Sync failures
- Status polling failures

**Context Included**:
- Job ID
- Order ID
- Attempt number
- Error message
- Stack trace

### Metrics to Monitor

1. **Inventory Sync**:
   - Sync success/failure rate
   - Products synced per run
   - Sync duration
   - Cache hit rate

2. **Order Processing**:
   - Order creation success rate
   - Queue wait time
   - Processing time
   - Retry rate
   - Failed orders

3. **Status Polling**:
   - Orders polled per run
   - Status changes detected
   - Polling duration
   - API error rate

4. **API Performance**:
   - Request latency
   - Error rate by status code
   - Token refresh frequency
   - Cache hit/miss rate

## Testing

### Unit Tests (TODO)

```javascript
// Test OAuth client
describe('ExtensivAuthClient', () => {
  it('should fetch and cache token');
  it('should refresh expired token');
  it('should handle 401 errors');
});

// Test API client
describe('ExtensivAPIClient', () => {
  it('should retry on 429');
  it('should not retry on 400');
  it('should handle network errors');
});
```

### Integration Tests (TODO)

```javascript
// Test inventory sync
describe('Inventory Sync', () => {
  it('should sync inventory from Extensiv');
  it('should cache results in Redis');
  it('should handle API failures gracefully');
});

// Test order creation
describe('Order Creation', () => {
  it('should create order in Extensiv');
  it('should store extensivOrderId');
  it('should retry on failure');
});
```

### Manual Testing

```bash
# Test inventory sync
curl -X POST http://localhost:3001/api/v1/inventory/sync

# Test order creation
curl -X POST http://localhost:3001/api/v1/orders \
  -H "Content-Type: application/json" \
  -d @test-order.json

# Test product fetch
curl http://localhost:3001/api/v1/products?brand=VitalHemp

# Check queue stats
redis-cli
> KEYS bull:*
> LLEN bull:order-processing:wait
```

## Troubleshooting

### Common Issues

**1. Token Refresh Loop**
- **Symptom**: Constant 401 errors
- **Cause**: Invalid credentials
- **Fix**: Verify `EXTENSIV_CLIENT_ID` and `EXTENSIV_CLIENT_SECRET`

**2. Inventory Not Syncing**
- **Symptom**: Stale inventory data
- **Cause**: Cron job not running or API errors
- **Fix**: Check logs, verify Redis connection

**3. Orders Not Exporting**
- **Symptom**: Orders stuck in queue
- **Cause**: Queue not processing or API errors
- **Fix**: Check Bull queue, Redis connection, Extensiv API status

**4. Status Updates Missing**
- **Symptom**: Orders not updating status
- **Cause**: Polling job failing or incorrect order IDs
- **Fix**: Check logs for polling errors, verify order IDs

### Debug Commands

```bash
# Check Redis connection
redis-cli ping

# View queue jobs
redis-cli
> KEYS bull:order-processing:*
> LLEN bull:order-processing:active
> LLEN bull:order-processing:failed

# View logs
tail -f logs/combined.log
tail -f logs/error.log | grep Extensiv

# Check cron jobs
# (Jobs log on startup and execution)
grep "cron" logs/combined.log
```

## Phase 1 Scope

**Included**:
- ✅ Product catalog sync
- ✅ Inventory sync with Redis cache
- ✅ Order creation and export
- ✅ Order status polling
- ✅ Job queue with retries
- ✅ Error handling and logging

**Not Included** (Future Phases):
- ❌ Shipping label generation
- ❌ Carrier API integration (UPS, FedEx, USPS)
- ❌ Receiving/returns management
- ❌ Multi-warehouse support
- ❌ Real-time webhooks (using polling instead)

## Next Steps

1. **Database Integration**: Add PostgreSQL for persistent storage
2. **Stripe Integration**: Complete payment webhook handler
3. **Email Notifications**: Set up email service (SendGrid, etc.)
4. **Frontend Integration**: Update React app to use backend API
5. **Testing**: Add comprehensive test suite
6. **Deployment**: Set up production environment
7. **Monitoring**: Configure Sentry and metrics dashboard

## References

- [Extensiv WMS API Documentation](https://api.extensiv.com/docs)
- [Bull Queue Documentation](https://github.com/OptimalBits/bull)
- [Winston Logging](https://github.com/winstonjs/winston)
- [Sentry Node.js SDK](https://docs.sentry.io/platforms/node/)
