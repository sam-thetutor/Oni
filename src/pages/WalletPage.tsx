import React, { useState } from 'react';
import { Header } from '../components/Header';
import { WalletOverview } from '../components/WalletOverview';
import { TransactionHistory } from '../components/TransactionHistory';
import { QuickActions } from '../components/QuickActions';
import { useBackendWallet } from '../hooks/useBackendWallet';
import { usePaymentLinks, PaymentLinkData } from '../hooks/usePaymentLinks';
import { Wallet, Copy, ExternalLink, Trash2, Plus, RefreshCw, Filter, Link as LinkIcon } from 'lucide-react';

export const WalletPage = () => {
  const { backendWallet, loading } = useBackendWallet();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'actions' | 'payment-links'>('overview');
  
  // Payment Links functionality
  const {
    paymentLinks,
    stats,
    pagination,
    loading: paymentLinksLoading,
    error: paymentLinksError,
    fetchPaymentLinks,
    deletePaymentLink,
    nextPage,
    prevPage,
    goToPage,
    refresh
  } = usePaymentLinks();
  
  const [filter, setFilter] = useState<'all' | 'fixed' | 'global'>('all');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Handle filter change
  const handleFilterChange = (newFilter: 'all' | 'fixed' | 'global') => {
    setFilter(newFilter);
    fetchPaymentLinks(1, 10, newFilter);
  };

  // Copy to clipboard functionality
  const copyToClipboard = async (text: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(linkId);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Delete payment link
  const handleDelete = async (linkId: string) => {
    if (window.confirm('Are you sure you want to cancel this payment link?')) {
      const success = await deletePaymentLink(linkId);
      if (success) {
        refresh();
      }
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Wallet Overview */}
          <div className="lg:col-span-1">
            <WalletOverview walletAddress={backendWallet} />
          </div>

          {/* Right Column - Main Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
              <div className="flex border-b border-white/10">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-all ${
                    activeTab === 'overview'
                      ? 'text-white border-b-2 border-purple-500 bg-purple-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Wallet className="w-4 h-4" />
                    <span>Portfolio</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-all ${
                    activeTab === 'history'
                      ? 'text-white border-b-2 border-purple-500 bg-purple-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Transaction History
                </button>
                <button
                  onClick={() => setActiveTab('actions')}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-all ${
                    activeTab === 'actions'
                      ? 'text-white border-b-2 border-purple-500 bg-purple-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Quick Actions
                </button>
                <button
                  onClick={() => setActiveTab('payment-links')}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-all ${
                    activeTab === 'payment-links'
                      ? 'text-white border-b-2 border-purple-500 bg-purple-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <LinkIcon className="w-4 h-4" />
                    <span>Payment Links</span>
                  </div>
                </button>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <Wallet className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-400">Loading Oni wallet...</p>
                  </div>
                ) : activeTab === 'overview' ? (
                  <div className="text-center py-8">
                    <Wallet className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Wallet Overview</h3>
                    <p className="text-gray-400">
                      Your Oni wallet information is displayed in the left panel. Use the tabs above to view transaction history or perform quick actions.
                    </p>
                  </div>
                ) : activeTab === 'history' ? (
                  backendWallet ? (
                    <TransactionHistory walletAddress={backendWallet} />
                  ) : (
                    <div className="text-center py-8">
                      <Wallet className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-pulse" />
                      <p className="text-gray-400">Loading Oni wallet...</p>
                    </div>
                  )
                ) : activeTab === 'payment-links' ? (
                  <PaymentLinksContent 
                    paymentLinks={paymentLinks}
                    stats={stats}
                    pagination={pagination}
                    loading={paymentLinksLoading}
                    error={paymentLinksError}
                    filter={filter}
                    copySuccess={copySuccess}
                    handleFilterChange={handleFilterChange}
                    copyToClipboard={copyToClipboard}
                    handleDelete={handleDelete}
                    refresh={refresh}
                    nextPage={nextPage}
                    prevPage={prevPage}
                    goToPage={goToPage}
                  />
                ) : (
                  <QuickActions />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Payment Links Content Component
const PaymentLinksContent: React.FC<{
  paymentLinks: PaymentLinkData[];
  stats: any;
  pagination: any;
  loading: boolean;
  error: string | null;
  filter: 'all' | 'fixed' | 'global';
  copySuccess: string | null;
  handleFilterChange: (filter: 'all' | 'fixed' | 'global') => void;
  copyToClipboard: (text: string, linkId: string) => void;
  handleDelete: (linkId: string) => void;
  refresh: () => void;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
}> = ({
  paymentLinks,
  stats,
  pagination,
  loading,
  error,
  filter,
  copySuccess,
  handleFilterChange,
  copyToClipboard,
  handleDelete,
  refresh,
  nextPage,
  prevPage,
  goToPage
}) => {
  // Status badge component
  const StatusBadge = ({ status, blockchainStatus }: { status: string, blockchainStatus: string | null }) => {
    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'paid': return 'bg-blue-100 text-blue-800';
        case 'cancelled': return 'bg-gray-100 text-gray-800';
        default: return 'bg-yellow-100 text-yellow-800';
      }
    };

    const displayStatus = blockchainStatus || status;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(displayStatus)}`}>
        {displayStatus}
      </span>
    );
  };

  // Payment link card component
  const PaymentLinkCard = ({ link }: { link: PaymentLinkData }) => {
    const isGlobal = link.type === 'global';
    
    return (
      <div className="bg-white/5 rounded-lg border border-white/10 p-4 backdrop-blur-sm">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isGlobal ? 'bg-purple-100/20 text-purple-300' : 'bg-blue-100/20 text-blue-300'
            }`}>
              {isGlobal ? 'Global' : 'Fixed'}
            </span>
            <StatusBadge status={link.status} blockchainStatus={link.blockchainStatus} />
          </div>
          <button
            onClick={() => handleDelete(link.linkId)}
            className="text-red-400 hover:text-red-300 transition-colors"
            title="Cancel Payment Link"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-400">Link ID</p>
            <p className="font-mono text-sm text-white">{link.linkId}</p>
          </div>

          {!isGlobal && (
            <div>
              <p className="text-xs text-gray-400">Amount</p>
              <p className="text-sm font-semibold text-white">{link.amount} XFI</p>
            </div>
          )}

          {isGlobal && link.onChainData && (
            <div>
              <p className="text-xs text-gray-400">Total Contributions</p>
              <p className="text-sm font-semibold text-white">{link.onChainData.totalContributionsInXFI || 0} XFI</p>
            </div>
          )}

          <div>
            <p className="text-xs text-gray-400">Created</p>
            <p className="text-xs text-gray-300">{new Date(link.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="flex space-x-2 mt-3">
            <button
              onClick={() => copyToClipboard(link.shareableUrl, link.linkId)}
              className="flex-1 flex items-center justify-center space-x-1 px-2 py-1 bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
            >
              <Copy size={12} />
              <span className="text-xs">
                {copySuccess === link.linkId ? 'Copied!' : 'Copy'}
              </span>
            </button>
            <a
              href={link.shareableUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-2 py-1 bg-purple-500/20 text-purple-300 rounded hover:bg-purple-500/30 transition-colors"
            >
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    );
  };

  if (loading && paymentLinks.length === 0) {
    return (
      <div className="text-center py-8">
        <LinkIcon className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-pulse" />
        <p className="text-gray-400">Loading payment links...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">My Payment Links</h3>
        <button
          onClick={refresh}
          className="flex items-center space-x-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded hover:bg-purple-500/30 transition-colors"
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span className="text-sm">Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <p className="text-xs text-gray-400">Total Links</p>
            <p className="text-lg font-bold text-white">{stats.totalLinks}</p>
          </div>
          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <p className="text-xs text-gray-400">Fixed Links</p>
            <p className="text-lg font-bold text-blue-300">{stats.fixedLinks.count}</p>
            <p className="text-xs text-gray-500">{stats.fixedLinks.totalAmount} XFI</p>
          </div>
          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <p className="text-xs text-gray-400">Global Links</p>
            <p className="text-lg font-bold text-purple-300">{stats.globalLinks.count}</p>
            <p className="text-xs text-gray-500">{stats.globalLinks.totalContributions} XFI</p>
          </div>
          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <p className="text-xs text-gray-400">Active Links</p>
            <p className="text-lg font-bold text-green-300">
              {stats.fixedLinks.activeCount + stats.globalLinks.activeCount}
            </p>
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="flex items-center space-x-2">
        <Filter size={14} className="text-gray-400" />
        <span className="text-xs text-gray-400">Filter:</span>
        <div className="flex space-x-1">
          {['all', 'fixed', 'global'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => handleFilterChange(filterType as 'all' | 'fixed' | 'global')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                filter === filterType
                  ? 'bg-purple-500/30 text-purple-200'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {/* Payment Links Grid */}
      {paymentLinks.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentLinks.map((link) => (
              <PaymentLinkCard key={link._id} link={link} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={prevPage}
                disabled={!pagination.hasPrevPage}
                className="px-2 py-1 bg-white/10 text-gray-300 rounded text-sm hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              
              <div className="flex space-x-1">
                {[...Array(Math.min(pagination.totalPages, 5))].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-2 py-1 rounded text-sm ${
                        pagination.page === page
                          ? 'bg-purple-500/30 text-purple-200'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={nextPage}
                disabled={!pagination.hasNextPage}
                className="px-2 py-1 bg-white/10 text-gray-300 rounded text-sm hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        !loading && (
          <div className="text-center py-8">
            <Plus size={32} className="mx-auto text-gray-400 mb-4" />
            <h4 className="text-sm font-medium text-white mb-2">No payment links found</h4>
            <p className="text-xs text-gray-400 mb-4">
              Create your first payment link to get started!
            </p>
            <p className="text-xs text-gray-500">
              Use the AI interface to create fixed or global payment links.
            </p>
          </div>
        )
      )}
         </div>
   );
 }; 