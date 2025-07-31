# Database Schema

## Collections

### Users
```javascript
{
  _id: ObjectId,
  frontendWalletAddress: String, // Primary identifier
  walletAddress: String, // Generated wallet address
  encryptedPrivateKey: String, // AES encrypted
  email: String,
  points: Number,
  volume: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### DCA Orders
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to Users
  amount: Number,
  frequency: String, // daily, weekly, monthly
  token: String,
  status: String, // active, paused, completed
  lastExecuted: Date,
  nextExecution: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Payment Links
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to Users
  linkId: String, // Unique identifier
  amount: Number,
  description: String,
  status: String, // active, paid, expired
  totalContributions: Number,
  onChainData: Object, // Blockchain transaction data
  createdAt: Date,
  updatedAt: Date
}
```

### Price Data
```javascript
{
  _id: ObjectId,
  token: String,
  price: Number,
  timestamp: Date,
  source: String
}
```

## Indexes

### Users Collection
- `frontendWalletAddress`: Unique index
- `walletAddress`: Unique index
- `email`: Sparse index

### DCA Orders Collection
- `userId`: Index for user queries
- `status`: Index for active orders
- `nextExecution`: Index for scheduling

### Payment Links Collection
- `userId`: Index for user queries
- `linkId`: Unique index
- `status`: Index for active links

## Connection

```javascript
// MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/oni

// Mongoose Configuration
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
``` 