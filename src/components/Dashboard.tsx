import React, { useState, useEffect } from 'react';
import { Wallet as WalletType } from '../types/wallet';
import { Header } from './Header';
// import { WalletOverview } from './WalletOverview';
import { AIInterface } from './AIInterface';
import { TransactionHistory } from './TransactionHistory';
import { QuickActions } from './QuickActions';
import { usePrivy, useWallets } from '@privy-io/react-auth';

interface DashboardProps {
  wallet: WalletType;
  onDisconnect: () => void;
}

export const Dashboard: React.FC<DashboardProps> = () => {
  const [activeTab, setActiveTab] = useState<'ai' | 'history' | 'actions'>('ai');
  const { wallets } = useWallets();
  const [currentWallet, setCurrentWallet] = useState<any>(null);

  useEffect(() => {
    // Get the current connected wallet from Privy
    if (wallets.length > 0) {
      setCurrentWallet(wallets[0]);
    }
  }, [wallets]);

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Wallet Overview */}
          {/* <div className="lg:col-span-1">
            <WalletOverview />
          </div> */}

          {/* Right Column - Main Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
              <div className="flex border-b border-white/10">
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-all ${
                    activeTab === 'ai'
                      ? 'text-white border-b-2 border-purple-500 bg-purple-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  AI Assistant
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
                {/* <button
                  onClick={() => setActiveTab('actions')}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-all ${
                    activeTab === 'actions'
                      ? 'text-white border-b-2 border-purple-500 bg-purple-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Quick Actions
                </button> */}
              </div>

              <div className="p-6">
                {activeTab === 'ai' && <AIInterface />}
                {activeTab === 'history' && <TransactionHistory />}
                {activeTab === 'actions' && <QuickActions />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};