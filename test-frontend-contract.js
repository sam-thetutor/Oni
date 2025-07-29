import { createPublicClient, http, formatEther } from 'viem';
import { defineChain } from 'viem';

// Define CrossFI mainnet chain
const crossfiMainnet = defineChain({
  id: 4158,
  name: 'CrossFI Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'XFI',
    symbol: 'XFI',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.mainnet.ms'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://xfiscan.com' },
  },
});

// Payment Link Contract ABI (same as frontend)
const PAYMENT_LINK_ABI = [
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

// Contract address
const CONTRACT_ADDRESS = '0x8Ceb24694b8d3965Bd7224652B15B2A4f65Bd130';

// Test the same logic as the frontend
async function testFrontendContractLogic() {
  console.log('🧪 Testing Frontend Contract Integration\n');

  try {
    // Create public client
    const publicClient = createPublicClient({
      chain: crossfiMainnet,
      transport: http(),
    });

    const linkId = 'FYWvch8ypl';

    console.log(`🔍 Testing payment link: ${linkId}\n`);

    // Test fixed payment link (same logic as frontend)
    try {
      const fixedLinkData = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: PAYMENT_LINK_ABI,
        functionName: 'fixedPaymentLink',
        args: [linkId],
      });

      console.log('📊 Raw fixed link data:', fixedLinkData);

      // Handle array return format (same as frontend)
      const [creator, link, amount, status] = fixedLinkData;

      if (creator && creator !== '0x0000000000000000000000000000000000000000') {
        console.log('✅ Found as Fixed Payment Link!');
        
        const paymentLinkDetails = {
          linkId: link,
          amount: parseFloat(formatEther(amount)),
          status: status === 1 ? 'paid' : status === 0 ? 'pending' : 'cancelled',
          isPaid: status === 1,
          creator: creator,
          isGlobal: false,
          createdAt: new Date().toISOString()
        };

        console.log('📋 Frontend-style Payment Link Details:');
        console.log(JSON.stringify(paymentLinkDetails, null, 2));

        // Test the button logic
        if (paymentLinkDetails.isPaid) {
          console.log('\n🔴 Pay button should be DISABLED (already paid)');
        } else {
          console.log('\n🟢 Pay button should be ENABLED (not paid yet)');
        }

      } else {
        console.log('❌ Fixed payment link not found');
      }
    } catch (error) {
      console.log('❌ Error checking fixed payment link:', error.message);
    }

  } catch (error) {
    console.error('❌ Error in test:', error);
  }
}

testFrontendContractLogic(); 