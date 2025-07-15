# BUAI - CrossFi Blockchain AI Assistant

[![React 18](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Viem](https://img.shields.io/badge/Viem-2.31.3-green.svg)](https://viem.sh/)
[![CrossFi](https://img.shields.io/badge/CrossFi-Blockchain-orange.svg)](https://crossfi.org/)

An AI-powered cryptocurrency assistant built on the CrossFi blockchain ecosystem, providing intelligent financial services, trading automation, and comprehensive blockchain analytics.

## 🌟 Overview

BUAI is a next-generation crypto assistant that leverages artificial intelligence to provide seamless, secure, and intelligent blockchain interactions. Built on CrossFi's non-custodial infrastructure, it offers a comprehensive suite of tools for payments, trading, lending, and portfolio management.

## 🚀 Core Features

### 1. AI-Powered Crypto Payment Assistant
**Summary:** Leverages CrossFi's non-custodial crypto-to-fiat payment gateway for seamless, secure, and transparent payment experiences.

**Key Functionalities:**
- **Payment Optimization**: Automatically selects cost-efficient and fastest payment routes
- **Real-Time Transaction Tracking**: Instant updates with blockchain transaction hash decoding
- **User Alerts and Insights**: Payment confirmations, failed transaction alerts, and spending summaries
- **Multi-Channel Payment Support**: QR codes, virtual/physical CrossFi crypto debit cards, P2P transfers
- **Non-Custodial Security**: Users retain full control of assets with MetaMask integration

### 2. Decentralized AI Trading Agent
**Summary:** Autonomous trading and liquidity management within CrossFi's DeFi ecosystem using real-time market data and smart contracts.

**Key Functionalities:**
- **Market Monitoring**: Continuous scanning of token prices, volume, and market trends
- **Automated Trade Execution**: Buy/sell orders and liquidity pool adjustments based on AI strategies
- **Risk Management**: Stop-loss, take-profit, and portfolio diversification rules
- **Portfolio Rebalancing**: Automatic asset reallocation based on target allocations
- **Cross-Chain Asset Handling**: Seamless management of bridged Ethereum and other chain assets

### 3. AI-Enhanced Credit Scoring and Lending dApp
**Summary:** AI-driven decentralized lending platform with on-chain credit scoring and transparent loan management.

**Key Functionalities:**
- **Creditworthiness Assessment**: On-chain transaction analysis and decentralized credit scoring
- **Automated Loan Approval**: Dynamic loan terms based on AI risk profiles
- **Fraud Detection**: AI anomaly detection for risk mitigation
- **Transparent Records**: Immutable loan records on CrossFi blockchain
- **User-Friendly Interface**: Clear dashboards for loan status and credit score evolution

## 🛠️ Current Feature Set

### Wallet Management
- ✅ Create/Check/Manage Wallet
- ✅ Wallet Balance Tracking
- ✅ Transaction History
- ✅ Multi-wallet Support

### Trading & DeFi
- ✅ Swap/DCA/Limit Orders
- ✅ Token Analysis
- ✅ Top Tokens Discovery
- ✅ Token Recommendations
- ✅ Price Chart Analysis
- ✅ Portfolio Management

### Payment Systems
- ✅ Fixed Payment Links
- ✅ Global Payment Links (Donations)
- ✅ QR Code Generation
- ✅ Transaction Monitoring

### NFT & Digital Assets
- ✅ Trade NFTs
- ✅ Generate Images
- ✅ Image to NFT Conversion

### Utility Features
- ✅ Web Search Integration
- ✅ Email Notifications
- ✅ Task Management
- ✅ Create and Share Blinks
- ✅ Token Launch Platform

### Analytics & Insights
- ✅ CrossFi Network Statistics
- ✅ Ecosystem Insights
- ✅ Transaction Analytics
- ✅ Market Data Integration
- ✅ DeFi Metrics
- ✅ AI-Powered Investment Guidance

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: React 18.3.1 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Authentication**: Privy

### Backend Stack
- **Runtime**: Node.js with TypeScript
- **Database**: MongoDB
- **Blockchain Integration**: Viem for CrossFi interactions
- **Authentication**: Privy Server Auth
- **API Framework**: Express.js

### Blockchain Integration
- **Primary Chain**: CrossFi Blockchain
- **Wallet Support**: MetaMask, Privy Embedded Wallets
- **Token Standards**: ERC20, ERC721 (NFTs)
- **Cross-Chain**: Ethereum bridge support

## 📋 Payment Link System

### Implementation Logic
The payment link system supports two types of links:

#### Fixed Payment Links
- Created when a specific amount is provided
- URL format: `/paylink/${linkID}`
- Use case: Invoices, fixed product sales

#### Global Payment Links
- Created when no amount is specified
- URL format: `/global-paylink/${linkID}`
- Use case: Donations, flexible payments

```typescript
// Example usage
const isGlobal = !amount || amount.trim() === '';
if (isGlobal) {
  // Creates global payment link using createGlobalPaymentLinkOnChain()
} else {
  // Creates fixed payment link using createPaymentLinkOnChain(amount)
}
```

## 📝 Patch Notes & Releases

We maintain comprehensive patch notes and release documentation to keep users informed about updates and changes.

### 📋 Quick Access
- **[Changelog](docs/CHANGELOG.md)** - Complete history of all changes
- **[Release Notes](docs/releases/)** - Detailed release documentation
- **[Patch Notes Guide](docs/PATCH_NOTES_GUIDE.md)** - How to manage releases

### 🚀 Latest Updates
```bash
# Check current version and unreleased changes
./scripts/version-manager.sh status

# Add a new change entry
./scripts/version-manager.sh add added "New feature description"
./scripts/version-manager.sh add fixed "Bug fix description"

# Release a new version
./scripts/version-manager.sh release 1.1.0
```

### 📊 Version History
- **v1.0.0** - Initial release with core features
- **v1.1.0** - Real-time updates and performance improvements (coming soon)

For detailed information about each release, see the [releases directory](docs/releases/).

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- MongoDB instance
- CrossFi testnet/mainnet access

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BUAI
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   # Copy environment files
   cp .env.example .env
   cp backend/.env.example backend/.env
   
   # Configure your environment variables
   ```

4. **Start the development servers**
   ```bash
   # Start backend
   cd backend && pnpm dev
   
   # Start frontend (in another terminal)
   pnpm dev
   ```

### Docker Setup

```bash
# Start with Docker Compose
docker-compose up -d

# Or use the provided shell scripts
./ollama-setup.sh      # For local AI setup
./ollama-docker.sh     # For Docker AI setup
```

## 🌐 Environment Configuration

### Required Environment Variables

#### Frontend (.env)
```env
VITE_PRIVY_APP_ID=your_privy_app_id
VITE_BACKEND_URL=http://localhost:3001
VITE_CROSSFI_RPC_URL=https://rpc.crossfi.org
```

#### Backend (backend/.env)
```env
MONGODB_URI=mongodb://localhost:27017/buai
PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret
CROSSFI_RPC_URL=https://rpc.crossfi.org
JWT_SECRET=your_jwt_secret
```

## 📊 CrossFi Analytics Integration

The system includes comprehensive CrossFi ecosystem analytics:

### Available Analytics Tools
- `get_crossfi_network_stats` - Real-time network statistics
- `get_crossfi_ecosystem_insights` - Comprehensive ecosystem analysis
- `get_crossfi_transaction_analytics` - Transaction pattern analysis
- `get_crossfi_market_data` - Market data integration
- `get_crossfi_defi_metrics` - DeFi ecosystem metrics
- `get_crossfi_ecosystem_summary` - Executive ecosystem summary

### Example Queries
- "What's the current status of the CrossFi network?"
- "How is the CrossFi ecosystem performing?"
- "Show me recent transaction analytics"
- "What are the investment opportunities in CrossFi?"

## 🔄 API Endpoints

### Core APIs
- `/api/wallet` - Wallet management
- `/api/payment-links` - Payment link operations
- `/api/price-data` - Price analytics
- `/api/gamification` - User rewards and leaderboard
- `/api/contract` - Smart contract interactions

### Payment Links
- `POST /api/payment-links` - Create payment links
- `GET /api/payment-links` - List user payment links
- `GET /api/payment-links/:id` - Get specific payment link

## 🎯 Roadmap & Future Enhancements

### Phase 1: Core Infrastructure ✅
- Basic wallet functionality
- Payment link system
- AI assistant integration
- CrossFi network integration

### Phase 2: Advanced Trading 🔄
- DCA (Dollar Cost Averaging) automation
- Advanced trading strategies
- Portfolio optimization
- Risk management tools

### Phase 3: DeFi Expansion 📋
- Lending and borrowing protocols
- Yield farming automation
- Liquidity mining
- Cross-chain DeFi strategies

### Phase 4: Enterprise Features 📋
- Multi-signature wallets
- Corporate payment solutions
- Advanced analytics dashboard
- White-label solutions

## 🧪 Testing

### Run Tests
```bash
# Frontend tests
pnpm test

# Backend tests
cd backend && pnpm test

# Integration tests
pnpm test:integration
```

### Test Payment Links
Refer to `test-payment-link-logic.md` for comprehensive payment link testing scenarios.

## 📱 Mobile Compatibility

The application is fully responsive and mobile-optimized:
- Progressive Web App (PWA) support
- Mobile-first design approach
- Touch-optimized interfaces
- Offline capability for core features

## 🔐 Security Features

- **Non-custodial architecture** - Users maintain full control of assets
- **Multi-signature support** - Enhanced security for large transactions
- **Audit trails** - Complete transaction history on-chain
- **Privacy protection** - Zero-knowledge proofs for sensitive operations
- **Smart contract security** - Thoroughly audited contract interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs via GitHub Issues
- **Community**: Join our Discord/Telegram for community support
- **Email**: Contact the development team

## 🙏 Acknowledgments

- CrossFi team for blockchain infrastructure
- Privy for authentication solutions
- Viem for blockchain interactions
- The open-source community for various tools and libraries

---

**Built with ❤️ for the CrossFi ecosystem** 