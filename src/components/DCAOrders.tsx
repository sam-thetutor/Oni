import React, { useState } from 'react';
import { useDCAOrders, DCAOrder } from '../hooks/useDCAOrders';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  RefreshCw,
  Plus,
  Filter,
  ExternalLink,
  X,
  MoreVertical
} from 'lucide-react';

export const DCAOrders: React.FC = () => {
  const {
    orders,
    stats,
    systemStatus,
    loading,
    error,
    fetchOrders,
    cancelOrder,
    refresh
  } = useDCAOrders();

  const [filter, setFilter] = useState<'all' | 'active' | 'executed' | 'cancelled' | 'failed' | 'expired'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Filter orders based on selected filter
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  // Get status icon and color
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'executed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'expired':
        return <Clock className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'executed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'cancelled':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'expired':
        return `${baseClasses} bg-gray-100 text-gray-600`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-600`;
    }
  };

  // Handle cancel order
  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this DCA order?')) {
      const success = await cancelOrder(orderId);
      if (success) {
        setActiveDropdown(null);
      }
    }
  };

  // Calculate price distance
  const calculatePriceDistance = (order: DCAOrder, currentPrice?: number) => {
    const lastPrice = systemStatus?.priceMonitor?.lastPrice;
    if (!currentPrice && !lastPrice) return null;
    
    const price = currentPrice || lastPrice || 0;
    if (price === 0) return null;
    
    const difference = ((order.triggerPrice - price) / price * 100);
    
    return {
      percentage: Math.abs(difference).toFixed(1),
      isAbove: difference > 0,
      difference: difference.toFixed(1)
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading && orders.length === 0) {
    return (
      <div className="text-center py-8">
        <RefreshCw className="w-8 h-8 text-purple-400 mx-auto mb-4 animate-spin" />
        <p className="text-gray-400">Loading DCA orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">DCA Orders</h2>
          <p className="text-gray-400 text-sm">
            Automated Dollar Cost Averaging orders for XFI and tUSDC
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Order
          </button>
          
          <button
            onClick={refresh}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div key="total" className="bg-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
            <div className="text-gray-400 text-sm">Total Orders</div>
          </div>
          <div key="active" className="bg-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">{stats.activeOrders}</div>
            <div className="text-gray-400 text-sm">Active</div>
          </div>
          <div key="executed" className="bg-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{stats.executedOrders}</div>
            <div className="text-gray-400 text-sm">Executed</div>
          </div>
          <div key="volume" className="bg-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">
              ${(stats.totalVolumeUSD || 0).toFixed(2)}
            </div>
            <div className="text-gray-400 text-sm">Volume</div>
          </div>
        </div>
      )}

      {/* System Status */}
      {systemStatus && (
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-medium">System Status</h3>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${systemStatus.executor.isRunning ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-400">
                {systemStatus.executor.isRunning ? 'Running' : 'Stopped'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div key="price">
              <div className="text-gray-400">Last Price</div>
              <div className="text-white font-medium">${(systemStatus.priceMonitor.lastPrice || 0).toFixed(6)}</div>
            </div>
            <div key="check">
              <div className="text-gray-400">Last Check</div>
              <div className="text-white font-medium">
                {new Date(systemStatus.priceMonitor.lastCheck).toLocaleTimeString()}
              </div>
            </div>
            <div key="checks">
              <div className="text-gray-400">Total Checks</div>
              <div className="text-white font-medium">{systemStatus.priceMonitor.totalChecks}</div>
            </div>
            <div key="uptime">
              <div className="text-gray-400">Uptime</div>
              <div className="text-white font-medium">{systemStatus.executor.uptime}</div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'active', 'executed', 'cancelled', 'failed', 'expired'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === status
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {status}
            {status !== 'all' && stats && (
              <span className="ml-1">
                ({status === 'active' ? stats.activeOrders :
                  status === 'executed' ? stats.executedOrders :
                  status === 'cancelled' ? stats.cancelledOrders :
                  status === 'failed' ? stats.failedOrders : 0})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error</span>
          </div>
          <p className="text-red-300 mt-1">{error}</p>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              {filter === 'all' ? 'No DCA Orders' : `No ${filter} orders`}
            </h3>
            <p className="text-gray-500 mb-4">
              {filter === 'all' 
                ? 'Create your first DCA order to start automated trading'
                : `You don't have any ${filter} orders yet`
              }
            </p>
            {filter === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create Your First Order
              </button>
            )}
          </div>
        ) : (
          filteredOrders.map((order) => {
            const priceDistance = calculatePriceDistance(order, systemStatus?.priceMonitor.lastPrice);
            
            return (
              <div
                key={order._id}
                className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Order Type and Amount */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {order.orderType === 'buy' ? (
                          <TrendingUp className="w-5 h-5 text-green-400" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-400" />
                        )}
                        <span className="text-white font-medium">
                          {order.orderType === 'buy' ? 'Buy XFI' : 'Sell XFI'}
                        </span>
                      </div>
                      
                      <span className={getStatusBadge(order.status)}>
                        {order.status}
                      </span>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-1 text-sm">
                      <div className="text-gray-300">
                        <span className="text-white font-medium">{order.fromAmountFormatted} {order.fromToken}</span>
                        {' '}when XFI price{' '}
                        <span className="text-white font-medium">
                          {order.triggerCondition === 'above' ? 'reaches' : 'drops to'} ${order.triggerPrice}
                        </span>
                      </div>
                      
                      {priceDistance && (
                        <div className="text-gray-400">
                          Current: ${(systemStatus?.priceMonitor.lastPrice || 0).toFixed(6)} 
                          <span className={`ml-1 ${priceDistance.isAbove ? 'text-red-400' : 'text-green-400'}`}>
                            ({priceDistance.isAbove ? '+' : ''}{priceDistance.difference}%)
                          </span>
                        </div>
                      )}
                      
                      <div className="text-gray-400">
                        Created: {formatDate(order.createdAt)}
                        {order.expiresAt && (
                          <span className="ml-2">
                            • Expires: {formatDate(order.expiresAt)}
                          </span>
                        )}
                      </div>

                      {/* Execution Details */}
                      {order.status === 'executed' && order.executedAt && (
                        <div className="text-green-400">
                          Executed at ${order.executedPrice?.toFixed(6)} on {formatDate(order.executedAt)}
                          {order.transactionHash && (
                            <a
                              href={`https://test.xfiscan.com/tx/${order.transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 inline-flex items-center gap-1 hover:text-green-300"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View
                            </a>
                          )}
                        </div>
                      )}

                      {/* Failure Details */}
                      {order.status === 'failed' && order.failureReason && (
                        <div className="text-red-400">
                          Failed: {order.failureReason}
                          <span className="ml-2 text-gray-400">
                            (Retry {order.retryCount}/{order.maxRetries})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === order._id ? null : order._id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>

                    {activeDropdown === order._id && (
                      <div className="absolute right-0 top-10 bg-gray-800 border border-gray-700 rounded-lg py-1 min-w-[120px] z-10">
                        {order.status === 'active' && (
                          <button
                            key={`cancel-${order._id}`}
                            onClick={() => handleCancelOrder(order._id)}
                            className="w-full px-3 py-2 text-left text-red-400 hover:bg-gray-700 transition-colors"
                          >
                            Cancel Order
                          </button>
                        )}
                        <button
                          key={`copy-${order._id}`}
                          onClick={() => {
                            navigator.clipboard.writeText(order._id);
                            setActiveDropdown(null);
                          }}
                          className="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-700 transition-colors"
                        >
                          Copy Order ID
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Order Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Create DCA Order</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-gray-300 text-center py-8">
              <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="mb-4">
                Use the AI chat to create DCA orders with natural language!
              </p>
              <p className="text-sm text-gray-400">
                Try saying: "Create a DCA order to buy 20 tUSDC when XFI hits $0.05"
              </p>
              <button
                onClick={() => setShowCreateModal(false)}
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 