// Environment-aware configuration (matching backend logic)
const isProduction = import.meta.env.VITE_ENVIRONMENT === 'production';

// Backend URL
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3030';

// Chain Configuration
export const CHAIN_ID = isProduction 
  ? parseInt(import.meta.env.VITE_CHAIN_ID || '4158')
  : parseInt(import.meta.env.VITE_CHAIN_ID_TESTNET || '4157');

export const RPC_URL = isProduction 
  ? (import.meta.env.VITE_RPC_URL || 'https://rpc.mainnet.ms')
  : (import.meta.env.VITE_RPC_URL_TESTNET || 'https://rpc.testnet.ms');

export const EXPLORER_URL = isProduction 
  ? (import.meta.env.VITE_EXPLORER_URL || 'https://xfiscan.com')
  : (import.meta.env.VITE_EXPLORER_URL_TESTNET || 'https://test.xfiscan.com');

// Contract Addresses
export const PAYMENT_LINK_CONTRACT_ADDRESS = import.meta.env.VITE_PAYMENT_LINK_CONTRACT_ADDRESS || '0x8Ceb24694b8d3965Bd7224652B15B2A4f65Bd130';

// Environment Info
export const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || 'development';
export const IS_PRODUCTION = isProduction;

// Debug logging
console.log('🌍 Frontend Environment Configuration:');
console.log(`  - Environment: ${ENVIRONMENT}`);
console.log(`  - Is Production: ${IS_PRODUCTION}`);
console.log(`  - Chain ID: ${CHAIN_ID}`);
console.log(`  - RPC URL: ${RPC_URL}`);
console.log(`  - Explorer URL: ${EXPLORER_URL}`);
console.log(`  - Backend URL: ${BACKEND_URL}`);