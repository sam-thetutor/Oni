import React, { useState } from 'react';
import { Copy, Check, Wallet, RefreshCw } from 'lucide-react';
import { useWalletBalance } from '../hooks/useWalletBalance';

interface PortfolioProps {
  walletAddress: string;
}

export const Portfolio: React.FC<PortfolioProps> = ({ walletAddress }) => {
  const { xfi, mpx, tUSDC, isLoading, error, refreshBalances } = useWalletBalance(walletAddress);
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: number) => {
    return balance.toFixed(6);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Portfolio Overview</h3>
        <button
          onClick={refreshBalances}
          disabled={isLoading}
          className="flex items-center space-x-2 px-3 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="text-sm">Refresh</span>
        </button>
      </div>

      {/* Wallet Address Card */}
      <div className="bg-white/5 rounded-lg border border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Backend Wallet Address</h4>
            <div className="flex items-center space-x-3">
              <Wallet className="w-5 h-5 text-purple-400" />
              <span className="font-mono text-white text-lg">{formatAddress(walletAddress)}</span>
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(walletAddress)}
            className="flex items-center space-x-2 px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            {copySuccess ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="text-sm">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Balances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* XFI Balance */}
        <div className="bg-white/5 rounded-lg border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-400">XFI Balance</h4>
            <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <span className="text-yellow-400 font-bold text-sm">X</span>
            </div>
          </div>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-600/20 rounded mb-2"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 text-sm">Error loading balance</div>
          ) : (
            <div className="text-2xl font-bold text-yellow-400">
              {formatBalance(xfi)} XFI
            </div>
          )}
        </div>

        {/* MPX Balance */}
        <div className="bg-white/5 rounded-lg border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-400">MPX Balance</h4>
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-blue-400 font-bold text-sm">M</span>
            </div>
          </div>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-600/20 rounded mb-2"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 text-sm">Error loading balance</div>
          ) : (
            <div className="text-2xl font-bold text-blue-400">
              {formatBalance(mpx)} MPX
            </div>
          )}
        </div>

        {/* tUSDC Balance */}
        <div className="bg-white/5 rounded-lg border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-400">tUSDC Balance</h4>
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-green-400 font-bold text-sm">$</span>
            </div>
          </div>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-600/20 rounded mb-2"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 text-sm">Error loading balance</div>
          ) : (
            <div className="text-2xl font-bold text-green-400">
              {formatBalance(tUSDC)} tUSDC
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
            <span className="text-gray-400 text-sm">Loading balances...</span>
          </div>
        </div>
      )}
    </div>
  );
}; 