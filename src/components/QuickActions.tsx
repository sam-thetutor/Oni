import React, { useState } from 'react';
import { Send, Download, RotateCcw, QrCode, Copy, Check } from 'lucide-react';
import { useWallets } from '@privy-io/react-auth';

export const QuickActions= () => {
  const {wallets} = useWallets();
  const wallet = wallets[0];
  const [activeAction, setActiveAction] = useState<'send' | 'receive' | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    token: wallet.chainId === 'crossfi' ? 'XFI' : 'ETH',
    toAddress: '',
    fromToken: wallet.chainId === 'crossfi' ? 'XFI' : 'ETH',
    toToken: 'USDC',
  });
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission based on activeAction
    console.log('Form submitted:', { activeAction, formData });
    setActiveAction(null);
    setFormData({ 
      amount: '', 
      token: wallet.chainId === 'crossfi' ? 'XFI' : 'ETH', 
      toAddress: '', 
      fromToken: wallet.chainId === 'crossfi' ? 'XFI' : 'ETH', 
      toToken: 'USDC' 
    });
  };

  const tokens = wallet.chainId === 'crossfi' ? ['XFI', 'USDC', 'USDT'] : ['ETH', 'USDC', 'USDT'];

  return (
    <div className="space-y-6">
      {/* Quick Action Buttons */}
      {!activeAction && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveAction('send')}
            className="group p-6 bg-gradient-to-br from-red-500/10 to-red-600/10 hover:from-red-500/20 hover:to-red-600/20 border border-red-500/20 rounded-xl transition-all duration-200 hover:shadow-lg"
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-red-500/20 rounded-full group-hover:bg-red-500/30 transition-colors">
                <Send className="w-6 h-6 text-red-400" />
              </div>
              <div className="text-center">
                <h3 className="font-medium text-white">Send Tokens</h3>
                <p className="text-sm text-gray-400">Transfer crypto to another address</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveAction('receive')}
            className="group p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 hover:from-green-500/20 hover:to-green-600/20 border border-green-500/20 rounded-xl transition-all duration-200 hover:shadow-lg"
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-green-500/20 rounded-full group-hover:bg-green-500/30 transition-colors">
                <Download className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-center">
                <h3 className="font-medium text-white">Receive Tokens</h3>
                <p className="text-sm text-gray-400">Get your wallet address & QR code</p>
              </div>
            </div>
          </button>


        </div>
      )}

      {/* Send Form */}
      {activeAction === 'send' && (
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Send Tokens</h2>
            <button
              onClick={() => setActiveAction(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Token</label>
                <select
                  value={formData.token}
                  onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                >
                  {tokens.map(token => (
                    <option key={token} value={token}>{token}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Recipient Address</label>
              <input
                type="text"
                value={formData.toAddress}
                onChange={(e) => setFormData({ ...formData, toAddress: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                placeholder="0x..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-500/50 transition-all duration-200"
            >
              Send {formData.token}
            </button>
          </form>
        </div>
      )}

      {/* Receive Form */}
      {activeAction === 'receive' && (
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Receive Tokens</h2>
            <button
              onClick={() => setActiveAction(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="text-center space-y-6">
            <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center">
              <QrCode className="w-32 h-32 text-gray-800" />
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-2">Your Wallet Address</p>
              <div className="flex items-center justify-center space-x-2 bg-gray-800/50 rounded-lg p-3">
                <span className="text-white font-mono text-sm">
                  {wallet.address.slice(0, 10)}...{wallet.address.slice(-10)}
                </span>
                <button
                  onClick={handleCopyAddress}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <p className="text-gray-400 text-sm">
              Share this address or QR code to receive tokens on {wallet.chainId}
            </p>
          </div>
        </div>
      )}


    </div>
  );
};