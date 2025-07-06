import { StructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { WalletService } from "./services/wallet.js";
import { BlockchainService } from "./services/blockchain.js";
import { GamificationService } from "./services/gamification.js";
import { User } from "./models/User.js";

// Global variable to store current user ID (set by the graph)
let currentUserId: string | null = null;

// Function to set current user ID (called by the graph)
export const setCurrentUserId = (userId: string) => {
  currentUserId = userId;
};

// Base class for all tools
abstract class BaseTool extends StructuredTool {
  abstract name: string;
  abstract description: string;
  abstract schema: z.ZodObject<any>;

  protected abstract _call(input: z.infer<typeof this.schema>, runManager?: any): Promise<string>;

  async call(input: string | object, runManager?: any): Promise<string> {
    try {
      // Parse and validate input
      let parsedInput: any;
      if (typeof input === 'string') {
        parsedInput = this.schema.parse(JSON.parse(input));
      } else {
        parsedInput = this.schema.parse(input);
      }
      
      // Execute tool
      return await this._call(parsedInput, runManager);
    } catch (error: any) {
      console.error(`Error in ${this.name}:`, error);
      return JSON.stringify({ 
        success: false, 
        error: error.message || 'An error occurred while executing the tool'
      });
    }
  }
}

// Wallet Info Tool
class GetWalletInfoTool extends BaseTool {
  name = "get_wallet_info";
  description = "Gets information about the user's wallet";
  schema = z.object({});

  protected async _call(input: z.infer<typeof this.schema>, runManager?: any) {
    try {
      // Get wallet address from global variable (this is our database wallet address)
      const walletAddress = currentUserId;

      console.log('Current wallet address:', currentUserId);
      
      if (!walletAddress) {
        return JSON.stringify({ 
          success: false, 
          error: 'Wallet address not found. Please try again.' 
        });
      }

      console.log('Getting wallet info for address:', walletAddress);

      // Get user from database using frontend wallet address
      const user = await WalletService.getWalletByAddress(walletAddress);

      console.log('User found:', !!user);
      
      if (!user) {
        return JSON.stringify({ 
          success: false, 
          error: 'User wallet not found in database' 
        });
      }

      return JSON.stringify({
        success: true,
        walletAddress: user.walletAddress,
        chainId: user.chainId,
        createdAt: user.createdAt,
      });
    } catch (error: any) {
      console.error('Error in get_wallet_info:', error);
      return JSON.stringify({ 
        success: false, 
        error: error.message 
      });
    }
  }
}

// Get Wallet for Operations Tool
class GetWalletForOperationsTool extends BaseTool {
  name = "get_wallet_for_operations";
  description = "Gets the user's wallet information for blockchain operations (includes private key)";
  schema = z.object({});

  protected async _call(input: z.infer<typeof this.schema>, runManager?: any): Promise<string> {
    try {
      // Get wallet address from global variable
      const walletAddress = currentUserId;
      
      if (!walletAddress) {
        return JSON.stringify({ 
          success: false, 
          error: 'Wallet address not found. Please try again.' 
        });
      }

      console.log('Getting wallet for operations:', walletAddress);

      // Get user from database using frontend wallet address
      const user = await WalletService.getWalletByAddress(walletAddress);
      
      if (!user) {
        return JSON.stringify({ 
          success: false, 
          error: 'User wallet not found in database' 
        });
      }

      // Get wallet info for operations (includes private key)
      const walletForOps = await WalletService.getWalletForOperations(user.privyId);

      if (!walletForOps) {
        return JSON.stringify({ 
          success: false, 
          error: 'Failed to get wallet for operations' 
        });
      }

      return JSON.stringify({
        success: true,
        walletAddress: walletForOps.address,
        chainId: walletForOps.chainId,
        hasPrivateKey: !!walletForOps.privateKey,
        // Note: private key is encrypted in database
      });
    } catch (error: any) {
      console.error('Error in get_wallet_for_operations:', error);
      return JSON.stringify({ 
        success: false, 
        error: error.message 
      });
    }
  }
}

// Get Balance Tool
class GetBalanceTool extends BaseTool {
  name = "get_balance";
  description = "Gets the balance of a wallet address";
  schema = z.object({
    address: z.string().describe("The wallet address to get balance for")
  });

  protected async _call(input: z.infer<typeof this.schema>, runManager?: any): Promise<string> {
    try {
      const { address } = input;
      
      if (!BlockchainService.isValidAddress(address)) {
        return JSON.stringify({ 
          success: false, 
          error: 'Invalid wallet address format' 
        });
      }

      const balance = await BlockchainService.getBalance(address);
      
      return JSON.stringify({
        success: true,
        address: balance.address,
        balance: balance.balance,
        formatted: balance.formatted,
        symbol: 'XFI'
      });
    } catch (error: any) {
      console.error('Error in get_balance:', error);
      return JSON.stringify({ 
        success: false, 
        error: error.message 
      });
    }
  }
}

// Send Transaction Tool
class SendTransactionTool extends BaseTool {
  name = "send_transaction";
  description = "Sends a transaction from the user's wallet to another address";
  schema = z.object({
    to: z.string().describe("The recipient wallet address"),
    amount: z.string().describe("The amount to send in XFI (e.g., '0.1')"),
    data: z.string().optional().describe("Optional transaction data (hex string)")
  });

  protected async _call(input: z.infer<typeof this.schema>, runManager?: any): Promise<string> {
    try {
      const { to, amount, data } = input;
      
      // Get wallet address from global variable
      const walletAddress = currentUserId;
      
      if (!walletAddress) {
        return JSON.stringify({ 
          success: false, 
          error: 'Wallet address not found. Please try again.' 
        });
      }

      // Validate addresses
      if (!BlockchainService.isValidAddress(to)) {
        return JSON.stringify({ 
          success: false, 
          error: 'Invalid recipient address format' 
        });
      }

      // Get user from database
      const user = await WalletService.getWalletByAddress(walletAddress);
      
      if (!user) {
        return JSON.stringify({ 
          success: false, 
          error: 'User wallet not found in database' 
        });
      }

      // Send transaction
      const transaction = await BlockchainService.sendTransaction(user, to, amount, data);
      
      return JSON.stringify({
        success: true,
        transactionHash: transaction.hash,
        from: transaction.from,
        to: transaction.to,
        value: transaction.value,
        status: transaction.status,
        reward: transaction.reward,
        transactionUrl: transaction.transactionUrl || null,
        transactionExplorerLink: transaction.transactionUrl
          ? `<a href="${transaction.transactionUrl}" target="_blank" rel="noopener noreferrer">view on explorer</a>`
          : null
      });
    } catch (error: any) {
      console.error('Error in send_transaction:', error);
      return JSON.stringify({ 
        success: false, 
        error: error.message 
      });
    }
  }
}

// Get Transaction History Tool
class GetTransactionHistoryTool extends BaseTool {
  name = "get_transaction_history";
  description = "Gets transaction history for a wallet address";
  schema = z.object({
    address: z.string().describe("The wallet address to get transaction history for"),
    limit: z.number().optional().describe("Number of transactions to return (default: 10)")
  });

  protected async _call(input: z.infer<typeof this.schema>, runManager?: any): Promise<string> {
    try {
      const { address, limit = 10 } = input;
      
      if (!BlockchainService.isValidAddress(address)) {
        return JSON.stringify({ 
          success: false, 
          error: 'Invalid wallet address format' 
        });
      }

      const transactions = await BlockchainService.getTransactionHistory(address, limit);
      
      return JSON.stringify({
        success: true,
        address,
        transactions: transactions.map(tx => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: tx.value,
          status: tx.status
        }))
      });
    } catch (error: any) {
      console.error('Error in get_transaction_history:', error);
      return JSON.stringify({ 
        success: false, 
        error: error.message 
      });
    }
  }
}

