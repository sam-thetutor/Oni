import { CHAIN_ID, RPC_URL, EXPLORER_URL, IS_PRODUCTION } from '../utils/constants';

// Environment-aware CrossFi chain configuration
const crossfi = {
  id: CHAIN_ID,
  name: IS_PRODUCTION ? 'CrossFi Mainnet' : 'CrossFi Testnet',
  network: 'crossfi',
  nativeCurrency: {
    decimals: 18,
    name: 'CrossFi',
    symbol: 'XFI',
  },
  rpcUrls: {
    default: {
      http: [RPC_URL],
    },
    public: {
      http: [RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: IS_PRODUCTION ? 'CrossFi Explorer' : 'CrossFi Testnet Explorer',
      url: EXPLORER_URL,
    },
  },
};

const appId = import.meta.env.VITE_PRIVY_APP_ID || 'cmcp9doki0072k30m7wxy5loa';

// Debug logging
console.log('🔧 Privy Configuration Debug:');
console.log('  - App ID:', appId);
console.log('  - App ID length:', appId.length);
console.log('  - Environment:', import.meta.env.VITE_ENVIRONMENT);

export const PrivyConfig = {
  appId,
  config: {
    loginMethods: ['wallet', 'email'],
    appearance: {
      theme: 'dark' as const,
      accentColor: '#10b981' as const,
      showWalletLoginFirst: true,
    },
    defaultChain: crossfi,
    supportedChains: [crossfi],
  },
};
   
