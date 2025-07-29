import { useEffect, useRef } from 'react';
import { useWallets } from '@privy-io/react-auth';

export const useWalletChange = (onWalletChange?: () => void) => {
  const { wallets } = useWallets();
  const previousWalletAddress = useRef<string | null>(null);

  useEffect(() => {
    const currentWalletAddress = wallets.length > 0 ? wallets[0].address : null;
    
    // Check if wallet address has changed
    if (previousWalletAddress.current !== currentWalletAddress) {
      console.log('🔄 Wallet changed:', {
        from: previousWalletAddress.current,
        to: currentWalletAddress
      });
      
      // Trigger the callback immediately for better UX
      if (onWalletChange) {
        onWalletChange();
      }
      
      // Update the ref
      previousWalletAddress.current = currentWalletAddress;
      
      // Clear any cached data and trigger refreshes
      // This allows components to handle the change gracefully
      if (currentWalletAddress) {
        console.log('🔄 New wallet connected, components should refresh automatically');
      }
    }
  }, [wallets, onWalletChange]);

  return {
    currentWalletAddress: wallets.length > 0 ? wallets[0].address : null,
    hasWallet: wallets.length > 0
  };
}; 