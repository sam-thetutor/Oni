export interface CrossFiBalance {
  token: string;
  balance: string;
  decimals: number;
}

export interface BalanceResponse {
  address: string;
  balances: CrossFiBalance[];
}

export interface TransactionResponse {
  success: boolean;
  transaction_hash?: string;
  explorer_link?: string;
  new_balance?: string;
  error?: string;
}

export interface SendTokensParams {
  destination: string;
  token: string;
  amount: string;
}

export interface TransactionHistoryParams {
  address: string;
  limit?: number;
  offset?: number;
}

export interface Transaction {
  hash: string;
  timestamp: string;
  type: 'send' | 'receive';
  amount: string;
  token: string;
  from: string;
  to: string;
  status: 'success' | 'failed' | 'pending';
}

export interface TransactionHistoryResponse {
  transactions: Transaction[];
  total: number;
}

export interface BackendError {
  message: string;
  code?: string;
}

export interface BackendResponse {
  success: boolean;
  data?: any;
  error?: string;
} 