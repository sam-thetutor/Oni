import { useState } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { createWalletClient, custom, parseEther, formatEther } from 'viem';
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
const CONTRACT_ADDRESS = '0x03f0b9919B7A1341A17B15b2A2DA360d059Cc320'; // Your deployed contract address
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "linkID",
        "type": "string"
      }
    ],
    "name": "payFixedPaymentLink",
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
  }
];

interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export const useContractPayment = () => {
  const { wallets } = useWallets();
  const [loading, setLoading] = useState(false);

  const payFixedPaymentLink = async (
    linkId: string, 
    amountInXFI: number
  ): Promise<PaymentResult> => {
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

      console.log('Paying payment link:', {
        linkId,
        amount: amountInXFI,
        amountInWei: amountInWei.toString(),
        contractAddress: CONTRACT_ADDRESS
      });

      // Call the smart contract
      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'payFixedPaymentLink',
        args: [linkId],
        value: amountInWei,
        account: wallet.address as `0x${string}`
      });

      console.log('Transaction submitted:', hash);

      // Wait for transaction confirmation (optional - you can return immediately)
      // const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      return {
        success: true,
        transactionHash: hash
      };

    } catch (error: any) {
      console.error('Payment failed:', error);
      
      let errorMessage = 'Payment failed';
      
      // Handle specific error types
      if (error.message?.includes('User rejected')) {
        errorMessage = 'Transaction was rejected';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient balance';
      } else if (error.message?.includes('already paid')) {
        errorMessage = 'Payment link has already been paid';
      } else if (error.message?.includes('does not exist')) {
        errorMessage = 'Payment link not found';
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

  const getPaymentLinkDetails = async (linkId: string) => {
    try {
      // This would require a public client to read from the contract
      // For now, we'll rely on the backend API to get payment link details
      // In a full implementation, you could also read directly from the contract
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3030'}/api/user/wallet/paylink/${linkId}`);
      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          data: result.data
        };
      } else {
        return {
          success: false,
          error: result.error
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: 'Failed to fetch payment link details'
      };
    }
  };

  return {
    payFixedPaymentLink,
    getPaymentLinkDetails,
    loading
  };
}; 