import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, RotateCcw, Clock, CheckCircle, XCircle, ExternalLink, Filter } from 'lucide-react';
import { Wallet, Transaction } from '../types/wallet';
  import { useWallets } from '@privy-io/react-auth';

export const TransactionHistory= () => {
  const {wallets} = useWallets();
  const wallet = wallets[0];
  const [filter, setFilter] = useState<'all' | 'send' | 'receive' | 'swap'>('all');

  // Mock transaction data
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'send',
      amount: 0.5,
      token: 'ETH',
      fromAddress: wallet.address,
      toAddress: '0xAbC123456789dEf012345678901234567890AbCd',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'confirmed',
      hash: '0x1234567890abcdef1234567890abcdef12345678',
      gasUsed: 21000,
      gasPrice: 20,
    },
    {
      id: '2',
      type: 'receive',
      amount: 250,
      token: 'USDC',
      fromAddress: '0xDef987654321AbC987654321098765432109876',
      toAddress: wallet.address,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: 'confirmed',
      hash: '0xabcdef1234567890abcdef1234567890abcdef12',
    },
    {
      id: '3',
      type: 'swap',
      amount: 100,
      token: 'USDT → ETH',
      fromAddress: wallet.address,
      toAddress: wallet.address,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'confirmed',
      hash: '0x9876543210fedcba9876543210fedcba98765432',
      gasUsed: 85000,
      gasPrice: 25,
    },
    {
      id: '4',
      type: 'send',
      amount: 0.02,
      token: 'ETH',
      fromAddress: wallet.address,
      toAddress: '0x123456789AbCdEf123456789aBcDeF1234567890',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      status: 'pending',
      hash: '0xfedcba0987654321fedcba0987654321fedcba09',
      gasUsed: 21000,
      gasPrice: 18,
    },
  ];

  const filteredTransactions = mockTransactions.filter(tx => 
    filter === 'all' || tx.type === filter
  );

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'send':
        return <ArrowUpRight className="w-5 h-5 text-red-400" />;
      case 'receive':
        return <ArrowDownLeft className="w-5 h-5 text-green-400" />;
      case 'swap':
        return <RotateCcw className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const getTransactionTitle = (tx: Transaction) => {
    switch (tx.type) {
      case 'send':
        return `Sent ${tx.amount} ${tx.token}`;
      case 'receive':
        return `Received ${tx.amount} ${tx.token}`;
      case 'swap':
        return `Swapped ${tx.token}`;
    }
  };

  const getTransactionDescription = (tx: Transaction) => {
    switch (tx.type) {
      case 'send':
        return `To ${tx.toAddress.slice(0, 10)}...${tx.toAddress.slice(-6)}`;
      case 'receive':
        return `From ${tx.fromAddress.slice(0, 10)}...${tx.fromAddress.slice(-6)}`;
      case 'swap':
        return `Via Uniswap Protocol`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
        {[
          { key: 'all', label: 'All' },
          { key: 'send', label: 'Sent' },
          { key: 'receive', label: 'Received' },
          { key: 'swap', label: 'Swapped' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              filter === key
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No transactions found for the selected filter.</p>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-gray-800/30 rounded-lg p-4 hover:bg-gray-800/50 transition-all duration-200 border border-gray-700/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gray-700/50 rounded-full">
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-white">{getTransactionTitle(tx)}</h3>
                      {getStatusIcon(tx.status)}
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{getTransactionDescription(tx)}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{formatTimeAgo(tx.timestamp)}</span>
                      {tx.gasUsed && (
                        <span>Gas: {tx.gasUsed.toLocaleString()}</span>
                      )}
                      <span className="capitalize">{tx.status}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`font-medium ${
                    tx.type === 'send' ? 'text-red-400' : 
                    tx.type === 'receive' ? 'text-green-400' : 'text-blue-400'
                  }`}>
                    {tx.type === 'send' ? '-' : tx.type === 'receive' ? '+' : ''}
                    {tx.amount} {tx.token.split(' ')[0]}
                  </div>
                  <button className="mt-2 flex items-center space-x-1 text-purple-400 hover:text-purple-300 text-xs transition-colors">
                    <ExternalLink className="w-3 h-3" />
                    <span>View on Explorer</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredTransactions.length > 0 && (
        <div className="text-center">
          <button className="px-6 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-lg transition-all duration-200 border border-gray-600">
            Load More Transactions
          </button>
        </div>
      )}
    </div>
  );
};