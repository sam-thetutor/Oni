import React from 'react';
import { Wallet, TrendingUp, Eye, Copy, Check } from 'lucide-react';
import { Wallet as WalletType } from '../types/wallet';

interface WalletOverviewProps {
  wallet: WalletType;
}

export const WalletOverview: React.FC<WalletOverviewProps> = ({ wallet }) => {
  const [copiedAddress, setCopiedAddress] = React.useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const totalValue = Object.values(wallet.balance).reduce((sum, value) => sum + value * 1000, 0); // Mock USD values

  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', balance: wallet.balance.eth, value: wallet.balance.eth * 2000, change: '+5.2%' },
    { symbol: 'USDC', name: 'USD Coin', balance: wallet.balance.usdc, value: wallet.balance.usdc * 1, change: '+0.1%' },
    { symbol: 'USDT', name: 'Tether', balance: wallet.balance.usdt, value: wallet.balance.usdt * 1, change: '-0.05%' },
  ];

  return (
    <div className="space-y-6">
      {/* Wallet Address Card */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Wallet Address</h2>
          <Wallet className="w-5 h-5 text-purple-400" />
        </div>
        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
          <span className="text-gray-300 font-mono text-sm">
            {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
          </span>
          <button
            onClick={copyAddress}
            className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition-colors"
          >
            {copiedAddress ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Portfolio</h2>
          <TrendingUp className="w-5 h-5 text-green-400" />
        </div>
        
        <div className="mb-6">
          <div className="text-3xl font-bold text-white mb-1">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-green-400 text-sm font-medium">+12.5% (24h)</div>
        </div>

        <div className="space-y-4">
          {tokens.map((token) => (
            <div key={token.symbol} className="bg-gray-800/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {token.symbol[0]}
                  </div>
                  <div>
                    <div className="text-white font-medium">{token.symbol}</div>
                    <div className="text-gray-400 text-sm">{token.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">
                    {token.balance.toFixed(4)}
                  </div>
                  <div className="text-gray-400 text-sm">
                    ${token.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-medium ${
                  token.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {token.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">47</div>
            <div className="text-gray-400 text-sm">Total Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">$127.45</div>
            <div className="text-gray-400 text-sm">Gas Fees Paid</div>
          </div>
        </div>
      </div>
    </div>
  );
};