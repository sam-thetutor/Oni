import React from 'react';
import { LogOut, Wallet, Shield, Globe } from 'lucide-react';
import { Wallet as WalletType } from '../types/wallet';

interface HeaderProps {
  wallet: WalletType;
  onDisconnect: () => void;
}

export const Header: React.FC<HeaderProps> = ({ wallet, onDisconnect }) => {
  const getChainIcon = (chain: string) => {
    switch (chain) {
      case 'ethereum':
        return '⟐';
      case 'polygon':
        return '⬟';
      case 'bsc':
        return '🟡';
      case 'arbitrum':
        return '🔵';
      default:
        return '⬢';
    }
  };

  return (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CryptoAI Agent</h1>
                <p className="text-xs text-gray-400">Intelligent Blockchain Transactions</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-white/10 rounded-full px-4 py-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getChainIcon(wallet.chain)}</span>
                <span className="text-sm font-medium text-white capitalize">{wallet.chain}</span>
              </div>
              <div className="w-px h-4 bg-white/20"></div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">
                  {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                </span>
              </div>
            </div>

            <button
              onClick={onDisconnect}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Disconnect</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};