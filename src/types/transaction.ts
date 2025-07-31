export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  status: string;
  timestamp: string;
  explorerUrl?: string;
  type?: 'transfer' | 'swap' | 'payment-link';
  swapDetails?: {
    fromToken: string;
    toToken: string;
    fromAmount: string;
    toAmount: string;
  };
}

export interface CrossFiTransaction {
  txhash: string;
  timestamp: string;
  addresses?: string[];
  body: {
    messages: Array<{
      from?: string;
      data?: {
        to?: string;
        value?: string;
        input?: {
          methodName?: string;
          args?: {
            amountIn?: string;
            amountOutMin?: string;
            path?: string[];
            to?: string;
            deadline?: string;
          };
        };
        output?: {
          amounts?: string[];
        };
      };
    }>;
  };
  code: number;
  evm_txhashes: string[];
  logs?: Array<{
    msg_index: number;
    events: Array<{
      type: string;
      attributes: Array<{
        key: string;
        value: string;
      }>;
    }>;
  }>;
}

export interface TransactionHistoryState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  hasMore: boolean;
  currentPage: number;
} 