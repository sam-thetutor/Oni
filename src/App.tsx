import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { WalletPage } from './pages/WalletPage';
import PayLinkPage from './pages/PayLinkPage';
import GlobalPayLinkPage from './pages/GlobalPayLinkPage';
import { BackendProvider } from './context/BackendContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { RefreshProvider } from './context/RefreshContext';
import { RealTimeNotifications } from './components/RealTimeNotifications';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Wallet as WalletType } from './types/wallet';
import ErrorPage from './components/ErrorPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { AIInterface } from './components/AIInterface';
import { Footer } from './components/Footer';
import oniLogo from './assets/logos.png';

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
      <div className="min-h-screen bg-main-gradient font-mono text-text flex items-center justify-center">
        <div className="text-center">
          <img src={oniLogo} alt="Oni" className="w-16 h-16 mx-auto mb-4" />
          <p className="text-gray-300">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <BackendProvider>
      <WebSocketProvider>
        <RefreshProvider>
          <div className="min-h-screen bg-main-gradient font-mono text-text flex flex-col">
            <div className="absolute inset-0 opacity-20"></div>
            {/* <Header /> */}
            <main className="flex-1 relative z-10">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/ai" element={<AIInterface />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/paylink/:linkId" element={<PayLinkPage />} />
              <Route path="/global-paylink/:linkId" element={<GlobalPayLinkPage />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
            </main>
            <Footer />
            <RealTimeNotifications />
          </div>
        </RefreshProvider>
      </WebSocketProvider>
    </BackendProvider>
  );
}

export default App;