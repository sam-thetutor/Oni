import React, { useState } from 'react';
import { Wallet, Shield, Key, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { Wallet as WalletType } from '../types/wallet';

interface WalletConnectionProps {
  onConnect: (wallet: WalletType) => void;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({ onConnect }) => {
  const [activeTab, setActiveTab] = useState<'seedphrase' | 'privatekey'>('seedphrase');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate wallet connection
    setTimeout(() => {
      const mockWallet: WalletType = {
        address: '0x742d35Cc6754C1532B8b5C1A4C1A5a5C4F5E5E5E',
        balance: {
          eth: 2.45,
          usdc: 1250.0,
          usdt: 500.0,
        },
        chain: 'ethereum',
        connectionType: activeTab,
      };
      
      onConnect(mockWallet);
      setIsConnecting(false);
    }, 2000);
  };

  const isValidSeedPhrase = seedPhrase.trim().split(' ').length === 12;
  const isValidPrivateKey = privateKey.length === 64 || (privateKey.startsWith('0x') && privateKey.length === 66);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">CryptoAI Agent</h1>
          <p className="text-gray-300">Connect your wallet to start intelligent crypto transactions</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
          <div className="flex mb-6 bg-gray-800/50 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('seedphrase')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'seedphrase'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Seed Phrase
            </button>
            <button
              onClick={() => setActiveTab('privatekey')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'privatekey'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Private Key
            </button>
          </div>

          {activeTab === 'seedphrase' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  12-Word Seed Phrase
                </label>
                <textarea
                  value={seedPhrase}
                  onChange={(e) => setSeedPhrase(e.target.value)}
                  placeholder="Enter your 12-word seed phrase separated by spaces..."
                  className="w-full h-24 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
                />
                <div className="mt-2 text-xs text-gray-400">
                  Words entered: {seedPhrase.trim() ? seedPhrase.trim().split(' ').length : 0}/12
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Private Key
                </label>
                <div className="relative">
                  <input
                    type={showPrivateKey ? 'text' : 'password'}
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    placeholder="Enter your private key (64 characters)..."
                    className="w-full px-4 py-3 pr-12 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPrivateKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="flex">
              <AlertTriangle className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-300">
                <strong>Security Warning:</strong> Your private keys are processed locally and never stored. 
                For production use, consider using a hardware wallet or secure key management solution.
              </div>
            </div>
          </div>

          <button
            onClick={handleConnect}
            disabled={
              isConnecting ||
              (activeTab === 'seedphrase' && !isValidSeedPhrase) ||
              (activeTab === 'privatekey' && !isValidPrivateKey)
            }
            className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isConnecting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Connecting Wallet...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Shield className="w-5 h-5 mr-2" />
                Connect Wallet
              </div>
            )}
          </button>

          <div className="mt-4 text-center text-xs text-gray-400">
            By connecting, you agree to our terms of service and privacy policy
          </div>
        </div>
      </div>
    </div>
  );
};