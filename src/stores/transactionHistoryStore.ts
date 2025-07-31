import { create } from 'zustand';
import { EXPLORER_URL } from '../utils/constants';
import { Transaction, CrossFiTransaction } from '../types/transaction';

interface TransactionHistoryState {
  // Transaction data
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  
  // Pagination
  hasMore: boolean;
  currentPage: number;
  
  // Actions
  fetchTransactionHistory: (walletAddress: string, force?: boolean) => Promise<void>;
  loadMoreTransactions: (walletAddress: string) => Promise<void>;
  clearCache: () => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (hash: string, updates: Partial<Transaction>) => void;
}

const REFRESH_INTERVAL = 2 * 60 * 1000; // 2 minutes in milliseconds
const TRANSACTIONS_PER_PAGE = 20;
const PAYMENT_LINK_CONTRACT_ADDRESS = '0x8ceb24694b8d3965bd7224652b15b2a4f65bd130';
const SWAP_CONTRACT_ADDRESS = '0x841a503b62d25f778344a5aeaf6fab07df3e2e73';

// Helper function to decode base64 amounts (copied from existing TransactionHistory component)
const decodeBase64Amount = (base64String: string): bigint => {
  try {
    const binaryString = atob(base64String);
    let hex = '';
    for (let i = 0; i < binaryString.length; i++) {
      const charCode = binaryString.charCodeAt(i);
      hex += charCode.toString(16).padStart(2, '0');
    }
    return BigInt('0x' + hex);
  } catch (e) {
    console.log('❌ Error decoding base64 amount:', e);
    return BigInt(0);
  }
};

// Parse swap transaction (copied from existing TransactionHistory component)
const parseSwapTransaction = (tx: CrossFiTransaction): Transaction => {
  const message = tx.body.messages[0];
  const from = message.from || '';
  const data = message.data;
  
  let fromToken = 'Unknown';
  let toToken = 'Unknown';
  let fromAmount = '0';
  let toAmount = '0';
  
  if (data?.value && data.value !== '0') {
    const amountBigInt = BigInt(data.value);
    fromAmount = (Number(amountBigInt) / Math.pow(10, 18)).toString();
    fromToken = 'XFI';
  }
  
  if (tx.logs && tx.logs.length > 0) {
    const logEvents = tx.logs[0].events;
    
    for (const event of logEvents) {
      if (event.type === 'ethereum_tx') {
        for (const attr of event.attributes || []) {
          if (attr.key === 'amount') {
            const amount = attr.value;
            if (amount && amount !== '0') {
              const amountBigInt = BigInt(amount);
              fromAmount = (Number(amountBigInt) / Math.pow(10, 18)).toString();
              fromToken = 'XFI';
            }
          }
        }
      }
    }
    
    for (const event of logEvents) {
      if (event.type === 'tx_log') {
        for (const attr of event.attributes || []) {
          if (attr.key === 'txLog') {
            try {
              const logData = JSON.parse(attr.value);
              
              if (logData.topics && logData.topics.length > 0) {
                const transferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
                if (logData.topics[0] === transferTopic) {
                  const tokenAddress = logData.address;
                  const amount = logData.data;
                  
                  if (tokenAddress === '0xC537D12bd626B135B251cCa43283EFF69eC109c4') {
                    fromToken = 'WXFI';
                  } else if (tokenAddress === '0x38E88b1ed92065eD20241A257ef3713A131C9155') {
                    toToken = 'USDT';
                  } else if (tokenAddress === '0x7bBcE15166bBc008EC1aDF9b3D6bbA0602FCE7Ba') {
                    toToken = 'USDC';
                  }
                  
                  if (amount && amount !== '0x') {
                    let amountBigInt;
                    try {
                      if (amount.startsWith('0x')) {
                        amountBigInt = BigInt(amount);
                      } else {
                        amountBigInt = decodeBase64Amount(amount);
                      }
                      
                      if (amountBigInt > 0) {
                        if (toToken === 'USDT' || toToken === 'USDC') {
                          toAmount = (Number(amountBigInt) / Math.pow(10, 6)).toString();
                        } else {
                          toAmount = (Number(amountBigInt) / Math.pow(10, 18)).toString();
                        }
                      }
                    } catch (e) {
                      console.log('❌ Error converting amount:', e);
                    }
                  }
                }
              }
            } catch (e) {
              console.log('❌ Error parsing txLog:', e);
            }
          }
        }
      }
    }
  }
  
  return {
    hash: tx.evm_txhashes[0] || tx.txhash,
    from: from.toLowerCase(),
    to: 'Swap Contract',
    value: fromAmount,
    status: tx.code === 0 ? 'success' : 'failed',
    timestamp: tx.timestamp,
    explorerUrl: `${EXPLORER_URL}/tx/${tx.evm_txhashes[0] || tx.txhash}`,
    type: 'swap',
    swapDetails: {
      fromToken,
      toToken,
      fromAmount,
      toAmount
    }
  };
};

