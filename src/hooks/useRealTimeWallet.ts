import { useEffect, useState, useCallback } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { useRefresh } from '../context/RefreshContext';
import { usePrivy } from '@privy-io/react-auth';

interface BalanceData {
  address: string;
  balance: string;
  formatted: string;
  symbol: string;
  timestamp: string;
}

interface TransactionData {
  hash: string;
  from: string;
  to: string;
  value: string;
  status: string;
  timestamp: string;
}

interface PointsData {
  points: number;
  reason: string;
  transactionHash: string;
  timestamp: string;
}

interface TransactionSuccessData {
  transactionHash: string;
  from: string;
  to: string;
  value: string;
  status: string;
  explorerUrl: string | null;
  timestamp: string;
}

export const useRealTimeWallet = () => {
  const { socket, isConnected, emit } = useWebSocket();
  const { refreshWallet, refreshTransactions, refreshDCAOrders, refreshPaymentLinks } = useRefresh();
  const { user } = usePrivy();
  
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [pointsEarned, setPointsEarned] = useState<PointsData | null>(null);
  const [lastTransaction, setLastTransaction] = useState<TransactionSuccessData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Listen for real-time events
  useEffect(() => {
    console.log('🔌 Setting up WebSocket event listeners...');
    console.log('🔌 Socket connected:', isConnected);
    console.log('🔌 Socket object:', socket);
    
    if (!socket || !isConnected) {
      console.log('🔌 WebSocket not ready, skipping event setup');
      return;
    }

    // Balance updates
    const handleBalanceUpdate = (data: BalanceData) => {
      console.log('💰 Balance updated:', data);
      setBalance(data);
      setIsUpdating(false);
      
      // Trigger global refreshes
      refreshWallet();
      refreshTransactions();
      refreshDCAOrders();
      refreshPaymentLinks();
    };

    // New transactions
    const handleNewTransaction = (data: TransactionData) => {
      console.log('📝 New transaction:', data);
      setTransactions(prev => [data, ...prev.slice(0, 9)]); // Keep latest 10
      
      // Trigger global refreshes
      refreshWallet();
      refreshTransactions();
      refreshDCAOrders();
      refreshPaymentLinks();
    };

    // Points earned
    const handlePointsEarned = (data: PointsData) => {
      console.log('🏆 Points earned:', data);
      setPointsEarned(data);
      
      // Trigger global refreshes
      refreshWallet();
      refreshTransactions();
      refreshDCAOrders();
      refreshPaymentLinks();
      
      // Clear points notification after 5 seconds
      setTimeout(() => {
        setPointsEarned(null);
      }, 5000);
    };

    // Transaction success
    const handleTransactionSuccess = (data: TransactionSuccessData) => {
      console.log('✅ Transaction success:', data);
      setLastTransaction(data);
      
      // Trigger global refreshes
      refreshWallet();
      refreshTransactions();
      refreshDCAOrders();
      refreshPaymentLinks();
      
      // Clear transaction notification after 10 seconds
      setTimeout(() => {
        setLastTransaction(null);
      }, 10000);
    };

    // Error handling
    const handleError = (data: { message: string }) => {
      console.error('❌ WebSocket error:', data.message);
    };

    // Attach event listeners
    console.log('🔌 Attaching WebSocket event listeners...');
    socket.on('wallet:balance:updated', handleBalanceUpdate);
    socket.on('wallet:transaction:new', handleNewTransaction);
    socket.on('wallet:points:earned', handlePointsEarned);
    socket.on('wallet:transaction:success', handleTransactionSuccess);
    socket.on('error', handleError);
    
    // Test event listener to verify connection
    socket.on('test-response', (data) => {
      console.log('🔌 Test response received:', data);
    });
    
    console.log('🔌 WebSocket event listeners attached successfully');

    // Cleanup
    return () => {
      socket.off('wallet:balance:updated', handleBalanceUpdate);
      socket.off('wallet:transaction:new', handleNewTransaction);
      socket.off('wallet:points:earned', handlePointsEarned);
      socket.off('wallet:transaction:success', handleTransactionSuccess);
      socket.off('error', handleError);
    };
  }, [socket, isConnected, refreshWallet, refreshTransactions, refreshDCAOrders, refreshPaymentLinks]);

  // Manual refresh functions
  const refreshBalance = useCallback(() => {
    if (isConnected) {
      setIsUpdating(true);
      emit('wallet:refresh:balance');
    }
  }, [isConnected, emit]);

  // const refreshTransactions = useCallback(() => {
  //   if (isConnected) {
  //     emit('wallet:refresh:transactions');
  //   }
  // }, [isConnected, emit]);

  const refreshStats = useCallback(() => {
    if (isConnected) {
      emit('wallet:refresh:stats');
    }
  }, [isConnected, emit]);

  // Auto-refresh balance when user changes
  useEffect(() => {
    if (user && isConnected) {
      refreshBalance();
    }
  }, [user, isConnected, refreshBalance]);

  // Test WebSocket connection
  const testConnection = useCallback(() => {
    if (isConnected && socket) {
      console.log('🔌 Testing WebSocket connection...');
      socket.emit('test', { message: 'Hello from frontend!' });
    } else {
      console.log('🔌 WebSocket not connected, cannot test');
    }
  }, [isConnected, socket]);

  return {
    // State
    balance,
    transactions,
    pointsEarned,
    lastTransaction,
    isUpdating,
    isConnected,
    
    // Actions
    refreshBalance,
    refreshTransactions,
    refreshStats,
    testConnection,
    
    // Clear notifications
    clearPointsNotification: () => setPointsEarned(null),
    clearTransactionNotification: () => setLastTransaction(null)
  };
}; 