// Get User Stats Tool
class GetUserStatsTool extends BaseTool {
  name = "get_user_stats";
  description = "Gets the current user's gamification stats (points, rank, achievements)";
  schema = z.object({});

  protected async _call(input: z.infer<typeof this.schema>, runManager?: any): Promise<string> {
    try {
      // Get wallet address from global variable
      const walletAddress = currentUserId;
      
      if (!walletAddress) {
        return JSON.stringify({ 
          success: false, 
          error: 'Wallet address not found. Please try again.' 
        });
      }

      // Get user from database
      const user = await WalletService.getWalletByAddress(walletAddress);
      
      if (!user) {
        return JSON.stringify({ 
          success: false, 
          error: 'User wallet not found in database' 
        });
      }

      // Get user stats
      const stats = await GamificationService.getUserStats(user.privyId);
      
      if (!stats) {
        return JSON.stringify({ 
          success: false, 
          error: 'Failed to get user stats' 
        });
      }

      // Get achievements
      const milestones = GamificationService.getAchievementMilestones();
      const userAchievements = milestones.map(milestone => ({
        name: milestone.name,
        description: milestone.description,
        achieved: stats.totalVolume >= milestone.volumeRequired,
        progress: Math.min((stats.totalVolume / milestone.volumeRequired) * 100, 100)
      }));

      return JSON.stringify({
        success: true,
        stats: {
          points: stats.points,
          totalVolume: stats.totalVolume,
          rank: stats.rank,
          nextMilestone: stats.nextMilestone,
          nextVolumeMilestone: stats.nextVolumeMilestone
        },
        achievements: userAchievements,
        totalAchievements: milestones.length,
        achievedCount: userAchievements.filter(a => a.achieved).length
      });
    } catch (error: any) {
      console.error('Error in get_user_stats:', error);
      return JSON.stringify({ 
        success: false, 
        error: error.message 
      });
    }
  }
}

