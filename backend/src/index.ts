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
      "7. get_leaderboard - Gets the global leaderboard showing top users by points\n" +
      "8. set_username - Set or update the user's public username (3-20 chars, alphanumeric or underscores, must be unique)\n" +
      "9. create_global_payment_link - Creates a global payment link for the user\n" +
      "10. create_payment_links - Creates a fixed payment link for a specified amount on the blockchain\n" +
      "11. pay_fixed_payment_link - Pays a fixed payment link using the link ID\n" +
      "\nFor payment links, when a user successfully creates one, provide them with the clickable payment URL that others can use to pay them.\n" +
      "When helping users, be conversational and explain what you're doing. " +
      "If someone asks about their wallet, gamification stats, or wants to send transactions, use the appropriate tools. " +
      "Always format transaction hashes and addresses in a user-friendly way.",
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