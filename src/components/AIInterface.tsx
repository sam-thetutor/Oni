import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Wallet, AICommand } from '../types/wallet';
import { useBackendContext } from '../context/BackendContext';

interface AIInterfaceProps {
  wallet: Wallet;
}

export const AIInterface: React.FC<AIInterfaceProps> = ({ wallet }) => {
  const [prompt, setPrompt] = useState('');
  const [commands, setCommands] = useState<AICommand[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { loading, error, sendMessage } = useBackendContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [commands]);

  const executeCommand = async (command: AICommand) => {
    try {
      console.log("command  cccc", command);
      const response = await sendMessage(command.prompt);
      
      setCommands(prev => prev.map(cmd => 
        cmd.id === command.id 
          ? { 
              ...cmd, 
              status: 'completed', 
              result: response 
            }
          : cmd
      ));
    } catch (err) {
      setCommands(prev => prev.map(cmd => 
        cmd.id === command.id 
          ? { 
              ...cmd, 
              status: 'error', 
              result: err instanceof Error ? err.message : 'An error occurred' 
            }
          : cmd
      ));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const newCommand: AICommand = {
      id: Date.now().toString(),
      prompt: prompt.trim(),
      timestamp: new Date(),
      status: 'processing',
    };
    console.log("newCommand", newCommand);

    setCommands(prev => [...prev, newCommand]);
    setPrompt('');
    
    await executeCommand(newCommand);
  };

  const getStatusIcon = (status: AICommand['status']) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const examplePrompts = [
    "Check my wallet balance",
    "Send 10 CFI to 0x742d35Cc6754C1532B8b5C1A4C1A5a5C4F5E5E5E",
    "Show my transaction history",
    "What's my USDC balance?",
  ];

  return (
    <div className="h-[600px] flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {commands.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">AI Assistant Ready</h3>
            <p className="text-gray-400 mb-6">
              Ask me to check balances, send tokens, or view transaction history.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-300 mb-3">Try these examples:</p>
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="block w-full text-left p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-sm text-gray-300 hover:text-white transition-all duration-200"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          commands.map((command) => (
            <div key={command.id} className="space-y-4">
              {/* User Message */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="bg-blue-500/10 rounded-lg px-4 py-3 max-w-[80%]">
                  <p className="text-blue-200">{command.prompt}</p>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-800/50 rounded-lg px-4 py-3 max-w-[80%] flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(command.status)}
                    <span className="text-sm text-gray-400 capitalize">{command.status}</span>
                  </div>
                  {command.result ? (
                    <p className="text-gray-200">{command.result}</p>
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-400">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="ml-2">Processing...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask me to check balances, send tokens, or view transaction history..."
          className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!prompt.trim() || loading}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
};