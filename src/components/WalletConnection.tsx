import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useBackendWallet } from '../hooks/useBackendWallet';
import { CHAIN_ID } from '../utils/constants';

export const WalletConnection: React.FC = () => {
  const { login, logout, authenticated, ready, user } = usePrivy();
  const { backendWallet, loading } = useBackendWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getChainName = (chainId: number) => {
    if (chainId === CHAIN_ID) {
      return 'CrossFi';
    }
    return `Chain ${chainId}`;
  };

  if (!ready) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (isConnecting || loading || isLoggingOut) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400"></div>
        <span className="ml-2 text-green-400 font-mono">
          {isConnecting ? 'Connecting...' : isLoggingOut ? 'Disconnecting...' : 'Loading...'}
        </span>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="text-center p-4">
        <button
          onClick={handleConnect}
          className="bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 hover:text-green-300 px-6 py-2 rounded-lg font-semibold transition-all duration-200 font-mono"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Frontend Wallet */}
      {user && (
        <div className="bg-black/20 backdrop-blur-xl border border-green-400/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-400 mb-2 font-mono">Frontend Wallet</h3>
          <div className="space-y-2 text-sm font-mono">
            <div className="text-green-300">
              Address: {user.wallet?.address}
            </div>
            <div className="text-green-300">
              Chain: {getChainName(CHAIN_ID)}
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="mt-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-mono"
          >
            {isLoggingOut ? 'Disconnecting...' : 'Disconnect'}
          </button>
        </div>
      )}

      {/* Backend Wallet */}
      {backendWallet && (
        <div className="bg-black/20 backdrop-blur-xl border border-green-400/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-400 mb-2 font-mono">Backend Wallet</h3>
          <div className="space-y-2 text-sm font-mono">
            <div className="text-green-300">
              Address: {backendWallet}
            </div>
            <div className="text-green-300">
              Chain: {getChainName(CHAIN_ID)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
