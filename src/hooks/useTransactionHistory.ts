import { useEffect } from 'react';
import { useBackendWallet } from './useBackendWallet';
import { 
  useTransactionHistoryStore, 
  startTransactionHistoryAutoRefresh, 
  stopTransactionHistoryAutoRefresh 
} from '../stores/transactionHistoryStore';

export function useTransactionHistory() {
  const { backendWallet, loading: walletLoading } = useBackendWallet();
  const { 
    transactions, 
    loading, 
    error, 
    lastFetched,
    hasMore,
    currentPage,
    fetchTransactionHistory, 
    loadMoreTransactions,
    clearCache 
  } = useTransactionHistoryStore();

  // Log when backend wallet changes
  useEffect(() => {
    if (backendWallet) {
      console.log('🏦 Backend wallet address available:', backendWallet);
    } else if (!walletLoading) {
      console.log('🏦 No backend wallet address available');
    }
  }, [backendWallet, walletLoading]);

  // Start auto-refresh when wallet is available
  useEffect(() => {
    if (backendWallet) {
      console.log('🔄 Starting transaction history auto-refresh for backend wallet:', backendWallet);
      startTransactionHistoryAutoRefresh(backendWallet);
      
      // Cleanup on unmount
      return () => {
        console.log('🔄 Stopping transaction history auto-refresh');
        stopTransactionHistoryAutoRefresh();
      };
    }
  }, [backendWallet]);

  // Clear cache when user logs out
  useEffect(() => {
    if (!backendWallet && !walletLoading) {
      console.log('🔄 User logged out, clearing transaction history cache');
      clearCache();
      stopTransactionHistoryAutoRefresh();
    }
  }, [backendWallet, walletLoading, clearCache]);

  const loadMore = () => {
    if (backendWallet && hasMore && !loading) {
      console.log('📄 Loading more transactions for backend wallet:', backendWallet);
      loadMoreTransactions(backendWallet);
    }
  };

  const refresh = () => {
    if (backendWallet) {
      console.log('🔄 Refreshing transaction history for backend wallet:', backendWallet);
      fetchTransactionHistory(backendWallet, true); // Force refresh
    }
  };

  // Only show loading if we have no cached data and are actually loading
  const effectiveLoading = loading && transactions.length === 0;

  return {
    transactions,
    loading: effectiveLoading || walletLoading,
    error,
    lastFetched,
    hasMore,
    currentPage,
    loadMore,
    refresh,
    walletAddress: backendWallet,
    // Expose the raw loading state for background updates
    isUpdating: loading,
  };
} 