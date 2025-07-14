import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../utils/constants';


interface BackendWalletResponse {
  walletAddress: string;
}




export function useBackendWallet() {
  const [backendWallet, setBackendWallet] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, authenticated, getAccessToken } = usePrivy();




  useEffect(() => {
    async function fetchWallet() {
      setLoading(true);

      try {
        if (!authenticated || !user) {
          throw new Error('User must be authenticated to access the API');
        }
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
  }, [authenticated, user, getAccessToken]);

  return { backendWallet, loading };
} 