import { useState, useEffect } from 'react';
import { createPublicClient, http } from 'viem';
import { crossfiMainnet, publicClient } from '../config/viem';
import { PAYMENT_LINK_CONTRACT_ADDRESS } from '../utils/constants';

// Payment Link Contract ABI (simplified for reading)
const PAYMENT_LINK_ABI = [
  {
    "inputs": [{"internalType": "string", "name": "", "type": "string"}],
    "name": "fixedPaymentLink",
    "outputs": [
      {"internalType": "address", "name": "creator", "type": "address"},
      {"internalType": "string", "name": "link", "type": "string"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "enum PayLink.statusEnum", "name": "status", "type": "uint8"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "", "type": "string"}],
    "name": "globalPaymentLink",
    "outputs": [
      {"internalType": "address", "name": "creator", "type": "address"},
      {"internalType": "uint256", "name": "totalContributions", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const useContractRead = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readFixedPaymentLink = async (linkId: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await publicClient.readContract({
        address: PAYMENT_LINK_CONTRACT_ADDRESS as `0x${string}`,
        abi: PAYMENT_LINK_ABI,
        functionName: 'fixedPaymentLink',
        args: [linkId],
      });

      return {
        success: true,
        data: result,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to read contract';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const readGlobalPaymentLink = async (linkId: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await publicClient.readContract({
        address: PAYMENT_LINK_CONTRACT_ADDRESS as `0x${string}`,
        abi: PAYMENT_LINK_ABI,
        functionName: 'globalPaymentLink',
        args: [linkId],
      });

      return {
        success: true,
        data: result,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to read contract';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    readFixedPaymentLink,
    readGlobalPaymentLink,
    loading,
    error,
  };
}; 