// Get Leaderboard Tool
class GetLeaderboardTool extends BaseTool {
  name = "get_leaderboard";
  description = "Gets the global leaderboard showing top users by points";
  schema = z.object({
    limit: z.number().optional().describe("Number of top users to return (default: 10)")
  });

  protected async _call(input: z.infer<typeof this.schema>, runManager?: any): Promise<string> {
    try {
      const { limit = 10 } = input;
      
      // Get leaderboard
      const leaderboard = await GamificationService.getLeaderboard(limit);
      
      // Get current user's position if they're authenticated
      let userPosition = null;
      const walletAddress = currentUserId;
      
      if (walletAddress) {
        const user = await WalletService.getWalletByAddress(walletAddress);
        if (user) {
          userPosition = await GamificationService.getUserLeaderboardPosition(user.privyId);
        }
      }

      return JSON.stringify({
        success: true,
        leaderboard: leaderboard.map(entry => ({
          rank: entry.rank,
          walletAddress: BlockchainService.formatAddress(entry.walletAddress),
          points: entry.points,
          totalVolume: entry.totalVolume
        })),
        userPosition: userPosition ? {
          rank: userPosition.rank,
          totalUsers: userPosition.totalUsers,
          percentile: userPosition.percentile
        } : null,
        totalUsers: leaderboard.length > 0 ? Math.max(...leaderboard.map(l => l.rank)) : 0
      });
    } catch (error: any) {
      console.error('Error in get_leaderboard:', error);
      return JSON.stringify({ 
        success: false, 
        error: error.message 
      });
    }
  }
}

// Set Username Tool
class SetUsernameTool extends BaseTool {
  name = "set_username";
  description = "Set or update the user's public username (3-20 chars, alphanumeric or underscores, must be unique)";
  schema = z.object({
    username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/).describe("The new username to set")
  });

  protected async _call(input: z.infer<typeof this.schema>, runManager?: any): Promise<string> {
    try {
      const { username } = input;
      const walletAddress = currentUserId;
      if (!walletAddress) {
        return JSON.stringify({ success: false, error: 'Wallet address not found. Please try again.' });
      }
      const user = await WalletService.getWalletByAddress(walletAddress);
      if (!user) {
        return JSON.stringify({ success: false, error: 'User wallet not found in database' });
      }
      
      // Validate username format
      if (!username || typeof username !== 'string' || username.length < 3 || username.length > 20 || !/^[a-zA-Z0-9_]+$/.test(username)) {
        return JSON.stringify({ success: false, error: 'Invalid username. Must be 3-20 characters, alphanumeric or underscores.' });
      }
      
      // Check uniqueness
      const existing = await User.findOne({ username: username });
      if (existing && existing.privyId !== user.privyId) {
        return JSON.stringify({ success: false, error: 'Username already taken' });
      }
      
      // Update user
      user.username = username;
      await user.save();
      
      return JSON.stringify({ success: true, username });
    } catch (error: any) {
      console.error('Error in set_username:', error);
      return JSON.stringify({ success: false, error: error.message });
    }
  }
}

// Export tools list
export const ALL_TOOLS_LIST = [
  new GetWalletInfoTool(),
  new GetWalletForOperationsTool(),
  new GetBalanceTool(),
  new SendTransactionTool(),
  new GetTransactionHistoryTool(),
  new GetUserStatsTool(),
  new GetLeaderboardTool(),
  new SetUsernameTool(),
]; 