import { useEffect, useState } from 'react';

export function useBackendWallet() {
  const [backendWallet, setBackendWallet] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWallet() {
      setLoading(true);
      try {
        const res = await fetch('/api/contract/wallet', { credentials: 'include' });
        const data = await res.json();
        setBackendWallet(data.walletAddress);
      } catch (e) {
        setBackendWallet(null);
      } finally {
        setLoading(false);
      }
    }
    fetchWallet();
  }, []);

  return { backendWallet, loading };
} 