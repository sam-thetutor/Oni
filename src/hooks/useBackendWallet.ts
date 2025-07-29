import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../utils/constants';


interface BackendWalletResponse {
  walletAddress: string;
}




export function useBackendWallet() {
  const [backendWallet, setBackendWallet] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, authenticated, getAccessToken } = usePrivy();
  const { wallets } = useWallets();




  useEffect(() => {
    async function fetchWallet() {
      // Clear wallet data immediately if not authenticated
      if (!authenticated || !user || !wallets || wallets.length === 0) {
        setBackendWallet(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const accessToken = await getAccessToken();
        const res = await fetch(`${BACKEND_URL}/api/user/wallet`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`  
          }
        });
        const data = await res.json();
        setBackendWallet(data.walletAddress);
      } catch (e) {
        setBackendWallet(null);
      } finally { 
        setLoading(false);
      }
    } 
    
    fetchWallet();
  }, [authenticated, user, getAccessToken, wallets]);

  // Force refresh when wallets change
  useEffect(() => {
    if (wallets && wallets.length > 0) {
      console.log('🔄 Wallets changed, refreshing backend wallet data');
      // Trigger a re-fetch by updating the dependency
      setLoading(true);
    }
  }, [wallets]);

  return { backendWallet, loading };
} 