// Parse transfer transaction (copied from existing TransactionHistory component)
const parseTransferTransaction = (tx: CrossFiTransaction): Transaction => {
  const message = tx.body.messages[0];
  const data = message.data;
  
  const from = message.from || '';
  const to = data?.to || '';
  const value = data?.value || '0';
  
  const valueInXFI = (parseInt(value) / Math.pow(10, 18)).toString();
  
  return {
    hash: tx.evm_txhashes[0] || tx.txhash,
    from: from.toLowerCase(),
    to: to.toLowerCase(),
    value: valueInXFI,
    status: tx.code === 0 ? 'success' : 'failed',
    timestamp: tx.timestamp,
    explorerUrl: `${EXPLORER_URL}/tx/${tx.evm_txhashes[0] || tx.txhash}`,
    type: 'transfer'
  };
};

// Parse payment link transaction
const parsePaymentLinkTransaction = (tx: CrossFiTransaction, userWalletAddress: string): Transaction | null => {
  const message = tx.body.messages[0];
  const from = message.from || '';
  const data = message.data;
  
  console.log(`🔗 ===== PAYMENT LINK TRANSACTION DEBUG =====`);
  console.log(`🔗 Transaction hash: ${tx.txhash}`);
  console.log(`🔗 User wallet address: ${userWalletAddress}`);
  console.log(`🔗 Transaction from: ${from}`);
  console.log(`🔗 Transaction to: ${data?.to}`);
  console.log(`🔗 Transaction data.value: ${data?.value}`);
  console.log(`🔗 Transaction addresses: ${tx.addresses?.join(', ')}`);
  
  // Check if this transaction involves the user's wallet address
  const userAddressLower = userWalletAddress.toLowerCase();
  const fromLower = from.toLowerCase();
  const toLower = data?.to?.toLowerCase() || '';
  
  // Check if user is the sender or recipient
  const isUserSender = fromLower === userAddressLower;
  const isUserRecipient = toLower === userAddressLower;
  
  // Also check in the addresses array if available
  const addresses = tx.addresses || [];
  const isUserInAddresses = addresses.some(addr => addr.toLowerCase() === userAddressLower);
  
  console.log(`🔗 User involvement check:`);
  console.log(`🔗   - User address: ${userAddressLower}`);
  console.log(`🔗   - From address: ${fromLower}`);
  console.log(`🔗   - To address: ${toLower}`);
  console.log(`🔗   - Is user sender: ${isUserSender}`);
  console.log(`🔗   - Is user recipient: ${isUserRecipient}`);
  console.log(`🔗   - Is user in addresses: ${isUserInAddresses}`);
  
  // Check if user is involved in any transfer events
  let isUserInTransferEvents = false;
  let userTransferAmount = '0';
  
  if (tx.logs && tx.logs.length > 0) {
    console.log(`🔗 Checking transfer events...`);
    const logEvents = tx.logs[0].events;
    for (const event of logEvents) {
      if (event.type === 'transfer') {
        console.log(`🔗   Found transfer event with ${event.attributes?.length || 0} attributes`);
        
        let currentSender = '';
        let currentRecipient = '';
        let currentAmount = '';
        
        // Collect all attributes for this transfer event
        for (const attr of event.attributes || []) {
          console.log(`🔗     ${attr.key}: ${attr.value}`);
          
          if (attr.key === 'sender') {
            currentSender = attr.value.toLowerCase();
          } else if (attr.key === 'recipient') {
            currentRecipient = attr.value.toLowerCase();
          } else if (attr.key === 'amount') {
            currentAmount = attr.value.replace('xfi', '');
          }
        }
        
        // Check if this transfer involves the user
        if (currentSender === userAddressLower || currentRecipient === userAddressLower) {
          isUserInTransferEvents = true;
          console.log(`🔗     ✅ Found user in transfer event: sender=${currentSender}, recipient=${currentRecipient}, amount=${currentAmount}`);
          
          // If user is involved, capture the amount
          if (currentAmount && currentAmount !== '0') {
            const amountInXFI = parseInt(currentAmount) / Math.pow(10, 18);
            if (amountInXFI > 0.01) { // Only consider significant amounts
              userTransferAmount = currentAmount;
              console.log(`🔗     ✅ Captured user transfer amount: ${currentAmount} (${amountInXFI} XFI)`);
            }
          }
        }
      }
    }
  } else {
    console.log(`🔗 No logs found in transaction`);
  }
  
  console.log(`🔗 Is user in transfer events: ${isUserInTransferEvents}`);
  console.log(`🔗 User transfer amount: ${userTransferAmount}`);
  
  // Only include transactions where the user is actually involved
  if (!isUserSender && !isUserRecipient && !isUserInAddresses && !isUserInTransferEvents) {
    console.log(`🔗 ❌ User not involved in this transaction, skipping`);
    return null;
  }
  
  console.log(`🔗 ✅ User is involved in this transaction, processing...`);
  
  // Get the transaction value - prioritize user transfer amount, then data.value
  let valueInXFI = '0';
  
  if (userTransferAmount !== '0') {
    // Use the amount from transfer events where user is involved
    valueInXFI = (parseInt(userTransferAmount) / Math.pow(10, 18)).toString();
    console.log(`🔗 ✅ Using user transfer amount: ${userTransferAmount} -> ${valueInXFI} XFI`);
  } else {
    // Fallback to data.value
    const dataValue = data?.value || '0';
    console.log(`🔗 Value extraction from data.value:`);
    console.log(`🔗   - Raw data.value: "${dataValue}"`);
    
    if (dataValue !== '0') {
      const rawValue = parseInt(dataValue);
      valueInXFI = (rawValue / Math.pow(10, 18)).toString();
      console.log(`🔗   - Parsed raw value: ${rawValue}`);
      console.log(`🔗   - Converted to XFI: ${valueInXFI}`);
      console.log(`🔗 ✅ Using data.value: ${dataValue} -> ${valueInXFI} XFI`);
    } else {
      console.log(`🔗 ❌ No suitable value found`);
    }
  }
  
  console.log(`🔗 Final value: ${valueInXFI} XFI`);
  
  // Determine transaction type based on user's role
  let type: 'payment-link' = 'payment-link';
  let description = '';
  
  if (isUserSender) {
    description = 'Payment Link Created';
  } else if (isUserRecipient) {
    description = 'Payment Link Payment Received';
  } else if (isUserInTransferEvents) {
    description = 'Payment Link Transaction';
  } else {
    description = 'Payment Link Transaction';
  }
  
  console.log(`🔗 Transaction type: ${description}`);
  console.log(`🔗 ===== END PAYMENT LINK DEBUG =====`);
  
  return {
    hash: tx.evm_txhashes[0] || tx.txhash,
    from: from.toLowerCase(),
    to: data?.to?.toLowerCase() || '',
    value: valueInXFI,
    status: tx.code === 0 ? 'success' : 'failed',
    timestamp: tx.timestamp,
    explorerUrl: `${EXPLORER_URL}/tx/${tx.evm_txhashes[0] || tx.txhash}`,
    type,
    swapDetails: {
      fromToken: 'XFI',
      toToken: 'XFI',
      fromAmount: valueInXFI,
      toAmount: valueInXFI
    }
  };
};

