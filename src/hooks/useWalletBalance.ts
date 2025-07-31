import { useState, useEffect, useCallback } from 'react';
import { useBackend } from './useBackend';
import { useWallets } from '@privy-io/react-auth';
import { BACKEND_URL, EXPLORER_URL, ENVIRONMENT } from '../utils/constants';

interface WalletBalances {
  xfi: number;
  mpx: number;
  usdt: number;
  usdc: number;
  isLoading: boolean;
  error: string | null;
}

export const useWalletBalance = (address: string | null): WalletBalances & { refreshBalances: () => Promise<void> } => {
  const [balances, setBalances] = useState<{ xfi: number; mpx: number; usdt: number; usdc: number }>({ 
    xfi: 0, 
    mpx: 0, 
    usdt: 0, 
    usdc: 0 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authFetch } = useBackend();
  const { wallets } = useWallets();

  const fetchBalances = useCallback(async () => {
    // Clear balances immediately if no wallet is connected
    if (!address || !wallets || wallets.length === 0) {
      setBalances({ xfi: 0, mpx: 0, usdt: 0, usdc: 0 });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`🔍 Frontend Balance Debug:`);
      console.log(`  - Environment: ${ENVIRONMENT}`);
      console.log(`  - Explorer URL: ${EXPLORER_URL}`);
      console.log(`  - Address: ${address}`);
      console.log(`  - Raw VITE_ENVIRONMENT: ${import.meta.env.VITE_ENVIRONMENT}`);
      console.log(`  - Raw VITE_EXPLORER_URL: ${import.meta.env.VITE_EXPLORER_URL}`);

      const apiUrl = `${EXPLORER_URL}/api/1.0/addresses/${address}`;
      console.log(`  - Full API URL: ${apiUrl}`);

      // Get XFI and MPX from CrossFi API, and token balances from backend
      const [crossfiResponse, tokenBalancesResponse] = await Promise.all([
        fetch(apiUrl),
        authFetch(`${BACKEND_URL}/api/dca/balances`)
      ]);
      
      console.log(`  - CrossFi API Response Status: ${crossfiResponse.status}`);
      
      if (!crossfiResponse.ok) {
        throw new Error(`Failed to fetch balance: ${crossfiResponse.status}`);
      }

      const crossfiData = await crossfiResponse.json();
      console.log('CrossFi API response:', crossfiData);

      // Extract XFI and MPX balances from holdCoins
      const xfiBalance = crossfiData.holdCoins?.xfi || '0';
      const mpxBalance = crossfiData.holdCoins?.mpx || '0';
      
      // Convert from wei to tokens (assuming 18 decimals like Ethereum)
      const balanceInXFI = parseFloat(xfiBalance) / Math.pow(10, 18);
      const balanceInMPX = parseFloat(mpxBalance) / Math.pow(10, 18);

      console.log(`  - Raw XFI Balance (wei): ${xfiBalance}`);
      console.log(`  - Raw MPX Balance (wei): ${mpxBalance}`);
      console.log(`  - XFI Balance: ${balanceInXFI}`);
      console.log(`  - MPX Balance: ${balanceInMPX}`);

      // Get token balances from backend
      let usdtBalance = 0;
      let usdcBalance = 0;
      try {
        const tokenBalancesData = await tokenBalancesResponse.json();
        console.log('Token balances response:', tokenBalancesData);
        
        if (tokenBalancesData.success && tokenBalancesData.data) {
          // Find USDT and USDC balances
          const usdtToken = tokenBalancesData.data.find((token: any) => token.symbol === 'USDT');
          const usdcToken = tokenBalancesData.data.find((token: any) => token.symbol === 'USDC');
          
          if (usdtToken) {
            usdtBalance = parseFloat(usdtToken.formatted);
            console.log(`  - USDT Balance: ${usdtBalance}`);
          }
          
          if (usdcToken) {
            usdcBalance = parseFloat(usdcToken.formatted);
            console.log(`  - USDC Balance: ${usdcBalance}`);
          }
        }
      } catch (tokenError) {
        console.error('Error getting token balances:', tokenError);
        // Continue with 0 balances for tokens if there's an error
      }
      
      setBalances({ 
        xfi: balanceInXFI, 
        mpx: balanceInMPX, 
        usdt: usdtBalance, 
        usdc: usdcBalance 
      });
    } catch (err) {
      console.error('Error getting balances:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch balances');
      setBalances({ xfi: 0, mpx: 0, usdt: 0, usdc: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [address, authFetch]);

  const refreshBalances = useCallback(async () => {
    await fetchBalances();
  }, [fetchBalances]);

  // Fetch balances when address changes or wallets change
  useEffect(() => {
    console.log('🔄 useWalletBalance: Address or wallets changed', { address, walletsCount: wallets?.length });
    fetchBalances();
  }, [fetchBalances, address, wallets]);

  return {
    xfi: balances.xfi,
    mpx: balances.mpx,
    usdt: balances.usdt,
    usdc: balances.usdc,
    isLoading,
    error,
    refreshBalances,
  };
}; 