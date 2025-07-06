export interface Wallet {
  address: string;
  balance: {
    eth: number;
    usdc: number;
    usdt: number;
    [key: string]: number;
  };
  chain: 'ethereum' | 'polygon' | 'bsc' | 'arbitrum' | 'crossfi';
  connectionType: 'seedphrase' | 'privatekey' | 'privy';
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap';
  amount: number;
  token: string;
  fromAddress: string;
  toAddress: string;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
  hash: string;
  gasUsed?: number;
  gasPrice?: number;
}

export interface AICommand {
  id: string;
  prompt: string;
  timestamp: Date;
  status: 'processing' | 'completed' | 'error';
  result?: string;
}