// Parse swap transaction from swap contract
const parseSwapContractTransaction = (tx: CrossFiTransaction, userWalletAddress: string): Transaction | null => {
  console.log(`🔄 ===== SWAP CONTRACT DEBUG =====`);
  console.log(`🔄 Processing swap contract transaction: ${tx.txhash}`);
  
  const message = tx.body.messages[0];
  const from = message.from || '';
  const data = message.data;
  const userAddressLower = userWalletAddress.toLowerCase();
  
  console.log(`🔄 From: ${from}`);
  console.log(`🔄 User address: ${userAddressLower}`);
  
  // Check if user is involved in this transaction
  const isUserSender = from.toLowerCase() === userAddressLower;
  const isUserInAddresses = tx.addresses?.some(addr => addr.toLowerCase() === userAddressLower) || false;
  
  console.log(`🔄 Is user sender: ${isUserSender}`);
  console.log(`🔄 Is user in addresses: ${isUserInAddresses}`);
  
  // Only include transactions where the user is actually involved
  if (!isUserSender && !isUserInAddresses) {
    console.log(`🔄 ❌ User not involved in this transaction, skipping`);
    return null;
  }
  
  console.log(`🔄 ✅ User is involved in this transaction, processing...`);
  
  // Extract swap details from the transaction
  let fromToken = 'Unknown';
  let toToken = 'Unknown';
  let fromAmount = '0';
  let toAmount = '0';
  let swapMethod = 'Unknown';
  
  // Get method name from input data
  if (data?.input?.methodName) {
    swapMethod = data.input.methodName;
    console.log(`🔄 Swap method: ${swapMethod}`);
  }
  
  // Extract amounts from input args
  if (data?.input?.args) {
    const args = data.input.args;
    console.log(`🔄 Input args:`, args);
    
    if (swapMethod === 'swapExactETHForTokens' && args.amountOutMin) {
      fromAmount = (parseInt(data.value || '0') / Math.pow(10, 18)).toString();
      fromToken = 'XFI';
      console.log(`🔄 ETH swap: ${fromAmount} XFI -> ${args.amountOutMin} min output`);
    } else if (swapMethod === 'swapExactTokensForTokens' && args.amountIn && args.amountOutMin) {
      fromAmount = (parseInt(args.amountIn) / Math.pow(10, 6)).toString(); // Assuming 6 decimals for most tokens
      console.log(`🔄 Token swap: ${fromAmount} tokens -> ${args.amountOutMin} min output`);
    }
  }
  
  // Extract token information from path
  if (data?.input?.args?.path && Array.isArray(data.input.args.path)) {
    const path = data.input.args.path;
    console.log(`🔄 Swap path:`, path);
    
    // Map token addresses to symbols
    const tokenMap: { [key: string]: string } = {
      '0xc537d12bd626b135b251cca43283eff69ec109c4': 'WXFI',
      '0x38e88b1ed92065ed20241a257ef3713a131c9155': 'USDT',
      '0x7bbce15166bbc008ec1adf9b3d6bba0602fce7ba': 'USDC',
      '0x8bd5fe9286b039cc38d9b63865a8e87736382ccf': 'XUSD',
      '0xf11cd6661e7367d765cfaba3747bff2dbd59bcfa': 'BAZER'
    };
    
    if (path.length >= 2) {
      fromToken = tokenMap[path[0].toLowerCase()] || 'Unknown';
      toToken = tokenMap[path[path.length - 1].toLowerCase()] || 'Unknown';
      console.log(`🔄 Token mapping: ${fromToken} -> ${toToken}`);
    }
  }
  
  // Extract actual amounts from output
  if (data?.output?.amounts && Array.isArray(data.output.amounts)) {
    const amounts = data.output.amounts;
    console.log(`🔄 Output amounts:`, amounts);
    
    if (amounts.length >= 2) {
      // Convert amounts based on token decimals
      const fromAmountRaw = parseInt(amounts[0]);
      const toAmountRaw = parseInt(amounts[amounts.length - 1]);
      
      if (fromToken === 'XFI' || fromToken === 'WXFI') {
        fromAmount = (fromAmountRaw / Math.pow(10, 18)).toString();
      } else {
        fromAmount = (fromAmountRaw / Math.pow(10, 6)).toString(); // Assuming 6 decimals
      }
      
      if (toToken === 'XFI' || toToken === 'WXFI') {
        toAmount = (toAmountRaw / Math.pow(10, 18)).toString();
      } else {
        toAmount = (toAmountRaw / Math.pow(10, 6)).toString(); // Assuming 6 decimals
      }
      
      console.log(`🔄 Final amounts: ${fromAmount} ${fromToken} -> ${toAmount} ${toToken}`);
    }
  }
  
  // Determine transaction type and description
  let type: 'swap' = 'swap';
  let description = '';
  
  if (swapMethod === 'swapExactETHForTokens') {
    description = `Swap ${fromAmount} ${fromToken} for ${toToken}`;
  } else if (swapMethod === 'swapExactTokensForTokens') {
    description = `Swap ${fromAmount} ${fromToken} for ${toToken}`;
  } else {
    description = `Swap ${fromAmount} ${fromToken} for ${toToken}`;
  }
  
  console.log(`🔄 Transaction description: ${description}`);
  console.log(`🔄 ===== END SWAP CONTRACT DEBUG =====`);
  
  return {
    hash: tx.evm_txhashes[0] || tx.txhash,
    from: from.toLowerCase(),
    to: data?.to?.toLowerCase() || '',
    value: fromAmount,
    status: tx.code === 0 ? 'success' : 'failed',
    timestamp: tx.timestamp,
    explorerUrl: `${EXPLORER_URL}/tx/${tx.evm_txhashes[0] || tx.txhash}`,
    type,
    swapDetails: {
      fromToken,
      toToken,
      fromAmount,
      toAmount
    }
  };
};

