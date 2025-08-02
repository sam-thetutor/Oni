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
  const { 
    xfi: fallbackBalance, 
    usdt: usdtBalance, 
    usdc: usdcBalance,
    isLoading: balanceLoading, 
    refreshBalances: refetchBalance 
  } = useWalletBalance(address);
  const { onWalletRefresh } = useRefresh();
  
  // Force refresh when address changes
  useEffect(() => {
    if (address) {
      refetchBalance();
    }
  }, [address, refetchBalance]);
  
  console.log(backendWallet);

  // Use real-time balance if available, otherwise fall back to API balance
  const currentBalance = balance ? balance.formatted : fallbackBalance?.toString();
  const isLoading = balanceLoading || isUpdating;
  
  // Debug logging
  console.log('🔍 WalletOverview Debug:', {
    realTimeBalance: balance,
    fallbackBalance,
    currentBalance,
    usdtBalance,
    usdcBalance,
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

      <WalletConnection />
      
      {/* Token Balances Display */}
      {address && (
        <div className="mt-4 space-y-3">
          {/* XFI Balance */}
          {currentBalance && (
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">XFI Balance:</span>
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

          {/* USDC Balance (Primary Stablecoin) */}
          <div className="p-4 bg-gray-800 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">USDC Balance:</span>
              <div className="text-right">
                <div className="text-white font-mono text-lg">
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-600 h-6 w-24 rounded"></div>
                  ) : (
                    `${usdcBalance.toFixed(6)} USDC`
                  )}
                </div>
                <div className="text-xs text-blue-400 mt-1">
                  Primary stablecoin
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  💡 "Swap 10 USDC to XFI" for ~133 XFI
                </div>
              </div>
            </div>
          </div>

          {/* USDT Balance (Disabled) */}
          <div className="p-4 bg-gray-800 rounded-lg opacity-50">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">USDT Balance (Disabled):</span>
              <div className="text-right">
                <div className="text-gray-500 font-mono text-lg">
                  Temporarily unavailable
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
