import React from 'react';
import { useTransactionHistory } from '../hooks/useTransactionHistory';

export const TransactionHistory: React.FC = () => {
  const { 
    transactions, 
    loading, 
    error, 
    hasMore, 
    loadMore, 
    refresh,
    lastFetched 
  } = useTransactionHistory();

  // Show cached data if available, even while loading
  const hasCachedData = transactions.length > 0;
  const showLoadingState = loading && !hasCachedData;

  if (showLoadingState) {
    return (
      <div className="bg-black/20 backdrop-blur-xl border border-green-400/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-400 mb-4 font-mono">Transaction History</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
        </div>
      </div>
    );
  }

  if (error && !hasCachedData) {
    return (
      <div className="bg-black/20 backdrop-blur-xl border border-red-400/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-400 mb-4 font-mono">Transaction History</h3>
        <p className="text-red-300 font-mono">{error}</p>
        <button
          onClick={refresh}
          className="mt-4 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 hover:text-green-300 rounded-lg transition-all duration-200 font-mono"
        >
          Retry
        </button>
      </div>
    );
  }

  const getTransactionTypeColor = (type?: string) => {
    switch (type) {
      case 'swap':
        return 'text-blue-400';
      case 'payment-link':
        return 'text-purple-400';
      case 'transfer':
      default:
        return 'text-green-400';
    }
  };

  const getTransactionTypeLabel = (type?: string) => {
    switch (type) {
      case 'swap':
        return 'SWAP';
      case 'payment-link':
        return 'PAYMENT LINK';
      case 'transfer':
      default:
        return 'TRANSFER';
    }
  };

  return (
    <div className="bg-black/20 backdrop-blur-xl border border-green-400/30 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-green-400 font-mono">Transaction History</h3>
          {loading && hasCachedData && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
              <span className="text-xs text-green-300 font-mono">Updating...</span>
            </div>
          )}
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="px-3 py-1 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 hover:text-green-300 rounded-lg transition-all duration-200 font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
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
                  tx.status === 'success' ? getTransactionTypeColor(tx.type) : 
                  tx.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {getTransactionTypeLabel(tx.type)}
                </span>
              </div>
              
              <div className="text-sm text-green-300 font-mono mb-2">
                {tx.type === 'swap' && tx.swapDetails ? (
                  <>
                    <div>Type: Token Swap</div>
                    <div>From: {tx.from}</div>
                    <div>Swap: {tx.swapDetails.fromAmount} {tx.swapDetails.fromToken} → {tx.swapDetails.toAmount} {tx.swapDetails.toToken}</div>
                  </>
                ) : tx.type === 'payment-link' ? (
                  <>
                    <div>Type: Payment Link Transaction</div>
                    <div>From: {tx.from}</div>
                    <div>To: {tx.to}</div>
                    <div>Value: {parseFloat(tx.value).toFixed(4)} XFI</div>
                  </>
                ) : (
                  <>
                    <div>From: {tx.from}</div>
                    <div>To: {tx.to}</div>
                    <div>Value: {parseFloat(tx.value).toFixed(4)} XFI</div>
                  </>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-green-400/70 font-mono">
                  {tx.hash.substring(0, 10)}...{tx.hash.substring(tx.hash.length - 8)}
                </span>
                <a
                  href={tx.explorerUrl}
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
      
      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 hover:text-green-300 rounded-lg transition-all duration-200 font-mono disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
};