// Fetch transactions from both wallet and payment link contract
const fetchAllTransactions = async (walletAddress: string, page: number = 1, limit: number = TRANSACTIONS_PER_PAGE) => {
  const allTransactions: Transaction[] = [];
  
  console.log(`🔍 ===== FETCHING ALL TRANSACTIONS =====`);
  console.log(`🔍 Wallet address: ${walletAddress}`);
  console.log(`🔍 Page: ${page}, Limit: ${limit}`);
  
  try {
    // Fetch wallet transactions
    console.log(`🔍 Fetching wallet transactions for: ${walletAddress}`);
    const walletResponse = await fetch(`${EXPLORER_URL}/api/1.0/txs?address=${walletAddress}&page=${page}&limit=${limit}`);
    
    if (walletResponse.ok) {
      const walletData = await walletResponse.json();
      console.log(`🔍 Wallet transactions response: ${walletData.docs?.length || 0} transactions found`);
      
      if (walletData.docs && Array.isArray(walletData.docs)) {
        const walletTransactions = walletData.docs
          .filter((tx: CrossFiTransaction) => tx.code === 0)
          .map((tx: CrossFiTransaction) => {
            const message = tx.body.messages[0];
            const data = message.data;
            
            const isSwap = data?.to === '0x841A503b62d25f778344A5aEAF6FaB07df3e2e73' || 
                          data?.to === '0x841a503b62d25f778344a5aeaf6fab07df3e2e73';
            
            if (isSwap && tx.logs) {
              return parseSwapTransaction(tx);
            } else {
              return parseTransferTransaction(tx);
            }
          })
          .filter((tx: Transaction) => tx.from && tx.to && (tx.value !== '0' || tx.type === 'swap'));
        
        console.log(`🔍 Processed wallet transactions: ${walletTransactions.length}`);
        allTransactions.push(...walletTransactions);
      }
    } else {
      console.log(`🔍 ❌ Wallet transactions fetch failed: ${walletResponse.status}`);
    }
    
    // Fetch payment link contract transactions
    console.log(`🔍 Fetching payment link contract transactions from: ${PAYMENT_LINK_CONTRACT_ADDRESS}`);
    const paymentLinkResponse = await fetch(`${EXPLORER_URL}/api/1.0/txs?address=${PAYMENT_LINK_CONTRACT_ADDRESS}&page=${page}&limit=${limit}`);
    
    if (paymentLinkResponse.ok) {
      const paymentLinkData = await paymentLinkResponse.json();
      console.log(`🔍 Payment link transactions response: ${paymentLinkData.docs?.length || 0} transactions found`);
      
      if (paymentLinkData.docs && Array.isArray(paymentLinkData.docs)) {
        console.log(`🔍 Processing payment link transactions...`);
        
        const paymentLinkTransactions = paymentLinkData.docs
          .filter((tx: CrossFiTransaction) => {
            const isValid = tx.code === 0;
            console.log(`🔍   Transaction ${tx.txhash}: code=${tx.code}, valid=${isValid}`);
            return isValid;
          })
          .map((tx: CrossFiTransaction) => {
            console.log(`🔍   Processing payment link transaction: ${tx.txhash}`);
            return parsePaymentLinkTransaction(tx, walletAddress);
          })
          .filter((tx: Transaction | null) => {
            const isValid = tx !== null;
            console.log(`🔍   Transaction ${tx?.hash || 'unknown'}: valid=${isValid}, value=${tx?.value || 'N/A'}`);
            return isValid;
          }) as Transaction[];
        
        console.log(`🔍 Processed payment link transactions: ${paymentLinkTransactions.length}`);
        allTransactions.push(...paymentLinkTransactions);
      }
    } else {
      console.log(`🔍 ❌ Payment link transactions fetch failed: ${paymentLinkResponse.status}`);
    }
    
    // Fetch swap contract transactions
    console.log(`🔍 Fetching swap contract transactions from: ${SWAP_CONTRACT_ADDRESS}`);
    const swapResponse = await fetch(`${EXPLORER_URL}/api/1.0/txs?address=${SWAP_CONTRACT_ADDRESS}&page=${page}&limit=${limit}`);
    
    if (swapResponse.ok) {
      const swapData = await swapResponse.json();
      console.log(`🔍 Swap transactions response: ${swapData.docs?.length || 0} transactions found`);
      
      if (swapData.docs && Array.isArray(swapData.docs)) {
        console.log(`🔍 Processing swap contract transactions...`);
        
        const swapTransactions = swapData.docs
          .filter((tx: CrossFiTransaction) => {
            const isValid = tx.code === 0;
            console.log(`🔍   Transaction ${tx.txhash}: code=${tx.code}, valid=${isValid}`);
            return isValid;
          })
          .map((tx: CrossFiTransaction) => {
            console.log(`🔍   Processing swap contract transaction: ${tx.txhash}`);
            return parseSwapContractTransaction(tx, walletAddress);
          })
          .filter((tx: Transaction | null) => {
            const isValid = tx !== null;
            console.log(`🔍   Transaction ${tx?.hash || 'unknown'}: valid=${isValid}, value=${tx?.value || 'N/A'}`);
            return isValid;
          }) as Transaction[];
        
        console.log(`🔍 Processed swap contract transactions: ${swapTransactions.length}`);
        allTransactions.push(...swapTransactions);
      }
    } else {
      console.log(`🔍 ❌ Swap contract transactions fetch failed: ${swapResponse.status}`);
    }
    
    console.log(`🔍 Total transactions before sorting: ${allTransactions.length}`);
    
    // Sort by timestamp (newest first)
    allTransactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Remove duplicates based on hash
    const uniqueTransactions = allTransactions.filter((tx, index, self) => 
      index === self.findIndex(t => t.hash === tx.hash)
    );
    
    console.log(`🔍 Final unique transactions: ${uniqueTransactions.length}`);
    console.log(`🔍 ===== END FETCHING ALL TRANSACTIONS =====`);
    
    return uniqueTransactions;
  } catch (error) {
    console.error('❌ Error fetching transactions:', error);
    throw error;
  }
};

