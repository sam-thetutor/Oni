import { useState, useEffect, useCallback } from 'react';

interface WalletBalances {
  xfi: number;
  mpx: number;
  isLoading: boolean;
  error: string | null;
}

export const useWalletBalance = (address: string | null): WalletBalances & { refreshBalances: () => Promise<void> } => {
  const [balances, setBalances] = useState<{ xfi: number; mpx: number }>({ xfi: 0, mpx: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = useCallback(async () => {
    if (!address) {
      setBalances({ xfi: 0, mpx: 0 });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call CrossFi API to get balance
      const response = await fetch(`https://test.xfiscan.com/api/1.0/addresses/${address}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch balance: ${response.status}`);
      }

      const data = await response.json();
      console.log('CrossFi API response:', data);

      // Extract XFI and MPX balances from holdCoins
      const xfiBalance = data.holdCoins?.xfi || '0';
      const mpxBalance = data.holdCoins?.mpx || '0';
      
      // Convert from wei to tokens (assuming 18 decimals like Ethereum)
      const balanceInXFI = parseFloat(xfiBalance) / Math.pow(10, 18);
      const balanceInMPX = parseFloat(mpxBalance) / Math.pow(10, 18);
      
      setBalances({ xfi: balanceInXFI, mpx: balanceInMPX });
    } catch (err) {
      console.error('Error getting balance from CrossFi API:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch balances');
      setBalances({ xfi: 0, mpx: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [address]);

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
    isLoading,
    error,
    refreshBalances,
  };
}; 