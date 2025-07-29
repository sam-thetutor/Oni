import { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { createWalletClient, custom, parseEther, encodeFunctionData } from 'viem';
import { createPublicClient, http, formatEther } from 'viem';
import { crossfiMainnet } from '../config/viem';
import { PAYMENT_LINK_CONTRACT_ADDRESS, EXPLORER_URL } from '../utils/constants';

// Payment Link Contract ABI (for transactions and reading)
const PAYMENT_LINK_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "linkID", "type": "string"}
    ],
    "name": "payFixedPaymentLink",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
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
    "name": "fixedPaymentLink",
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
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "enum PayLink.statusEnum",
        "name": "status",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
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

export const useContractPayment = () => {
  const [loading, setLoading] = useState(false);
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();

  // Create public client for reading contract data
  const publicClient = createPublicClient({
    chain: crossfiMainnet,
    transport: http(),
  });

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return 'pending';
      case 1:
        return 'paid';
      case 2:
        return 'cancelled';
      default:
        return 'unknown';
    }
  };

  const getPaymentLinkDetails = async (linkId: string) => {
    try {
      console.log(`🔍 Fetching payment link details for: ${linkId}`);

      // Try to fetch as fixed payment link first
      try {
        const fixedLinkData = await publicClient.readContract({
          address: PAYMENT_LINK_CONTRACT_ADDRESS as `0x${string}`,
          abi: PAYMENT_LINK_ABI,
          functionName: 'fixedPaymentLink',
          args: [linkId],
        });

        console.log('📊 Raw fixed link data:', fixedLinkData);

        // Handle array return format
        const [creator, link, amount, status] = fixedLinkData as [string, string, bigint, number];

        if (creator && creator !== '0x0000000000000000000000000000000000000000') {
          console.log('✅ Found as Fixed Payment Link!');
          
          const paymentLinkDetails = {
            linkId: link,
            amount: parseFloat(formatEther(amount)),
            status: getStatusText(status),
            isPaid: status === 1,
            creator: creator,
            isGlobal: false,
            createdAt: new Date().toISOString() // Contract doesn't store creation date
          };

          console.log('📋 Payment Link Details:', paymentLinkDetails);

          return {
            success: true,
            data: paymentLinkDetails
          };
        }
      } catch (error) {
        console.log('❌ Not a fixed payment link or error occurred:', error);
      }

      // Try to fetch as global payment link
      try {
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
          console.log('✅ Found as Global Payment Link!');
          
          const paymentLinkDetails = {
            linkId: link,
            amount: 0, // Global links don't have fixed amounts
            status: 'active', // Global links are always active
            isPaid: false, // Global links are never "paid" in the traditional sense
            creator: creator,
            isGlobal: true,
            totalContributions: parseFloat(formatEther(totalContributions)),
            createdAt: new Date().toISOString() // Contract doesn't store creation date
          };

          console.log('📋 Payment Link Details:', paymentLinkDetails);

          return {
            success: true,
            data: paymentLinkDetails
          };
        }
      } catch (error) {
        console.log('❌ Not a global payment link or error occurred:', error);
      }

      // If we get here, the payment link was not found
      return {
        success: false,
        error: 'Payment link not found'
      };

    } catch (error: any) {
      console.error('Error fetching payment link details:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch payment link details'
      };
    }
  };

  const payFixedPaymentLink = async (linkId: string, amount: number) => {
    if (!authenticated || !wallets || wallets.length === 0) {
      return { success: false, error: 'Wallet not connected' };
    }

    setLoading(true);

    try {
      const wallet = wallets[0];
      
      console.log('🔍 Debug - Wallet Info:', {
        address: wallet.address,
        chainId: wallet.chainId,
        walletType: wallet.walletClientType,
        authenticated
      });

      // Get the provider from the wallet
      const provider = await wallet.getEthereumProvider();
      
      // Create wallet client using custom provider
      const walletClient = createWalletClient({
        account: wallet.address as `0x${string}`,
        chain: crossfiMainnet,
        transport: custom(provider),
      });

      console.log('🔍 Debug - Transaction Details:', {
        contractAddress: PAYMENT_LINK_CONTRACT_ADDRESS,
        linkId,
        amount,
        fromAddress: wallet.address
      });

      const hash = await walletClient.writeContract({
        address: PAYMENT_LINK_CONTRACT_ADDRESS as `0x${string}`,
        abi: PAYMENT_LINK_ABI,
        functionName: 'payFixedPaymentLink',
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
      console.error('Payment error:', error);
      return {
        success: false,
        error: error.message || 'Payment failed',
      };
    } finally {
      setLoading(false);
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
    payFixedPaymentLink,
    contributeToGlobalPaymentLink,
    getPaymentLinkDetails,
    loading,
  };
}; 