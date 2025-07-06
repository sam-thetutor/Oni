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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-main-gradient font-mono text-text rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden">
        {/* Oni logo background layer */}
        <img 
          src={oniLogo} 
          alt="Oni Logo Background" 
          className="absolute inset-0 w-3/4 h-3/4 object-contain opacity-10 m-auto pointer-events-none select-none"
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 0 }}
        />
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 relative z-10">
          <h2 className="text-xl font-semibold text-white">Oni Chat</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearMessages}
              className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
            >
              Clear
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              {/* <img src={oniLogo} alt="Oni" className="w-16 h-16 mx-auto mb-4 opacity-50" /> */}
              <p>Start chatting with Oni</p>
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
                    <img src={oniLogo} alt="Oni" className="w-8 h-8 text-white" />
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-blue-500/10 text-blue-200'
                      : 'bg-gray-800/50 text-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
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
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                <img 
                  src={oniLogo} 
                  alt="Oni Logo Processing" 
                  className="w-8 h-8 animate-pulse drop-shadow-[0_0_8px_rgba(0,234,255,0.7)]" 
                  style={{ filter: 'drop-shadow(0 0 12px #00eaff)' }}
                />
              </div>
              <div className="bg-gray-800/50 rounded-lg px-4 py-3 flex items-center space-x-2">
                <span className="text-gray-400">Oni is thinking...</span>
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
              placeholder="Enter your test prompt here..."
              className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              disabled={isLoading || !privyWallet}
            />
            <button
              type="submit"
              disabled={isLoading || !privyWallet}
              className="px-3 py-3 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <img 
                  src={oniLogo} 
                  alt="Oni Logo Loading" 
                  className="w-8 h-8 animate-pulse drop-shadow-[0_0_8px_rgba(0,234,255,0.7)]" 
                  style={{ filter: 'drop-shadow(0 0 12px #00eaff)' }}
                />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
          
          {!privyWallet && (
            <p className="text-red-400 text-sm mt-2">
              Please connect your wallet to test the backend
            </p>
          )}
        </div>
      </div>
    </div>
  );
}; 