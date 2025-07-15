import { useState, useEffect, useCallback } from 'react';
import { useBackend } from './useBackend';
import { useRefresh } from '../context/RefreshContext';
import { BACKEND_URL } from '../utils/constants';

export interface DCAOrder {
  _id: string;
  userId: string;
  walletAddress: string;
  orderType: 'buy' | 'sell';
  fromAmount: string;
  fromAmountFormatted: string;
  fromToken: string;
  toToken: string;
  triggerPrice: number;
  triggerCondition: 'above' | 'below';
  maxSlippage: number;
  status: 'active' | 'executed' | 'cancelled' | 'failed' | 'expired';
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  executedAt?: string;
  executedPrice?: number;
  transactionHash?: string;
  failureReason?: string;
  retryCount: number;
  maxRetries: number;
}

export interface DCAStats {
  totalOrders: number;
  activeOrders: number;
  executedOrders: number;
  cancelledOrders: number;
  failedOrders: number;
  totalVolumeUSD: number;
  totalProfitLoss: number;
}

export interface DCASystemStatus {
  executor: {
    isRunning: boolean;
    startTime: string;
    uptime: string;
    executionStats: {
      totalExecutions: number;
      successfulExecutions: number;
      failedExecutions: number;
      averageExecutionTime: number;
    };
    systemHealth: {
      priceDataAvailable: boolean;
      databaseConnected: boolean;
      lastError?: string;
    };
  };
  priceMonitor: {
    isRunning: boolean;
    lastCheck: string;
    lastPrice: number;
    totalChecks: number;
    executedOrders: number;
    errors: number;
    nextCheck: string;
  };
  timestamp: string;
}

export interface SwapQuote {
  fromToken: string;
  toToken: string;
  fromAmountFormatted: string;
  toAmountFormatted: string;
  price: number;
  minimumReceivedFormatted: string;
  gasFeeFormatted: string;
  slippage: number;
}

export const useDCAOrders = () => {
  const [orders, setOrders] = useState<DCAOrder[]>([]);
  const [stats, setStats] = useState<DCAStats | null>(null);
  const [systemStatus, setSystemStatus] = useState<DCASystemStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authFetch } = useBackend();
  const { onDCAOrdersRefresh } = useRefresh();

  // Fetch user's DCA orders
  const fetchOrders = useCallback(async (status?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (status && status !== 'all') {
        params.append('status', status);
      }
      
      const response = await authFetch(`${BACKEND_URL}/api/dca/orders?${params}`, {
        method: 'GET'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch DCA orders');
      }
    } catch (err: any) {
      console.error('Error fetching DCA orders:', err);
      setError(err.message || 'Failed to fetch DCA orders');
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  // Fetch user statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await authFetch('/api/dca/stats', {
        method: 'GET'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Error fetching DCA stats:', err);
    }
  }, [authFetch]);

  // Fetch system status
  const fetchSystemStatus = useCallback(async () => {
    try {
      const response = await authFetch('/api/dca/system/status', {
        method: 'GET'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSystemStatus(data.data);
      }
    } catch (err) {
      console.error('Error fetching system status:', err);
    }
  }, [authFetch]);

  // Register refresh function with global context
  useEffect(() => {
    onDCAOrdersRefresh(() => {
      console.log('🔄 useDCAOrders: Refreshing DCA orders...');
      fetchOrders();
      fetchStats();
    });
  }, [onDCAOrdersRefresh, fetchOrders, fetchStats]);

  // Create DCA order
  const createOrder = useCallback(async (orderData: {
    orderType: 'buy' | 'sell';
    amount: string;
    triggerPrice: number;
    triggerCondition: 'above' | 'below';
    slippage?: number;
    expirationDays?: number;
  }) => {
    setError(null);
    
    try {
      const response = await authFetch('/api/dca/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchOrders(); // Refresh orders
        await fetchStats(); // Refresh stats
        return { success: true, data: data.data };
      } else {
        setError(data.error || 'Failed to create DCA order');
        return { success: false, error: data.error };
      }
    } catch (err: any) {
      console.error('Error creating DCA order:', err);
      setError(err.message || 'Failed to create DCA order');
      return { success: false, error: err.message };
    }
  }, [authFetch, fetchOrders, fetchStats]);

  // Cancel DCA order
  const cancelOrder = useCallback(async (orderId: string) => {
    setError(null);
    
    try {
      const response = await authFetch(`/api/dca/orders/${orderId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchOrders(); // Refresh orders
        await fetchStats(); // Refresh stats
        return { success: true };
      } else {
        setError(data.error || 'Failed to cancel DCA order');
        return { success: false, error: data.error };
      }
    } catch (err: any) {
      console.error('Error cancelling DCA order:', err);
      setError(err.message || 'Failed to cancel DCA order');
      return { success: false, error: err.message };
    }
  }, [authFetch, fetchOrders, fetchStats]);

  // Get swap quote
  const getSwapQuote = useCallback(async (params: {
    fromToken: string;
    toToken: string;
    amount: string;
    slippage?: number;
  }): Promise<SwapQuote | null> => {
    try {
      const response = await authFetch('/api/dca/swap/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        console.error('Failed to get swap quote:', data.error);
        return null;
      }
    } catch (err) {
      console.error('Error getting swap quote:', err);
      return null;
    }
  }, [authFetch]);

  // Initial load
  useEffect(() => {
    fetchOrders();
    fetchStats();
    fetchSystemStatus();
  }, [fetchOrders, fetchStats, fetchSystemStatus]);

  return {
    // Data
    orders,
    stats,
    systemStatus,
    
    // State
    loading,
    error,
    
    // Actions
    fetchOrders,
    fetchStats,
    fetchSystemStatus,
    createOrder,
    cancelOrder,
    getSwapQuote,
    
    // Refresh all data
    refresh: () => {
      fetchOrders();
      fetchStats();
      fetchSystemStatus();
    }
  };
}; 