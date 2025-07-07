import React, { useState } from 'react';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="relative bg-main-gradient font-mono text-text rounded-lg shadow-xl w-full max-w-xs sm:max-w-lg md:max-w-2xl h-[90vh] sm:h-[85vh] md:h-[600px] flex flex-col overflow-hidden">
        {/* Oni logo background layer */}
        <img 
          src={oniLogo} 
          alt="Oni Logo Background" 
          className="absolute inset-0 w-1/2 h-1/2 sm:w-3/4 sm:h-3/4 object-contain opacity-10 m-auto pointer-events-none select-none"
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 0 }}
        />
        
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-700 relative z-10">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Oni Chat</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearMessages}
              className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
            >
              Clear
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 relative z-10">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-4 sm:mt-8">
              <p className="text-sm sm:text-base">Start chatting with Oni</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 sm:space-x-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'ai' && (
                  <img src={oniLogo} alt="Oni" className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" />
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[80%] md:max-w-[75%] rounded-lg px-3 py-2 sm:px-4 sm:py-3 ${
                    message.type === 'user'
                      ? 'bg-blue-500/10 text-blue-200'
                      : 'bg-gray-800/50 text-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm sm:text-base break-words">{message.content}</p>
                  <p className="text-xs text-gray-500 mt-1 sm:mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.type === 'user' && (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                )}
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0">
                <img 
                  src={oniLogo} 
                  alt="Oni Logo Processing" 
                  className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse drop-shadow-[0_0_8px_rgba(0,234,255,0.7)]" 
                  style={{ filter: 'drop-shadow(0 0 12px #00eaff)' }}
                />
              </div>
              <div className="bg-gray-800/50 rounded-lg px-3 py-2 sm:px-4 sm:py-3 flex items-center space-x-2">
                <span className="text-gray-400 text-sm sm:text-base">Oni is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="p-3 sm:p-4 border-t border-gray-700 relative z-10">
          <form onSubmit={handleSubmit} className="flex space-x-2 sm:space-x-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your message..."
              className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm sm:text-base"
              disabled={isLoading || !privyWallet}
            />
            <button
              type="submit"
              disabled={isLoading || !privyWallet}
              className="px-2 py-2 sm:px-3 sm:py-3 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
            >
              {isLoading ? (
                <img 
                  src={oniLogo} 
                  alt="Oni Logo Loading" 
                  className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse drop-shadow-[0_0_8px_rgba(0,234,255,0.7)]" 
                  style={{ filter: 'drop-shadow(0 0 12px #00eaff)' }}
                />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </form>
          
          {!privyWallet && (
            <p className="text-red-400 text-xs sm:text-sm mt-2">
              Please connect your wallet to test the backend
            </p>
          )}
        </div>
      </div>
    </div>
  );
}; 