import React, { useEffect } from 'react';
import { useRealTimeWallet } from '../hooks/useRealTimeWallet';
import { useRefresh } from '../context/RefreshContext';
import { RefreshCw, ExternalLink, Copy } from 'lucide-react';

interface XFIScanTransaction {
  txhash: string;
  timestamp: string;
  body: {
    messages: Array<{
      from?: string;
      to?: string;
      value?: string;
      data?: {
        value?: string;
        to?: string;
        from?: string;
      };
    }>;
  };
  evm_txhashes: string[];
  code: number;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  status: string;
  timestamp: string;
}

export const TransactionHistory: React.FC = () => {
  const { transactions: realTimeTransactions, isConnected, refreshTransactions } = useRealTimeWallet();
  const { onTransactionRefresh } = useRefresh();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchTransactions = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the XFI scan API directly
      const response = await fetch('https://test.xfiscan.com/api/1.0/txs?address=0x85a4b09fb0788f1c549a68dc2edae3f97aeb5dd7&page=1&limit=20');
      const data = await response.json();
      
      if (data.docs) {
        // Parse the XFI scan transaction data
        const parsedTransactions: Transaction[] = data.docs
          .filter((tx: XFIScanTransaction) => tx.code === 0) // Only successful transactions
          .map((tx: XFIScanTransaction) => {
            const message = tx.body.messages[0];
            const data = message.data;
            
            // Extract transaction details
            const from = data?.from || message.from || '';
            const to = data?.to || message.to || '';
            const value = data?.value || message.value || '0';
            
            // Convert wei to XFI (1 XFI = 10^18 wei)
            const valueInXFI = (parseInt(value) / Math.pow(10, 18)).toString();
            
            return {
              hash: tx.evm_txhashes[0] || tx.txhash,
              from: from.toLowerCase(),
              to: to.toLowerCase(),
              value: valueInXFI,
              status: tx.code === 0 ? 'success' : 'failed',
              timestamp: tx.timestamp
            };
          })
          .filter((tx: any) => tx.from && tx.to && tx.value !== '0'); // Filter out empty transactions
        
        setTransactions(parsedTransactions);
      } else {
        setError('Failed to fetch transactions');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, []);

  // Register refresh function with global context
  useEffect(() => {
    onTransactionRefresh(() => {
      console.log('🔄 TransactionHistory: Refreshing transactions...');
      fetchTransactions();
    });
  }, [onTransactionRefresh, fetchTransactions]);

  // Initial load
  React.useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatValue = (value: string) => {
    const numValue = parseFloat(value);
    return numValue.toFixed(3);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getExplorerUrl = (hash: string) => {
    return `https://test.xfiscan.com/tx/${hash}`;
  };

  // Combine real-time transactions with fetched transactions
  const allTransactions = React.useMemo(() => {
    const combined = [...(realTimeTransactions || []), ...transactions];
    // Remove duplicates based on hash
    const unique = combined.filter((tx, index, self) => 
      index === self.findIndex(t => t.hash === tx.hash)
    );
    return unique.slice(0, 20); // Keep latest 20
  }, [realTimeTransactions, transactions]);

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Transaction History</h2>
        <div className="flex items-center space-x-2">
          {isConnected && (
            <div className="flex items-center space-x-1 text-green-400 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          )}
          <button
            onClick={fetchTransactions}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            title="Refresh transactions"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-gray-400 mt-2">Loading transactions...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchTransactions}
            className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && allTransactions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No transactions found</p>
        </div>
      )}

      {!loading && !error && allTransactions.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Hash</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">From</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">To</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Value</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allTransactions.map((tx, index) => (
                <tr key={`${tx.hash}-${index}`} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-300 font-mono text-sm">
                        {formatAddress(tx.hash)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(tx.hash)}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Copy hash"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-300 font-mono text-sm">
                      {formatAddress(tx.from)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-300 font-mono text-sm">
                      {formatAddress(tx.to)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-green-300 font-semibold">
                      {formatValue(tx.value)} XFI
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`${getStatusColor(tx.status)} font-medium`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <a
                        href={getExplorerUrl(tx.hash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="View on explorer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};