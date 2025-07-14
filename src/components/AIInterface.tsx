import React, { useState } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useBackendContext } from '../context/BackendContext';
import { useWallets } from '@privy-io/react-auth';
import { Header } from './Header';
import oniLogo from '../assets/logos.png';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const AIInterface: React.FC = () => {
  const { wallets } = useWallets();
  const privyWallet = wallets[0]?.address;
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { sendMessage } = useBackendContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading || !privyWallet) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: prompt.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsLoading(true);

    try {
      const response = await sendMessage(prompt.trim(), privyWallet);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Error: ${error instanceof Error ? error.message : 'An error occurred'}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen w-full bg-main-gradient font-mono text-text flex items-center justify-center p-4"> 
        <div className="relative bg-main-gradient rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
          {/* Oni logo background layer */}
          <img 
            src={oniLogo} 
            alt="Oni Logo Background" 
            className="absolute inset-0 w-3/4 h-3/4 object-contain opacity-10 m-auto pointer-events-none select-none"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 0 }}
          />
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700 relative z-10">
            <h2 className="text-xl font-semibold text-white">AI Chat Interface</h2>
            <button
              onClick={clearMessages}
              className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-8">
                <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Start chatting with the AI by sending a message below</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-blue-500/10 text-blue-200'
                        : 'bg-gray-800/50 text-gray-200'
                    }`}
                  >
                    {message.type === 'ai' ? (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            // Customize markdown components for better styling
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                            em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
                            code: ({ children }) => <code className="bg-gray-700 px-1 py-0.5 rounded text-sm font-mono text-green-400">{children}</code>,
                            pre: ({ children }) => <pre className="bg-gray-700 p-2 rounded text-sm font-mono text-green-400 overflow-x-auto mb-2">{children}</pre>,
                            ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="text-gray-200">{children}</li>,
                            a: ({ href, children }) => (
                              <a href={href} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">
                                {children}
                              </a>
                            ),
                            h1: ({ children }) => <h1 className="text-xl font-bold text-white mb-2">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-lg font-bold text-white mb-2">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-base font-bold text-white mb-2">{children}</h3>,
                            blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-600 pl-4 italic text-gray-300 mb-2">{children}</blockquote>,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-800/50 rounded-lg px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                    <span className="text-gray-400">Processing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <div className="p-4 border-t border-gray-700 relative z-10">
            <form onSubmit={handleSubmit} className="flex space-x-3">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                disabled={isLoading || !privyWallet}
              />
              <button
                type="submit"
                disabled={isLoading || !privyWallet}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
            
            {!privyWallet && (
              <p className="text-red-400 text-sm mt-2">
                Please connect your wallet to chat with the AI
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};