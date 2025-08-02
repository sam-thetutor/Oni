import React, { useState, useEffect } from 'react';
import { useBackend } from '../hooks/useBackend';
import { EXPLORER_URL } from '../utils/constants';

interface DCAOrder {
  id: string;
  userId: string;
  orderType: 'swap';
  fromToken: string;
  toToken: string;
  fromAmount: string;
  fromAmountFormatted: string;
  triggerPrice: number;
  triggerCondition: 'above' | 'below';
  status: 'active' | 'executed' | 'cancelled' | 'failed' | 'expired';
  createdAt: string;
  executedAt?: string;
  transactionHash?: string;
}

export const DCAOrders: React.FC = () => {
  const [orders, setOrders] = useState<DCAOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authFetch } = useBackend();

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await authFetch('/api/dca/orders');
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError(data.error || 'Failed to fetch DCA orders');
      }
    } catch (err) {
      console.error('Error fetching DCA orders:', err);
      setError('Failed to fetch DCA orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'executed':
        return 'text-blue-400';
      case 'cancelled':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      case 'expired':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const getSwapColor = (fromToken: string, toToken: string) => {
    return 'text-blue-400'; // All swaps are blue for consistency
  };

  if (loading) {
    return (
      <div className="bg-black/20 backdrop-blur-xl border border-green-400/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-400 mb-4 font-mono">DCA Orders</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black/20 backdrop-blur-xl border border-red-400/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-400 mb-4 font-mono">DCA Orders</h3>
        <p className="text-red-300 font-mono">{error}</p>
        <button
          onClick={fetchOrders}
          className="mt-4 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 hover:text-green-300 rounded-lg transition-all duration-200 font-mono"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black/20 backdrop-blur-xl border border-green-400/30 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-green-400 mb-4 font-mono">DCA Orders</h3>
      
      {orders.length === 0 ? (
        <p className="text-green-300 font-mono">No DCA orders found</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-black/10 backdrop-blur-xl border border-green-400/20 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-semibold font-mono ${getSwapColor(order.fromToken, order.toToken)}`}>
                    SWAP
                  </span>
                  <span className="text-sm text-green-300 font-mono">
                    {order.fromAmountFormatted} {order.fromToken} → {order.toToken}
                  </span>
                </div>
                <span className={`text-sm font-semibold font-mono ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="text-sm text-green-300 font-mono mb-2">
                <div>Trigger: When XFI price {order.triggerCondition} ${order.triggerPrice}</div>
                <div>Created: {new Date(order.createdAt).toLocaleString()}</div>
                {order.executedAt && (
                  <div>Executed: {new Date(order.executedAt).toLocaleString()}</div>
                )}
              </div>
              
              {order.transactionHash && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-green-400/70 font-mono">
                    {order.transactionHash.substring(0, 10)}...{order.transactionHash.substring(order.transactionHash.length - 8)}
                  </span>
                  <a
                    href={`${EXPLORER_URL}/tx/${order.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-400 hover:text-green-300 underline font-mono"
                  >
                    View on Explorer →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <button
        onClick={fetchOrders}
        className="mt-4 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 hover:text-green-300 rounded-lg transition-all duration-200 font-mono"
      >
        Refresh
      </button>
    </div>
  );
}; 