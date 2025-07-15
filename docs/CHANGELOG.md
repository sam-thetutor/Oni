# BUAI Changelog

All notable changes to the BUAI (Blockchain User AI) application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Portfolio Tab in Wallet Page**: New portfolio overview displaying backend wallet address and token balances
  - Copiable wallet address with visual feedback
  - Real-time XFI, MPX, and tUSDC balance display
  - Manual refresh functionality for balances
  - Loading states and error handling for balance fetching
- **Zustand Store for Leaderboard Caching**: Implemented intelligent caching system for leaderboard data
  - 5-minute automatic refresh intervals for both all-time and weekly leaderboards
  - Smart caching to prevent unnecessary API calls
  - Centralized state management for leaderboard data
  - Auto-refresh initialization on app startup
- **Weekly Leaderboard Implementation**: Complete weekly leaderboard system
  - Countdown timer to next weekly reset (Sundays at 00:00 UTC)
  - Weekly stats display (participants, volume, top score)
  - Responsive design for mobile and desktop
  - Real-time data updates via Zustand store
- **Backend Weekly Leaderboard API**: New API endpoint for weekly leaderboard data
  - `/api/gamification/weekly-leaderboard` endpoint
  - Weekly points and volume tracking
  - Weekly stats calculation and reset functionality

### Changed
- **Wallet Page Navigation**: Updated sidebar navigation with "Wallet" tab instead of "Portfolio"
- **Leaderboard Data Management**: Migrated from local state to Zustand store for better performance
- **Weekly Leaderboard Component**: Refactored to use centralized state management
- **App Initialization**: Added leaderboard auto-refresh initialization on app startup

### Fixed
- **JSX Closing Tag Error**: Fixed missing JSX fragment closing tag in LeaderboardPage.tsx
- **Weekly Leaderboard 404 Error**: Resolved missing API endpoint by adding weekly-leaderboard route to backend
- **Null Value Handling**: Fixed `.toFixed()` errors on null values in WeeklyLeaderboard component
- **Import/Export Mismatch**: Fixed default export vs named export issue in LeaderboardPage
- **Backend Compilation Issues**: Manually patched compiled JavaScript files to include missing weekly leaderboard functionality

### Technical Improvements
- **Performance Optimization**: Reduced API calls through intelligent caching
- **Error Handling**: Enhanced error states and retry functionality for leaderboard data
- **State Management**: Centralized leaderboard state with Zustand
- **Code Organization**: Better separation of concerns with dedicated store and components

## [1.1.0] - 2025-07-15

### Added
- Comprehensive patch notes system- Real-time wallet balance updates after transactions
- WebSocket integration for live notifications
- Automatic balance refresh after successful transactions
- Global refresh context for coordinated UI updates

### Changed
- Optimized balance update timing from 2s to 1s for faster feedback
- Fixed WalletOverview component balance display logic
- Improved error handling in transaction tools

### Fixed
- Wallet balance not updating after successful transactions
- Variable declaration order in WalletOverview component
- Incorrect property destructuring in useWalletBalance hook

## [1.0.0] - 2024-07-15

### Added
- Comprehensive patch notes system- Initial release of BUAI application
- Wallet connection and management
- XFI token transactions
- Payment link system (fixed and global)
- DCA (Dollar Cost Averaging) orders
- Token swapping functionality
- Liquidity pool management
- AI-powered crypto assistant
- Real-time transaction notifications
- WebSocket integration
- Gamification system with points and achievements
- Leaderboard functionality
- Transaction history with XFI scan integration

### Technical Features
- React + TypeScript frontend
- Node.js + Express backend
- WebSocket real-time communication
- Blockchain integration with CrossFI testnet
- Smart contract interactions
- AI agent integration with LangChain
- Database integration with MongoDB
- Authentication with Privy
- Railway deployment configuration

---

## Version History

### Version Naming Convention
- **Major.Minor.Patch** (e.g., 1.2.3)
- **Major**: Breaking changes
- **Minor**: New features, backward compatible
- **Patch**: Bug fixes, backward compatible

### Release Types
- **Alpha**: Early development, unstable
- **Beta**: Feature complete, testing phase
- **RC**: Release candidate, final testing
- **Stable**: Production ready

## How to Update This Changelog

### For New Features
```markdown
### Added
- Comprehensive patch notes system- Description of new feature
- Another new feature
```

### For Changes
```markdown
### Changed
- Description of what changed
- Another change
```

### For Bug Fixes
```markdown
### Fixed
- Description of bug fix
- Another bug fix
```

### For Breaking Changes
```markdown
### Breaking Changes
- Description of breaking change
- Migration instructions if needed
```

### For Deprecations
```markdown
### Deprecated
- Description of deprecated feature
- Alternative to use instead
```

### For Removals
```markdown
### Removed
- Description of removed feature
- Reason for removal
```

## Contributing

When contributing to this changelog:
1. Add entries under the [Unreleased] section
2. Use clear, concise descriptions
3. Group changes by type (Added, Changed, Fixed, etc.)
4. Include issue numbers when applicable
5. Update version numbers when releasing 