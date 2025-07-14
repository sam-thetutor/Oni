import React from 'react';
import { useBackendWallet } from '../hooks/useBackendWallet';
import { useWalletBalance } from '../hooks/useWalletBalance';
import { WalletConnection } from './WalletConnection';

interface WalletOverviewProps {
  walletAddress?: string;
}

export const WalletOverview: React.FC<WalletOverviewProps> = ({ walletAddress }) => {
  // If walletAddress is not provided, get it from backend
  const { backendWallet, loading: walletLoading } = useBackendWallet();
  console.log(backendWallet);
  const address = walletAddress || backendWallet;

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p w-full max-w-2xl mx-auto">
      <WalletConnection onConnect={() => {}} />
     
        {/* Add any wallet actions here, e.g., send/receive buttons */}
        
    </div>
  );
};
