import React, { useState } from 'react';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useBackendContext } from '../context/BackendContext';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import oniLogo from '../assets/logos.png';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestModal: React.FC<TestModalProps> = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="relative bg-black/20 backdrop-blur-xl border-2 border-green-400/30 font-mono text-text rounded-xl shadow-xl w-full max-w-xs sm:max-w-lg md:max-w-2xl h-[90vh] sm:h-[85vh] md:h-[600px] flex flex-col overflow-hidden">
        {/* Oni logo background layer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
          <img 
            src={oniLogo} 
            alt="Oni Logo Background" 
            className="w-1/2 h-1/2 sm:w-3/4 sm:h-3/4 object-contain opacity-30"
            onError={(e) => console.error('Logo failed to load:', e)}
            onLoad={() => console.log('Logo loaded successfully')}
          />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-green-400/30 relative z-10">
          <h2 className="text-xl font-semibold text-green-400 font-mono">Oni Chat</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearMessages}
              className="px-3 py-1 text-sm bg-green-400/10 hover:bg-green-400/20 border border-green-400/30 text-green-400 rounded-lg transition-all duration-200 font-mono"
            >
              Clear
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-green-400/10 rounded-lg transition-all duration-200"
            >
              <X className="w-5 h-5 text-green-400" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
          {messages.length === 0 ? (
            <div className="text-center text-green-300 mt-8 font-mono">
              <p className="text-lg">Start chatting with Oni</p>
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
                  <img src={oniLogo} alt="Oni" className="w-8 h-8 text-white flex-shrink-0" />
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[80%] md:max-w-[75%] rounded-xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-green-400/10 border-2 border-green-400/30 text-green-300'
                      : 'bg-black/20 backdrop-blur-xl border-2 border-green-400/20 text-green-300'
                  }`}
                >
                  {message.type === 'ai' ? (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          // Customize markdown components for better styling
                          p: ({ children }) => <p className="mb-2 last:mb-0 text-sm sm:text-base font-mono">{children}</p>,
                          strong: ({ children }) => <strong className="font-bold text-green-400">{children}</strong>,
                          em: ({ children }) => <em className="italic text-green-300">{children}</em>,
                          code: ({ children }) => <code className="bg-black/40 px-1 py-0.5 rounded text-xs sm:text-sm font-mono text-green-400 border border-green-400/30">{children}</code>,
                          pre: ({ children }) => <pre className="bg-black/40 p-2 rounded text-xs sm:text-sm font-mono text-green-400 overflow-x-auto mb-2 border border-green-400/30">{children}</pre>,
                          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="text-green-300 text-sm sm:text-base font-mono">{children}</li>,
                          a: ({ href, children }) => (
                            <a href={href} className="text-green-400 hover:text-green-300 underline" target="_blank" rel="noopener noreferrer">
                              {children}
                            </a>
                          ),
                          h1: ({ children }) => <h1 className="text-lg sm:text-xl font-bold text-green-400 mb-2 font-mono">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-base sm:text-lg font-bold text-green-400 mb-2 font-mono">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-sm sm:text-base font-bold text-green-400 mb-2 font-mono">{children}</h3>,
                          blockquote: ({ children }) => <blockquote className="border-l-4 border-green-400/30 pl-4 italic text-green-300 mb-2 font-mono">{children}</blockquote>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap text-sm sm:text-base break-words font-mono">{message.content}</p>
                  )}
                  <p className="text-xs text-green-300/60 mt-2 font-mono">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-green-400/20 border-2 border-green-400/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-green-400" />
                  </div>
                )}
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                <img 
                  src={oniLogo} 
                  alt="Oni Logo Processing" 
                  className="w-8 h-8 animate-pulse drop-shadow-[0_0_8px_rgba(0,255,0,0.7)]" 
                  style={{ filter: 'drop-shadow(0 0 12px #00ff00)' }}
                />
              </div>
              <div className="bg-black/20 backdrop-blur-xl border-2 border-green-400/20 rounded-xl px-4 py-3 flex items-center space-x-2">
                <span className="text-green-300 text-sm sm:text-base font-mono">Oni is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="p-4 border-t-2 border-green-400/30 relative z-10">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your message..."
              className="flex-1 px-4 py-3 bg-black/20 backdrop-blur-xl border-2 border-green-400/30 rounded-xl text-green-300 placeholder-green-300/60 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 text-sm sm:text-base font-mono"
              disabled={isLoading || !privyWallet}
            />
            <button
              type="submit"
              disabled={isLoading || !privyWallet}
              className="px-4 py-3 bg-green-400/10 hover:bg-green-400/20 border-2 border-green-400/30 text-green-400 font-medium rounded-xl hover:border-green-400 focus:ring-4 focus:ring-green-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
            >
              {isLoading ? (
                <img 
                  src={oniLogo} 
                  alt="Oni Logo Loading" 
                  className="w-6 h-6 animate-pulse drop-shadow-[0_0_8px_rgba(0,255,0,0.7)]" 
                  style={{ filter: 'drop-shadow(0 0 12px #00ff00)' }}
                />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
          
          {!privyWallet && (
            <p className="text-red-400 text-sm mt-2 font-mono">
              Please connect your wallet to test the backend
            </p>
          )}
        </div>
      </div>
    </div>
  );
}; 