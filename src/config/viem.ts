import { createPublicClient, createWalletClient, http, defineChain } from 'viem';
import { CHAIN_ID, RPC_URL, EXPLORER_URL, IS_PRODUCTION } from '../utils/constants';

// Environment-aware CrossFi chain definition
export const crossfiMainnet = defineChain({
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
});

// Create public client for read-only operations
export const publicClient = createPublicClient({
  chain: crossfiMainnet,
  transport: http(RPC_URL),
});

// Create wallet client for transactions
export const createWalletClient = (account: any) => {
  return createWalletClient({
    account,
    chain: crossfiMainnet,
    transport: http(RPC_URL),
  });
}; 