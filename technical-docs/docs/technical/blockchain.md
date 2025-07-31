# Blockchain Integration

## CrossFi Network

Oni operates on the CrossFi blockchain, an EVM-compatible network.

### Network Configuration

#### Testnet
- **Chain ID**: 4157
- **RPC URL**: https://rpc.testnet.ms
- **Explorer**: https://test.xfiscan.com
- **Currency**: XFI (test tokens)

#### Mainnet
- **Chain ID**: 4158
- **RPC URL**: https://rpc.mainnet.ms
- **Explorer**: https://xfiscan.com
- **Currency**: XFI

## Smart Contracts

### Payment Link Contract
```solidity
contract PaymentLink {
    struct Link {
        string linkId;
        address creator;
        uint256 amount;
        uint256 totalContributions;
        bool active;
    }
    
    mapping(string => Link) public links;
    
    function createLink(string memory linkId, uint256 amount) external;
    function contribute(string memory linkId) external payable;
    function withdraw(string memory linkId) external;
}
```

### DCA Trading Contract
```solidity
contract DCATrading {
    struct Order {
        address user;
        uint256 amount;
        uint256 frequency;
        uint256 lastExecution;
        bool active;
    }
    
    mapping(address => Order[]) public userOrders;
    
    function createOrder(uint256 amount, uint256 frequency) external;
    function executeOrder(uint256 orderId) external;
    function pauseOrder(uint256 orderId) external;
}
```

## Wallet Management

### Wallet Generation
```javascript
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

const privateKey = generatePrivateKey();
const account = privateKeyToAccount(privateKey);
```

### Transaction Signing
```javascript
import { signTransaction } from 'viem';

const signature = await signTransaction({
  account: walletAddress,
  transaction: transactionData
});
```

### Gas Estimation
```javascript
import { estimateGas } from 'viem';

const gasEstimate = await estimateGas({
  account: walletAddress,
  to: contractAddress,
  data: functionData
});
```

## Integration Examples

### Connect to CrossFi
```javascript
import { createPublicClient, http } from 'viem';
import { crossfi } from 'viem/chains';

const client = createPublicClient({
  chain: crossfi,
  transport: http('https://rpc.testnet.ms')
});
```

### Read Contract Data
```javascript
const balance = await client.readContract({
  address: contractAddress,
  abi: contractABI,
  functionName: 'balanceOf',
  args: [walletAddress]
});
```

### Write Contract Data
```javascript
const hash = await client.writeContract({
  address: contractAddress,
  abi: contractABI,
  functionName: 'transfer',
  args: [recipient, amount]
});
``` 