export const useTransactionHistoryStore = create<TransactionHistoryState>((set, get) => ({
  // Initial state
  transactions: [],
  loading: false,
  error: null,
  lastFetched: null,
  hasMore: true,
  currentPage: 1,
  
  // Fetch transaction history from both wallet and payment link contract
  fetchTransactionHistory: async (walletAddress: string, force = false) => {
    const state = get();
    const now = Date.now();
    
    // Check if we need to refresh (force refresh or data is stale)
    if (!force && 
        state.lastFetched && 
        (now - state.lastFetched) < REFRESH_INTERVAL) {
      console.log('📦 Using cached transaction data');
      return; // Use cached data
    }
    
    // Only set loading to true if we don't have cached data
    const hasCachedData = state.transactions.length > 0;
    if (!hasCachedData) {
      set({ loading: true, error: null });
    } else {
      console.log('🔄 Refreshing transaction data in background');
    }
    
    try {
      const allTransactions = await fetchAllTransactions(walletAddress, 1, TRANSACTIONS_PER_PAGE);
      
      console.log('Parsed transactions:', allTransactions);
      
      set({
        transactions: allTransactions,
        lastFetched: now,
        error: null,
        currentPage: 1,
        hasMore: allTransactions.length === TRANSACTIONS_PER_PAGE,
        loading: false, // Always set loading to false when done
      });
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch transaction history',
        loading: false, // Always set loading to false on error
      });
    }
  },
  
  // Load more transactions (pagination)
  loadMoreTransactions: async (walletAddress: string) => {
    const state = get();
    const nextPage = state.currentPage + 1;
    
    if (!state.hasMore || state.loading) {
      return;
    }
    
    set({ loading: true });
    
    try {
      const additionalTransactions = await fetchAllTransactions(walletAddress, nextPage, TRANSACTIONS_PER_PAGE);
      
      set({
        transactions: [...state.transactions, ...additionalTransactions],
        currentPage: nextPage,
        hasMore: additionalTransactions.length === TRANSACTIONS_PER_PAGE,
        loading: false,
      });
    } catch (error) {
      console.error('Error loading more transactions:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to load more transactions',
        loading: false,
      });
    }
  },
  
  // Clear cache
  clearCache: () => {
    set({
      transactions: [],
      lastFetched: null,
      currentPage: 1,
      hasMore: true,
      error: null,
      loading: false,
    });
  },
  
  // Add a new transaction (useful for real-time updates)
  addTransaction: (transaction: Transaction) => {
    const state = get();
    // Add to the beginning of the list
    set({
      transactions: [transaction, ...state.transactions],
    });
  },
  
  // Update an existing transaction
  updateTransaction: (hash: string, updates: Partial<Transaction>) => {
    const state = get();
    set({
      transactions: state.transactions.map(tx => 
        tx.hash === hash ? { ...tx, ...updates } : tx
      ),
    });
  },
}));

// Auto-refresh setup
let refreshInterval: NodeJS.Timeout | null = null;

export const startTransactionHistoryAutoRefresh = (walletAddress: string) => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
  
  refreshInterval = setInterval(() => {
    const store = useTransactionHistoryStore.getState();
    store.fetchTransactionHistory(walletAddress);
  }, REFRESH_INTERVAL);
};

export const stopTransactionHistoryAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};