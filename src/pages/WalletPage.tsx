import React from 'react';
import { Header } from '../components/Header';
import { WalletOverview } from '../components/WalletOverview';
import { TransactionHistory } from '../components/TransactionHistory';
import { QuickActions } from '../components/QuickActions';
import { useBackendWallet } from '../hooks/useBackendWallet';
import { Wallet } from 'lucide-react';

export const WalletPage = () => {
  const { backendWallet, loading } = useBackendWallet();
  const [activeTab, setActiveTab] = React.useState<'overview' | 'history' | 'actions'>('overview');

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Wallet Overview */}
          <div className="lg:col-span-1">
            <WalletOverview walletAddress={backendWallet} />
          </div>

          {/* Right Column - Main Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
              <div className="flex border-b border-white/10">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-all ${
                    activeTab === 'overview'
                      ? 'text-white border-b-2 border-purple-500 bg-purple-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Wallet className="w-4 h-4" />
                    <span>Portfolio</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-all ${
                    activeTab === 'history'
                      ? 'text-white border-b-2 border-purple-500 bg-purple-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Transaction History
                </button>
                <button
                  onClick={() => setActiveTab('actions')}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-all ${
                    activeTab === 'actions'
                      ? 'text-white border-b-2 border-purple-500 bg-purple-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Quick Actions
                </button>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <Wallet className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-400">Loading Oni wallet...</p>
                  </div>
                ) : activeTab === 'overview' ? (
                  <div className="text-center py-8">
                    <Wallet className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Wallet Overview</h3>
                    <p className="text-gray-400">
                      Your Oni wallet information is displayed in the left panel. Use the tabs above to view transaction history or perform quick actions.
                    </p>
                  </div>
                ) : activeTab === 'history' ? (
                  backendWallet ? (
                    <TransactionHistory walletAddress={backendWallet} />
                  ) : (
                    <div className="text-center py-8">
                      <Wallet className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-pulse" />
                      <p className="text-gray-400">Loading Oni wallet...</p>
                    </div>
                  )
                ) : (
                  <QuickActions />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 