import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { WalletPage } from './pages/WalletPage';
import { BackendProvider } from './context/BackendContext';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Wallet as WalletType } from './types/wallet';
import ErrorPage from './components/ErrorPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { AIInterface } from './components/AIInterface';

function App() {
  const { authenticated,user, ready } = usePrivy();
  const { wallets } = useWallets();
  const [walletData, setWalletData] = useState<WalletType | null>(null);

  // Handle wallet connection
  useEffect(() => {
    const initializeWallet = async () => {
      if (authenticated && wallets.length > 0 && ready) {
        try {
          const wallet = wallets[0]; // Get the first connected wallet
          const address = wallet.address;
          
          // Create wallet data object
          const walletInfo: WalletType = {
            address,
            balance: {
              eth: 0, // Will be updated by WalletConnection component
              usdc: 0,
              usdt: 0,
            },
            chain: 'crossfi', // Default to CrossFi
            connectionType: 'privy',
          };
          
          setWalletData(walletInfo);
        } catch (error) {
          console.error('Error initializing wallet:', error);
        }
      } else {
        setWalletData(null);
      }
    };

    initializeWallet();
  }, [authenticated, wallets, ready]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <BackendProvider>
        <div className="min-h-screen bg-main-gradient font-mono text-text">
          <div className="absolute inset-0 opacity-20"></div>
          {/* <Header /> */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/ai" element={<AIInterface />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
    </BackendProvider>
  );
}

export default App;