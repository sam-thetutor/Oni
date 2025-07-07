import { useState } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { createWalletClient, custom, parseEther, createPublicClient, http } from 'viem';
import { defineChain } from 'viem';

// Define CrossFI testnet chain
const crossfiTestnet = defineChain({
  id: 4157,
  name: 'CrossFI Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'XFI',
    symbol: 'XFI',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.ms'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://test.xfiscan.com' },
  },
});

// Contract configuration
const CONTRACT_ADDRESS = '0x03f0b9919B7A1341A17B15b2A2DA360d059Cc320';
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "linkID",
        "type": "string"
      }
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
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "globalinkIDExist",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

interface ContributionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

interface GlobalPaymentLinkData {
  linkId: string;
  creator: string;
  totalContributions: string;
  totalContributionsInXFI: number;
  exists: boolean;
}

// Create public client for reading contract data
const publicClient = createPublicClient({
  chain: crossfiTestnet,
  transport: http()
});

export const useGlobalPaymentLink = () => {
  const { wallets } = useWallets();
  const [loading, setLoading] = useState(false);

  const contributeToGlobalPaymentLink = async (
    linkId: string, 
    amountInXFI: number
  ): Promise<ContributionResult> => {
    setLoading(true);
    
    try {
      // Check if wallet is connected
      if (!wallets || wallets.length === 0) {
        throw new Error('No wallet connected');
      }

      const wallet = wallets[0];
      
      // Get the provider from the wallet
      const provider = await wallet.getEthereumProvider();
      
      // Create wallet client
      const walletClient = createWalletClient({
        chain: crossfiTestnet,
        transport: custom(provider)
      });

      // Convert amount to Wei
      const amountInWei = parseEther(amountInXFI.toString());

      console.log('Contributing to global payment link:', {
        linkId,
        amount: amountInXFI,
        amountInWei: amountInWei.toString(),
        contractAddress: CONTRACT_ADDRESS
      });

      // Call the smart contract
      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'contributeToGlobalPaymentLink',
        args: [linkId],
        value: amountInWei,
        account: wallet.address as `0x${string}`
      });

      console.log('Contribution transaction submitted:', hash);
      
      return {
        success: true,
        transactionHash: hash
      };

    } catch (error: any) {
      console.error('Contribution failed:', error);
      
      let errorMessage = 'Contribution failed';
      
      // Handle specific error types
      if (error.message?.includes('User rejected')) {
        errorMessage = 'Transaction was rejected';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient balance';
      } else if (error.message?.includes('does not exist')) {
        errorMessage = 'Global payment link not found';
      } else if (error.message?.includes('execution reverted')) {
        errorMessage = 'Transaction failed - link may not exist or contract error';
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const getGlobalPaymentLinkDetails = async (linkId: string): Promise<{
    success: boolean;
    data?: GlobalPaymentLinkData;
    error?: string;
  }> => {
    try {
      console.log('Fetching global payment link details for:', linkId);

      // First check if the global payment link exists
      const exists = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'globalinkIDExist',
        args: [linkId],
      }) as boolean;

      if (!exists) {
        return {
          success: false,
          error: 'Global payment link does not exist'
        };
      }

      // Get global payment link details from contract - returns array format
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'globalPaymentLink',
        args: [linkId],
      }) as [string, string, bigint]; // [creator, linkId, totalContributions]

      console.log('Global payment link contract response:', result);

      // Check if result is valid array
      if (!result || !Array.isArray(result) || result.length !== 3) {
        return {
          success: false,
          error: 'Invalid response from contract'
        };
      }

      const [creator, returnedLinkId, totalContributions] = result;

      // Additional validation - check if creator is zero address (means doesn't exist)
      if (!creator || creator === '0x0000000000000000000000000000000000000000') {
        return {
          success: false,
          error: 'Global payment link does not exist'
        };
      }

      // Convert total contributions from Wei to XFI
      const totalContributionsInXFI = Number(totalContributions) / Math.pow(10, 18);

      return {
        success: true,
        data: {
          linkId: linkId,
          creator: creator,
          totalContributions: totalContributions.toString(),
          totalContributionsInXFI: totalContributionsInXFI,
          exists: true
        }
      };

    } catch (error: any) {
      console.error('Error fetching global payment link details:', error);
      return {
        success: false,
        error: 'Failed to fetch global payment link details'
      };
    }
  };

  return {
    contributeToGlobalPaymentLink,
    getGlobalPaymentLinkDetails,
    loading
  };
}; 