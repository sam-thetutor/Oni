import { ToolNode } from "@langchain/langgraph/prebuilt";
import {
  Annotation,
  END,
  START,
  StateGraph,
  MessagesAnnotation,
} from "@langchain/langgraph";
import { BaseMessage, type AIMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { ALL_TOOLS_LIST, setCurrentUserId } from "./tools.js";
import { config } from "dotenv";

config();

// Add userId to the graph state
const GraphAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  userId: Annotation<string>(),
});

const llm = new ChatOpenAI({
  model: "gpt-4",
  temperature: 0,
});

const toolNode = new ToolNode(ALL_TOOLS_LIST);

const callModel = async (state: typeof GraphAnnotation.State) => {
  const { messages, userId } = state;

  const systemMessage = {
    role: "system",
    content:
      "You are a helpful AI assistant with access to blockchain wallet information and operations, plus gamification features. " +
      "You have access to the following tools:\n" +
      "1. get_wallet_info - Gets information about the user's wallet (address, chain ID, creation date)\n" +
      "2. get_wallet_for_operations - Gets wallet info for blockchain operations (includes private key access)\n" +
      "3. get_balance - Gets the balance of a wallet address\n" +
      "4. send_transaction - Sends a transaction from the user's wallet to another address (awards points for successful transactions)\n" +
      "5. get_transaction_history - Gets transaction history for a wallet address\n" +
      "6. get_user_stats - Gets the user's gamification stats (points, rank, achievements)\n" +
      "7. get_leaderboard - Gets the global leaderboard showing top users by points\n\n" +
      "When users ask about their wallet, use the get_wallet_info tool to provide detailed information. " +
      "When users want to check balances, use the get_balance tool. " +
      "When users want to send transactions, use the send_transaction tool. " +
      "When users want to see transaction history, use the get_transaction_history tool. " +
      "When users ask about their points, rank, or achievements, use the get_user_stats tool. " +
      "When users ask about the leaderboard, top players, or who has the most points, use the get_leaderboard tool. " +
      "After successful transactions, congratulate users on earning points and mention their new total. " +
      "Be friendly, helpful, and encouraging about the gamification system. Always validate addresses before performing operations.",
  };

  const llmWithTools = llm.bindTools(ALL_TOOLS_LIST);
  const result = await llmWithTools.invoke([systemMessage, ...messages]);
  return { messages: result, userId };
};

const shouldContinue = (state: typeof GraphAnnotation.State) => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1];

  // Cast since `tool_calls` does not exist on `BaseMessage`
  const messageCastAI = lastMessage as AIMessage;
  if (messageCastAI._getType() !== "ai" || !messageCastAI.tool_calls?.length) {
    return END;
  }

  return "tools";
};

// Custom tool node that sets user context
const customToolNode = async (state: typeof GraphAnnotation.State) => {
  const { messages, userId } = state;
  
  // Set the current user ID for tools to access
  setCurrentUserId(userId);
  
  // Execute tools
  const result = await toolNode.invoke(messages);
  
  return { messages: result, userId };
};

const workflow = new StateGraph(GraphAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", customToolNode)
  .addEdge(START, "agent")
  .addEdge("tools", "agent")
  .addConditionalEdges("agent", shouldContinue, ["tools", END]);

export const graph = workflow.compile(); 