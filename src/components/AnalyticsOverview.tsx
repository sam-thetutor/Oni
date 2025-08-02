import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from '../utils/constants';
import { TrendingUp, MessageSquare, Users, Wallet, Link, BarChart3 } from 'lucide-react';

interface AnalyticsData {
  totalVolumeProcessed: {
    xfi: string;
    usdc: string;
  };
  totalTransactions: number;
  totalPaymentLinks: {
    count: number;
    totalAmount: {
      xfi: string;
      usdc: string;
    };
  };
  totalDCAOrders: {
    count: number;
    totalVolume: {
      xfi: string;
      usdc: string;
    };
  };
  totalMessages: number;
  totalUsers: number;
}

// Utility function to format numbers
const formatNumber = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0';
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toLocaleString();
  }
};

// Utility function to format token amounts
const formatTokenAmount = (amount: string, decimals: number = 6): string => {
  const num = parseFloat(amount);
  if (isNaN(num)) return '0';
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  } else {
    return num.toFixed(decimals);
  }
};

export const AnalyticsOverview: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${BACKEND_URL}/api/analytics/overview`);
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data);
      } else {
        setError(data.error || 'Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className=" rounded-3xl p-8 mt-1">
        <div className="animate-pulse">
          <div className="h-8 bg-green-400/20 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-green-400/10 rounded-xl p-4 border border-green-400/20">
                <div className="h-4 bg-green-400/20 rounded mb-2"></div>
                <div className="h-8 bg-green-400/20 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black/20 backdrop-blur-xl border-2 border-green-400/30 rounded-3xl p-8 mt-8">
        <div className="text-center">
          <div className="text-red-400 mb-2 font-mono">⚠️ Analytics Unavailable</div>
          <div className="text-green-300 text-sm font-mono">{error}</div>
          <button 
            onClick={fetchAnalytics}
            className="mt-4 px-6 py-2 bg-green-400/20 text-green-400 rounded-xl hover:bg-green-400/30 transition-all duration-200 border border-green-400/30 font-mono"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="rounded-3xl  mt-1">
      
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* AI Messages - First Card */}
        <div className="bg-green-400/10 border-2 border-green-400/30 rounded-xl p-6 hover:border-green-400/50 transition-all duration-300">
          <div className="flex items-center mb-3">
            <MessageSquare className="w-5 h-5 text-green-400 mr-2" />
            <h3 className="text-sm font-medium text-green-300 font-mono">Processed Prompts</h3>
          </div>
          <div className="text-2xl font-bold text-green-400 font-mono">
            {formatNumber(analytics.totalMessages)}
          </div>
        </div>

        {/* Total Volume */}
        <div className="bg-green-400/10 border-2 border-green-400/30 rounded-xl p-6 hover:border-green-400/50 transition-all duration-300">
          <div className="flex items-center mb-3">
            <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
            <h3 className="text-sm font-medium text-green-300 font-mono">Total Volume</h3>
          </div>
          <div className="text-2xl font-bold text-green-400 mb-1 font-mono">
            {formatTokenAmount(analytics.totalVolumeProcessed.xfi, 2)} XFI
          </div>
          <div className="text-sm text-green-300 font-mono">
            {formatTokenAmount(analytics.totalVolumeProcessed.usdc, 2)} USDC
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-green-400/10 border-2 border-green-400/30 rounded-xl p-6 hover:border-green-400/50 transition-all duration-300">
          <div className="flex items-center mb-3">
            <Wallet className="w-5 h-5 text-green-400 mr-2" />
            <h3 className="text-sm font-medium text-green-300 font-mono">Transactions</h3>
          </div>
          <div className="text-2xl font-bold text-green-400 font-mono">
            {formatNumber(analytics.totalTransactions)}
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-green-400/10 border-2 border-green-400/30 rounded-xl p-6 hover:border-green-400/50 transition-all duration-300">
          <div className="flex items-center mb-3">
            <Users className="w-5 h-5 text-green-400 mr-2" />
            <h3 className="text-sm font-medium text-green-300 font-mono">Active Users</h3>
          </div>
          <div className="text-2xl font-bold text-green-400 font-mono">
            {formatNumber(analytics.totalUsers)}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-400/10 border-2 border-green-400/30 rounded-xl p-6 hover:border-green-400/50 transition-all duration-300">
          <div className="flex items-center mb-3">
            <Link className="w-5 h-5 text-green-400 mr-2" />
            <h3 className="text-sm font-medium text-green-300 font-mono">Payment Links</h3>
          </div>
          <div className="text-xl font-bold text-green-400 mb-1 font-mono">
            {formatNumber(analytics.totalPaymentLinks.count)}
          </div>
          <div className="text-sm text-green-300 font-mono">
            {formatTokenAmount(analytics.totalPaymentLinks.totalAmount.xfi, 2)} XFI total
          </div>
        </div>

        <div className="bg-green-400/10 border-2 border-green-400/30 rounded-xl p-6 hover:border-green-400/50 transition-all duration-300">
          <div className="flex items-center mb-3">
            <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
            <h3 className="text-sm font-medium text-green-300 font-mono">DCA Orders</h3>
          </div>
          <div className="text-xl font-bold text-green-400 mb-1 font-mono">
            {formatNumber(analytics.totalDCAOrders.count)}
          </div>
          <div className="text-sm text-green-300 font-mono">
            {formatTokenAmount(analytics.totalDCAOrders.totalVolume.xfi, 2)} XFI total
          </div>
        </div>
      </div> */}

      {/* Last Updated */}
      {/* <div className="text-center mt-8 text-xs text-green-300 font-mono">
        Last updated: {new Date().toLocaleString()}
      </div> */}
    </div>
  );
}; 