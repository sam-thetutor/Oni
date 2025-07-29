import React, { useState, useEffect } from 'react';
import { useBackendWallet } from '../hooks/useBackendWallet';
import { EXPLORER_URL } from '../utils/constants';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  status: string;
  timestamp: string;
  explorerUrl?: string;
}

interface CrossFiTransaction {
  txhash: string;
  timestamp: string;
  body: {
    messages: Array<{
      from?: string;
      data?: {
        to?: string;
        value?: string;
      };
    }>;
  };
  code: number;
  evm_txhashes: string[];
}

export const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { backendWallet } = useBackendWallet();

  const fetchTransactions = async () => {
    if (!backendWallet) {
      setTransactions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`🔍 Fetching transactions for backend wallet: ${backendWallet}`);
      console.log(`🔍 Using explorer URL: ${EXPLORER_URL}`);

      const response = await fetch(`${EXPLORER_URL}/api/1.0/txs?address=${backendWallet}&page=1&limit=20`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status}`);
      }

      const data = await response.json();
      console.log('Raw transaction data:', data);

      if (data.docs && Array.isArray(data.docs)) {
        const parsedTransactions: Transaction[] = data.docs
          .filter((tx: CrossFiTransaction) => tx.code === 0) // Only successful transactions
          .map((tx: CrossFiTransaction) => {
            const message = tx.body.messages[0];
            const data = message.data;
            
            // Extract transaction details
            const from = message.from || '';
            const to = data?.to || '';
            const value = data?.value || '0';
            
            // Convert wei to XFI (1 XFI = 10^18 wei)
            const valueInXFI = (parseInt(value) / Math.pow(10, 18)).toString();
            
            return {
              hash: tx.evm_txhashes[0] || tx.txhash,
              from: from.toLowerCase(),
              to: to.toLowerCase(),
              value: valueInXFI,
              status: tx.code === 0 ? 'success' : 'failed',
              timestamp: tx.timestamp,
              explorerUrl: `${EXPLORER_URL}/tx/${tx.evm_txhashes[0] || tx.txhash}`
            };
          })
          .filter((tx: Transaction) => tx.from && tx.to && tx.value !== '0'); // Filter out empty transactions
        
        console.log('Parsed transactions:', parsedTransactions);
        setTransactions(parsedTransactions);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [backendWallet]);

  const getExplorerUrl = (hash: string) => {
    return `${EXPLORER_URL}/tx/${hash}`;
  };

  if (loading) {
    return (
      <div className="bg-black/20 backdrop-blur-xl border border-green-400/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-400 mb-4 font-mono">Transaction History</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black/20 backdrop-blur-xl border border-red-400/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-400 mb-4 font-mono">Transaction History</h3>
        <p className="text-red-300 font-mono">{error}</p>
        <button
          onClick={fetchTransactions}
          className="mt-4 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 hover:text-green-300 rounded-lg transition-all duration-200 font-mono"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black/20 backdrop-blur-xl border border-green-400/30 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-green-400 mb-4 font-mono">Transaction History</h3>
      
      {transactions.length === 0 ? (
        <p className="text-green-300 font-mono">No transactions found</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx, index) => (
            <div key={index} className="bg-black/10 backdrop-blur-xl border border-green-400/20 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-green-300 font-mono">
                  {new Date(tx.timestamp).toLocaleString()}
                </span>
                <span className={`text-sm font-semibold font-mono ${
                  tx.status === 'success' ? 'text-green-400' : 
                  tx.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {tx.status}
                </span>
              </div>
              
              <div className="text-sm text-green-300 font-mono mb-2">
                <div>From: {tx.from}</div>
                <div>To: {tx.to}</div>
                <div>Value: {parseFloat(tx.value).toFixed(4)} XFI</div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-green-400/70 font-mono">
                  {tx.hash.substring(0, 10)}...{tx.hash.substring(tx.hash.length - 8)}
                </span>
                <a
                  href={getExplorerUrl(tx.hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-400 hover:text-green-300 underline font-mono"
                >
                  View on Explorer →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button
        onClick={fetchTransactions}
        className="mt-4 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 hover:text-green-300 rounded-lg transition-all duration-200 font-mono"
      >
        Refresh
      </button>
    </div>
  );
};