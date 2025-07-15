import React, { useEffect } from 'react';
import { useBackendWallet } from '../hooks/useBackendWallet';
import { useWalletBalance } from '../hooks/useWalletBalance';
import { useRealTimeWallet } from '../hooks/useRealTimeWallet';
import { useRefresh } from '../context/RefreshContext';
import { WalletConnection } from './WalletConnection';
import { RefreshCw } from 'lucide-react';

interface WalletOverviewProps {
  walletAddress?: string;
}

export const WalletOverview: React.FC<WalletOverviewProps> = ({ walletAddress }) => {
  // If walletAddress is not provided, get it from backend
  const { backendWallet, loading: walletLoading } = useBackendWallet();
  const address = walletAddress || backendWallet;
  const { balance, isUpdating, isConnected, refreshBalance } = useRealTimeWallet();
  const { xfi: fallbackBalance, isLoading: balanceLoading, refreshBalances: refetchBalance } = useWalletBalance(address);
  const { onWalletRefresh } = useRefresh();
  
  console.log(backendWallet);

  // Use real-time balance if available, otherwise fall back to API balance
  const currentBalance = balance ? balance.formatted : fallbackBalance?.toString();
  const isLoading = balanceLoading || isUpdating;
  
  // Debug logging
  console.log('🔍 WalletOverview Debug:', {
    realTimeBalance: balance,
    fallbackBalance,
    currentBalance,
    isLoading,
    isConnected
  });

  // Register refresh function with global context
  useEffect(() => {
    onWalletRefresh(() => {
      console.log('🔄 WalletOverview: Refreshing balance...');
      refetchBalance();
    });
  }, [onWalletRefresh, refetchBalance]);

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Wallet Overview</h2>
        <div className="flex items-center space-x-2">
          {isConnected && (
            <div className="flex items-center space-x-1 text-green-400 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          )}
          <button
            onClick={refreshBalance}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            title="Refresh balance"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={refreshBalance}
            className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
            title="Test WebSocket"
          >
            Test WS
          </button>
        </div>
      </div>

      <WalletConnection onConnect={() => {}} />
      
      {/* Real-time Balance Display */}
      {currentBalance && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Balance:</span>
            <div className="text-right">
              <div className="text-white font-mono text-lg">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-600 h-6 w-24 rounded"></div>
                ) : (
                  `${currentBalance} XFI`
                )}
              </div>
              {balance && (
                <div className="text-xs text-green-400 mt-1">
                  Real-time • {new Date(balance.timestamp).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
