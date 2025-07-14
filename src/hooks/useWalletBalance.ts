import { useState, useEffect, useCallback } from 'react';
import { useBackend } from './useBackend';
import { BACKEND_URL } from '../utils/constants';
interface WalletBalances {
  xfi: number;
  mpx: number;
  tUSDC: number;
  isLoading: boolean;
  error: string | null;
}

export const useWalletBalance = (address: string | null): WalletBalances & { refreshBalances: () => Promise<void> } => {
  const [balances, setBalances] = useState<{ xfi: number; mpx: number; tUSDC: number }>({ xfi: 0, mpx: 0, tUSDC: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authFetch } = useBackend();

  const fetchBalances = useCallback(async () => {
    if (!address) {
      setBalances({ xfi: 0, mpx: 0, tUSDC: 0 });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get XFI and MPX from CrossFi API
      const [crossfiResponse, tUSDCBalances] = await Promise.all([
        fetch(`https://test.xfiscan.com/api/1.0/addresses/${address}`),
        authFetch(`${BACKEND_URL}/api/dca/balances`)
      ]);
      
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

      // Get tUSDC balance from backend
      let tUSDCBalance = 0;
      try {
        const tUSDCData = await tUSDCBalances.json();
        if (tUSDCData.success && tUSDCData.data) {
          const tUSDCToken = tUSDCData.data.find((token: any) => token.symbol === 'tUSDC');
          if (tUSDCToken) {
            tUSDCBalance = parseFloat(tUSDCToken.formatted);
          }
        }
      } catch (tUSDCError) {
        console.error('Error getting tUSDC balance:', tUSDCError);
        // Continue with 0 balance for tUSDC if there's an error
      }
      
      setBalances({ xfi: balanceInXFI, mpx: balanceInMPX, tUSDC: tUSDCBalance });
    } catch (err) {
      console.error('Error getting balances:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch balances');
      setBalances({ xfi: 0, mpx: 0, tUSDC: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [address, authFetch]);

  const refreshBalances = useCallback(async () => {
    await fetchBalances();
  }, [fetchBalances]);

  // Fetch balances when address changes
  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  return {
    xfi: balances.xfi,
    mpx: balances.mpx,
    tUSDC: balances.tUSDC,
    isLoading,
    error,
    refreshBalances,
  };
}; 