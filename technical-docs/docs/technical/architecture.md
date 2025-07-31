# Architecture Overview

## System Components

Oni consists of several key components working together:

### Frontend (React + TypeScript)
- **Technology**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS
- **State Management**: React Context + Hooks
- **Blockchain Integration**: Viem for Ethereum interactions

### Backend (Node.js + TypeScript)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Wallet-based authentication
- **WebSocket**: Socket.IO for real-time features

### Blockchain Integration
- **Network**: CrossFi (EVM-compatible)
- **Smart Contracts**: Payment links, DCA trading
- **Wallet Management**: Automated wallet creation and funding

### AI Agent
- **Framework**: LangGraph
- **Capabilities**: Trading strategies, market analysis
- **Integration**: Real-time data processing

## Data Flow

1. **User Authentication**: Wallet connection via frontend
2. **API Communication**: RESTful APIs between frontend and backend
3. **Database Operations**: MongoDB for user data and transactions
4. **Blockchain Interactions**: Smart contract calls via Viem
5. **Real-time Updates**: WebSocket connections for live data

## Security

- **Encryption**: AES-256 for sensitive data
- **Authentication**: Wallet signature verification
- **Authorization**: Role-based access control
- **Data Protection**: Secure wallet key management 