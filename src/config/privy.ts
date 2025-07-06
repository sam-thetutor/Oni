
const crossfi = {
  id: 4157,
  name: 'Crossfi Testnet',
  rpcUrls: {
    default: { http: ['https://rpc.testnet.ms'] }
  },
  blockExplorers: {
    default: { name: 'Crossfi Testnet Explorer', url: 'https://test.xfiscan.com' }
  },
  nativeCurrency: {
    name: 'Crossfi',
    symbol: 'XFI',
    decimals: 18,
  },
} as const;

export const privyConfig = {
  appId:  'cmcp9doki0072k30m7wxy5loa',
  config: {
    loginMethods: ['wallet'] as ('wallet')[],
    defaultChain: crossfi,
    supportedChains: [crossfi],
  },
  defaultChain: crossfi,
  appearance: {
    accentColor: "#6A6FF5",
    theme: "#FFFFFF",
    logo: "https://auth.privy.io/logos/privy-logo.png",
    walletChainType: "ethereum-only",
  },
  embeddedWallets: {
    ethereum: {
      createOnLogin: 'users-without-wallets'
    }
  }
};
   
