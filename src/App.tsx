import React, { useState } from 'react';
import { WalletConnection } from './components/WalletConnection';
import { Dashboard } from './components/Dashboard';
import { Wallet } from './types/wallet';
import { BackendProvider } from './context/BackendContext';

function App() {
  const [wallet, setWallet] = useState<Wallet | null>(null);

  const handleWalletConnect = (walletData: Wallet) => {
    setWallet(walletData);
  };

  const handleDisconnect = () => {
    setWallet(null);
  };

  return (
    <BackendProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        {!wallet ? (
          <WalletConnection onConnect={handleWalletConnect} />
        ) : (
          <Dashboard wallet={wallet} onDisconnect={handleDisconnect} />
        )}
      </div>
    </BackendProvider>
  );
}

export default App;