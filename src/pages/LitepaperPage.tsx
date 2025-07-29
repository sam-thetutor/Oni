import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Header } from '../components/Header';

export const LitepaperPage: React.FC = () => {
  const readmeContent = `# Oni: AI-Powered DeFi Platform

> If you can prompt, you can DeFi

Oni is a revolutionary AI-powered DeFi platform that democratizes access to the CrossFi blockchain through intelligent conversational interfaces. Our mission is to make complex DeFi operations as simple as having a conversation.

## 🎯 Problem Statement

### The DeFi Accessibility Challenge

- **Complex Smart Contract Interactions:** Traditional DeFi platforms require users to understand intricate technical concepts, smart contract interactions, and blockchain mechanics. This creates a significant barrier for non-technical users who want to participate in DeFi on CrossFi.
- **Steep Learning Curve:** Users face specialized interfaces, must understand gas fees, slippage, liquidity pools, and other DeFi concepts, which limits mainstream adoption of CrossFi DeFi applications.
- **High Risk of User Errors:** Manual execution of transactions leaves room for costly mistakes—errors in addresses, amounts, failed transactions, and lost funds.
- **Limited Natural Language Integration:** Current DeFi tools do not leverage natural language processing, forcing users to adapt to technical interfaces instead of letting technology adapt to human communication.

### Market Opportunity

- **Growing CrossFi Ecosystem:** The CrossFi blockchain is experiencing rapid expansion with new DeFi protocols, increasing the demand for accessible tools that bridge technical complexity with user-friendly experiences.
- **AI-Powered DeFi Gap:** While AI has transformed many industries, DeFi remains largely manual and technical. There is a significant opportunity to create AI agents that can understand and execute DeFi operations through natural language prompts.
- **Democratization of DeFi:** There is a clear need for platforms that enable the 99% of users—those without technical backgrounds—to participate in the DeFi revolution.

## 🛠 Solution

Oni introduces an AI-powered platform where anyone can interact with DeFi protocols on the CrossFi blockchain using natural language prompts. By leveraging advanced AI, Oni interprets user intent and automates the corresponding DeFi operations, radically lowering the barrier to entry and reducing user errors.

## 🚀 Core Features

- **Prompt-Based DeFi:**  
  Seamlessly interact with DeFi directly through natural language prompts (e.g., "Send 2 ETH to Bob" or "Show my balance").
- **Wallet Management:**  
  - Check wallet balances  
  - View wallet address  
  - Generate and share payment links  
  - Review transaction history
- **Transaction Capabilities:**  
  - Send tokens to users or arbitrary addresses  
  - Swap tokens across integrated decentralized exchanges  
  - Generate, send, and track payment/request links
- **Dollar Cost Averaging (DCA) Positions:**  
  - Create DCA investment strategies using natural language prompts, e.g., "Buy 30 dollars worth of XFI tokens using USDT when XFI hits 0.5"
- **Security:**  
  - AI-driven actions tightly constrained by smart contracts  
  - No seed phrase exposure; secure authentication and wallet access
- **Conversational UI:**  
  - Fully web-based (React/TypeScript) prompt-driven experience for cross-platform accessibility

## 🧩 Technical Architecture

| Layer            | Technology Stack                          | Description                                                                |
|------------------|-----------------------------------------|----------------------------------------------------------------------------|
| Frontend         | React, TypeScript                       | Conversational web UI for user interactions                                |
| AI & Intent      | LangGraph AI                           | Processes prompts, extracts intent, maps to blockchain ops including DCA strategies |
| Backend          | Node.js, Express.js                    | Handles core business logic, schedules and manages DCA orders, and API coordination |
| Blockchain       | Solidity (Smart Contracts)             | Executes secure DeFi operations on CrossFi, including DCA functionality via smart contracts |
| Scheduling Service| High frequency cron jobs | Manages automated execution of DCA trades based on market conditions       |
| Security Layer   | Access controls, session management    | Ensures operation safety, user isolation, and integrity                    |

### System Flow

1. **User Prompt** (web app):  
   User enters a natural language instruction, such as creating DCA positions (e.g., "Buy 30 dollars worth of XFI tokens using USDT when XFI hits 0.5").
2. **Intent Processing** (LangGraph AI):  
   AI parses the request, identifies it as a DCA order, extracts parameters (amount, tokens, trigger price).
3. **Backend Coordination** (Node.js/Express):  
   Validates and schedules the DCA position, managing order parameters and creating jobs for execution when conditions meet.
4. **Scheduled Monitoring & Execution:**  
   A scheduling service continuously monitors market prices and triggers smart contract interactions to execute DCA trades when conditions are met.
5. **Smart Contract Invocation:**  
   Blockchain operations executed via Solidity contracts on CrossFi and web3 APIs to carry out the trades.
6. **Results Returned:**  
   Execution status and updates are relayed back to the user interface in real-time.

## ❤️ Built for the CrossFi Ecosystem

Oni is designed from the ground up for the CrossFi blockchain. Our goal is to bridge technology and people—so that, truly, **if you can prompt, you can DeFi.**
`;

  return (
    <div className="min-h-screen relative">
      <Header />
      {/* Hero Section */}
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
                               <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-mono">
                     Litepaper
                   </h1>
                   <p className="text-xl text-green-300 max-w-3xl mx-auto font-mono">
                     AI powered DeFi platform - If you can prompt, you can DeFi
                   </p>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex items-center space-x-2 px-6 py-3 bg-green-400/10 border-2 border-green-400/30 rounded-xl text-green-400 font-mono">
                <span>Version 1.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* README Content */}
      <div className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-black/20 backdrop-blur-xl border-2 border-green-400/30 rounded-2xl p-8">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-4xl font-bold text-green-400 mb-6 font-mono">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-3xl font-bold text-green-400 mb-4 mt-8 font-mono">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-2xl font-semibold text-green-400 mb-3 mt-6 font-mono">{children}</h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-xl font-semibold text-green-400 mb-2 mt-4 font-mono">{children}</h4>
                  ),
                  p: ({ children }) => (
                    <p className="text-green-300 mb-4 leading-relaxed font-mono">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-green-300 mb-4 space-y-2 font-mono">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-green-300 mb-4 space-y-2 font-mono">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-green-300 font-mono">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-green-400 pl-4 italic text-green-300 mb-4 font-mono">{children}</blockquote>
                  ),
                  code: ({ children, className }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                      <SyntaxHighlighter
                        style={tomorrow}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg mb-4 font-mono"
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-green-400/10 text-green-400 px-2 py-1 rounded font-mono">{children}</code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre className="bg-black/20 border border-green-400/30 rounded-lg p-4 overflow-x-auto mb-4 font-mono">{children}</pre>
                  ),
                  a: ({ children, href }) => (
                    <a href={href} className="text-green-400 hover:text-green-300 underline font-mono" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-green-400 font-mono">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-green-300 font-mono">{children}</em>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto mb-4">
                      <table className="min-w-full border border-green-400/30 rounded-lg font-mono">{children}</table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-green-400/30 px-4 py-2 text-green-400 font-semibold">{children}</th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-green-400/30 px-4 py-2 text-green-300">{children}</td>
                  ),
                  hr: () => (
                    <hr className="border-green-400/30 my-8" />
                  ),
                }}
              >
                {readmeContent}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 