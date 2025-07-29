import { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { createWalletClient, custom, parseEther } from 'viem';
import { createPublicClient, http, formatEther } from 'viem';
import { crossfiMainnet } from '../config/viem';
import { PAYMENT_LINK_CONTRACT_ADDRESS, EXPLORER_URL } from '../utils/constants';

// Payment Link Contract ABI (for transactions and reading)
const PAYMENT_LINK_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "linkID", "type": "string"}
    ],
    "name": "contributeToGlobalPaymentLink",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "globalPaymentLink",
    "outputs": [
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "link",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "totalContributions",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const useGlobalPaymentLink = () => {
  const [loading, setLoading] = useState(false);
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();

  // Create public client for reading contract data
  const publicClient = createPublicClient({
    chain: crossfiMainnet,
    transport: http(),
  });

  const getGlobalPaymentLinkDetails = async (linkId: string) => {
    try {
      console.log(`🔍 Fetching global payment link details for: ${linkId}`);

      const globalLinkData = await publicClient.readContract({
        address: PAYMENT_LINK_CONTRACT_ADDRESS as `0x${string}`,
        abi: PAYMENT_LINK_ABI,
        functionName: 'globalPaymentLink',
        args: [linkId],
      });

      console.log('📊 Raw global link data:', globalLinkData);

      // Handle array return format
      const [creator, link, totalContributions] = globalLinkData as [string, string, bigint];

      if (creator && creator !== '0x0000000000000000000000000000000000000000') {
        console.log('✅ Found Global Payment Link!');
        
        const paymentLinkDetails = {
          linkId: link,
          creator: creator,
          totalContributions: formatEther(totalContributions),
          totalContributionsInXFI: parseFloat(formatEther(totalContributions)),
          exists: true,
          isGlobal: true
        };

        console.log('📋 Global Payment Link Details:', paymentLinkDetails);

        return {
          success: true,
          data: paymentLinkDetails
        };
      } else {
        console.log('❌ Global payment link not found (creator is zero address)');
        return {
          success: false,
          error: 'Global payment link not found'
        };
      }

    } catch (error: any) {
      console.error('Error fetching global payment link details:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch global payment link details'
      };
    }
  };

  const contributeToGlobalPaymentLink = async (linkId: string, amount: number) => {
    if (!authenticated || !wallets || wallets.length === 0) {
      return { success: false, error: 'Wallet not connected' };
    }

    setLoading(true);

    try {
      const wallet = wallets[0];

      // Get the provider from the wallet
      const provider = await wallet.getEthereumProvider();
      
      // Create wallet client using custom provider
      const walletClient = createWalletClient({
        account: wallet.address as `0x${string}`,
        chain: crossfiMainnet,
        transport: custom(provider),
      });

      const hash = await walletClient.writeContract({
        address: PAYMENT_LINK_CONTRACT_ADDRESS as `0x${string}`,
        abi: PAYMENT_LINK_ABI,
        functionName: 'contributeToGlobalPaymentLink',
        args: [linkId],
        value: parseEther(amount.toString()),
        account: wallet.address as `0x${string}`,
      });

      return {
        success: true,
        transactionHash: hash,
        explorerUrl: `${EXPLORER_URL}/tx/${hash}`,
      };
    } catch (error: any) {
      console.error('Contribution error:', error);
      return {
        success: false,
        error: error.message || 'Contribution failed',
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    contributeToGlobalPaymentLink,
    getGlobalPaymentLinkDetails,
    loading,
  };
}; 