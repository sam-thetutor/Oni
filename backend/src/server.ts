import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { graph } from "./index.js";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { memoryStore } from "./memory.js";
import { authenticateToken, requireWalletConnection } from "./middleware/auth.js";
import { connectDB } from "./db/connect.js";
import contractRoutes from "./routes/contract.js";
import gamificationRoutes from "./routes/gamification.js";

config();

const app = express();
const port = process.env.PORT || 3030;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Contract routes
app.use('/api/contract', contractRoutes);

// Gamification routes
app.use('/api/gamification', gamificationRoutes);

// Message route with authentication
app.post("/message", 
  authenticateToken,
  requireWalletConnection,
  async (req, res) => {
    try {
      const { message } = req.body;
      const user = (req as any).user;

      console.log("Message from authenticated user:", message);
      console.log("User ID:", user.id);
      console.log("Wallet address:", user.walletAddress);
      console.log("Database user exists:", !!user.dbUser);

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Get existing chat history for this user using wallet address as ID
      const chatHistory = memoryStore.getHistory(user.walletAddress);

      // Add user message to chat history
      chatHistory.push(new HumanMessage(message));

      console.log("Invoking graph with userId:", user.walletAddress);

      // Invoke the graph with the updated chat history and user context
      const result = await graph.invoke({
        messages: chatHistory,
        userId: user.walletAddress,
      });

      // Extract the last AI message from the result
      const aiMessages = result.messages.filter(
        (msg: any) => msg._getType() === "ai"
      );
      const lastAIMessage = aiMessages[aiMessages.length - 1];

      // Save updated conversation history
      memoryStore.saveHistory(user.walletAddress, result.messages);

      console.log("AI response:", lastAIMessage.content);

      // Send response with full conversation history
      res.json({
        response: lastAIMessage.content,
        history: result.messages.map((msg: any) => ({
          type: msg._getType(),
          content: msg.content
        }))
      });
    } catch (error: any) {
      console.error("Error processing message:", error);
      res.status(500).json({
        error: "Error processing message",
        details: error.message,
      });
    }
  }
);

// Clear conversation history (authenticated)
app.post("/clear", authenticateToken, (req, res) => {
  const user = (req as any).user;
  memoryStore.clearHistory(user.walletAddress);
  res.json({ status: "ok" });
});

// Get conversation history (authenticated)
app.get("/history", authenticateToken, (req, res) => {
  const user = (req as any).user;
  const history = memoryStore.getHistory(user.walletAddress);
  res.json({
    history: history.map((msg: any) => ({
      type: msg._getType(),
      content: msg.content
    }))
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 