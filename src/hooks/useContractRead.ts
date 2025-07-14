import { useState } from 'react';
import { createPublicClient, http } from 'viem';
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
    "name": "fixedinkIDExist",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
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

// Status enum mapping
const STATUS_MAPPING: { [key: number]: string } = {
  0: 'active',
  1: 'paid',
  2: 'cancelled'
};

interface PaymentLinkContractData {
  creator: string;
  link: string;
  amount: bigint;
  status: number;
}

interface PaymentLinkStatus {
  success: boolean;
  data?: {
    linkId: string;
    creator: string;
    amount: string;
    amountInXFI: number;
    status: string;
    statusCode: number;
    exists: boolean;
  };
  error?: string;
}

export const useContractRead = () => {
  const [loading, setLoading] = useState(false);

  // Create public client for reading contract data
  const publicClient = createPublicClient({
    chain: crossfiTestnet,
    transport: http()
  });

  const checkPaymentLinkStatus = async (linkId: string): Promise<PaymentLinkStatus> => {
    setLoading(true);
    
    try {
      console.log('Checking payment link status for:', linkId);

      // First check if the payment link exists
      const exists = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'fixedinkIDExist',
        args: [linkId],
      }) as boolean;

      if (!exists) {
        return {
          success: false,
          error: 'Payment link does not exist'
        };
      }

      // Get payment link details
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'fixedPaymentLink',
        args: [linkId],
      }) as PaymentLinkContractData;

      // Convert amount from Wei to XFI
      const amountInXFI = Number(result.amount) / Math.pow(10, 18);

      return {
        success: true,
        data: {
          linkId: linkId,
          creator: result.creator,
          amount: result.amount.toString(),
          amountInXFI: amountInXFI,
          status: STATUS_MAPPING[result.status] || 'unknown',
          statusCode: result.status,
          exists: true
        }
      };

    } catch (error: any) {
      console.error('Error checking payment link status:', error);
      
      let errorMessage = 'Failed to check payment link status';
      
      if (error.message?.includes('execution reverted')) {
        errorMessage = 'Payment link not found or invalid';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Network error - please try again';
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

  const checkGlobalPaymentLinkStatus = async (linkId: string) => {
    setLoading(true);
    
    try {
      console.log('Checking global payment link status for:', linkId);

      // Get global payment link details
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'globalPaymentLink',
        args: [linkId],
      }) as {
        creator: string;
        link: string;
        totalContributions: bigint;
      };

      // Convert total contributions from Wei to XFI
      const totalContributionsInXFI = Number(result.totalContributions) / Math.pow(10, 18);

      return {
        success: true,
        data: {
          linkId: linkId,
          creator: result.creator,
          totalContributions: result.totalContributions.toString(),
          totalContributionsInXFI: totalContributionsInXFI,
          type: 'global'
        }
      };

    } catch (error: any) {
      console.error('Error checking global payment link status:', error);
      
      return {
        success: false,
        error: 'Failed to check global payment link status'
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    checkPaymentLinkStatus,
    checkGlobalPaymentLinkStatus,
    loading
  };
}; 