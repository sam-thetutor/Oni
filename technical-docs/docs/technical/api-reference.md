# API Reference

## Authentication

All API endpoints require wallet-based authentication.

### Headers
```
Authorization: Bearer <wallet_signature>
Content-Type: application/json
```

## Core Endpoints

### User Management

#### GET /api/userWallet/balance
Get user wallet balance
```json
{
  "balance": "0.01",
  "currency": "XFI"
}
```

#### POST /api/userWallet/fund
Fund a new user wallet
```json
{
  "walletAddress": "0x...",
  "amount": "0.01"
}
```

### Payment Links

#### GET /api/paymentLinks
Get user's payment links
```json
{
  "links": [
    {
      "id": "link_id",
      "amount": "1.0",
      "status": "active"
    }
  ]
}
```

#### POST /api/paymentLinks
Create a new payment link
```json
{
  "amount": "1.0",
  "description": "Payment for services"
}
```

### DCA Trading

#### GET /api/dca/orders
Get user's DCA orders
```json
{
  "orders": [
    {
      "id": "order_id",
      "amount": "0.1",
      "frequency": "daily",
      "status": "active"
    }
  ]
}
```

#### POST /api/dca/orders
Create a new DCA order
```json
{
  "amount": "0.1",
  "frequency": "daily",
  "token": "XFI"
}
```

## WebSocket Events

### Connection
```javascript
const socket = io('ws://localhost:3030', {
  auth: {
    walletAddress: '0x...',
    signature: '0x...'
  }
});
```

### Events
- `balance_update`: Real-time balance updates
- `transaction_confirmed`: Transaction confirmation
- `dca_executed`: DCA order execution 