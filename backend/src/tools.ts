import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { BalanceResponse, TransactionResponse, SendTokensParams, TransactionHistoryParams, TransactionHistoryResponse } from "./types.js";
import { config } from 'dotenv';

config();

// Tool to check wallet balance
const checkBalanceTool = tool(
  async (input: { address: string }): Promise<string> => {
    try {
      // TODO: Implement actual CrossFi balance check
      const mockBalances = [
        {
          token: "CFI",
          balance: "1000.00",
          decimals: 18
        },
        {
          token: "USDC",
          balance: "500.00",
          decimals: 6
        }
      ];

      const response: BalanceResponse = {
        address: input.address,
        balances: mockBalances,
      };
      return JSON.stringify(response, null, 2);
    } catch (e: any) {
      console.warn("Error fetching balance", e.message);
      return `Error fetching balance: ${e.message}`;
    }
  },
  {
    name: "check_balance",
    description: "Checks the balance of a CrossFi wallet address",
    schema: z.object({
      address: z.string().describe("The CrossFi wallet address to check"),
    }),
  }
);

// Tool to send tokens
const sendTokensTool = tool(
  async (input: SendTokensParams): Promise<string> => {
    try {
      // TODO: Implement actual CrossFi token transfer
      const response: TransactionResponse = {
        success: true,
        transaction_hash: "0x" + "0".repeat(64),
        explorer_link: `https://explorer.crossfi.org/tx/0x${"0".repeat(64)}`,
        new_balance: "900.00",
      };
      
      return JSON.stringify(response, null, 2);
    } catch (e: any) {
      console.warn("Error sending tokens", e.message);
      const response: TransactionResponse = {
        success: false,
        error: e.message,
      };
      return JSON.stringify(response, null, 2);
    }
  },
  {
    name: "send_tokens",
    description: "Sends tokens from your CrossFi wallet to another address",
    schema: z.object({
      destination: z.string().describe("The destination CrossFi wallet address"),
      token: z.string().describe("The token to send (e.g., 'CFI', 'USDC')"),
      amount: z.string().describe("The amount of tokens to send"),
    }),
  }
);

// Tool to get transaction history
const getTransactionHistoryTool = tool(
  async (input: TransactionHistoryParams): Promise<string> => {
    try {
      // TODO: Implement actual CrossFi transaction history
      const mockTransactions = {
        transactions: [
          {
            hash: "0x" + "0".repeat(64),
            timestamp: new Date().toISOString(),
            type: "send",
            amount: "100.00",
            token: "CFI",
            from: input.address,
            to: "0x" + "1".repeat(40),
            status: "success"
          }
        ],
        total: 1
      };

      return JSON.stringify(mockTransactions, null, 2);
    } catch (e: any) {
      console.warn("Error fetching transaction history", e.message);
      return `Error fetching transaction history: ${e.message}`;
    }
  },
  {
    name: "get_transaction_history",
    description: "Gets the transaction history for a CrossFi wallet address",
    schema: z.object({
      address: z.string().describe("The CrossFi wallet address to check"),
      limit: z.number().optional().describe("Maximum number of transactions to return"),
      offset: z.number().optional().describe("Number of transactions to skip"),
    }),
  }
);

export const ALL_TOOLS_LIST = [
  checkBalanceTool,
  sendTokensTool,
  getTransactionHistoryTool,
]; 