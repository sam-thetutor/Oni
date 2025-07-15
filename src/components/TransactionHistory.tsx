import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, RotateCcw, ExternalLink, Filter, RefreshCw } from 'lucide-react';
import { useRealTimeWallet } from '../hooks/useRealTimeWallet';

interface TransactionHistoryProps {
  walletAddress: string | null;
}

interface Transaction {
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
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ walletAddress }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'send' | 'receive'>('all');
  const { transactions: realTimeTransactions, isConnected, refreshTransactions } = useRealTimeWallet();

  useEffect(() => {
    if (!walletAddress) return;
    setLoading(true);
    setError(null);
    fetch(`https://test.xfiscan.com/api/1.0/txs?address=${walletAddress}&page=1&limit=20`)
      .then(res => res.json())
      .then(data => {
        setTransactions(data.docs || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch transactions');
        setLoading(false);
      });
  }, [walletAddress]);

  if (!walletAddress) {
    return <div className="text-gray-400">No Oni wallet found.</div>;
  }

  if (loading) {
    return <div className="text-gray-400">Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-red-400">{error}</div>;
  }

  if (transactions.length === 0) {
    return <div className="text-gray-400">No transactions found.</div>;
  }
  const getType = (from: string | undefined) => {
    return from?.toLowerCase() === walletAddress?.toLowerCase() ? 'send' : 'receive';
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    return getType(tx?.body?.messages[0]?.from) === filter;
  });

  const getTransactionIcon = (type: 'send' | 'receive') => {
    switch (type) {
      case 'send':
        return <ArrowUpRight className="w-5 h-5 text-red-400" />;
      case 'receive':
        return <ArrowDownLeft className="w-5 h-5 text-green-400" />;
      default:
        return <RotateCcw className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Real-time Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-white">Transaction History</h3>
          {isConnected && (
            <div className="flex items-center space-x-1 text-green-400 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          )}
        </div>
        <button
          onClick={refreshTransactions}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          title="Refresh transactions"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Real-time Transaction Notifications */}
      {realTimeTransactions.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-blue-400 text-sm">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>New real-time transactions available</span>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
        {[
          { key: 'all', label: 'All' },
          { key: 'send', label: 'Sent' },
          { key: 'receive', label: 'Received' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              filter === key
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No transactions found for the selected filter.</p>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const {body} = tx;
            const {messages} = body;
            const {from, to, value, data} = messages[0];
            console.log("messages", messages[0]);
            const type = getType(from) as 'send' | 'receive';
            return (
              <div
                key={tx.txhash}
                className="bg-gray-800/30 rounded-lg p-4 hover:bg-gray-800/50 transition-all duration-200 border border-gray-700/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-gray-700/50 rounded-full">
                      {getTransactionIcon(type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-white">
                          {type === 'send' ? 'Sent' : 'Received'}
                        </h3>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">
                        {type === 'send'
                          ? `To ${data?.to ? data?.to.slice(0, 10) + '...' + data?.to.slice(-6) : '-'}`
                          : `From ${data?.from ? data?.from.slice(0, 10) + '...' + data?.from.slice(-6) : '-'}`}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{new Date(tx.timestamp).toLocaleString()}</span>
                        <span className="capitalize">Confirmed</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${
                      type === 'send' ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {type === 'send' ? '-' : '+'}
                      {data ? (Number(data?.value) / 1e18).toFixed(4) : '0'} XFI
                    </div>
                    <a
                      href={`https://test.xfiscan.com/tx/${tx.txhash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex items-center space-x-1 text-purple-400 hover:text-purple-300 text-xs transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View on Explorer</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};