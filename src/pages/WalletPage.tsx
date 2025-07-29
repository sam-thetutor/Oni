import React, { useState } from 'react';
import { Header } from '../components/Header';
// import { WalletOverview } from '../components/WalletOverview';
import { TransactionHistory } from '../components/TransactionHistory';
import { QuickActions } from '../components/QuickActions';
import { DCAOrders } from '../components/DCAOrders';
import { Portfolio } from '../components/Portfolio';
import { useBackendWallet } from '../hooks/useBackendWallet';
import { usePaymentLinks, PaymentLinkData } from '../hooks/usePaymentLinks';
import { useWebSocket } from '../context/WebSocketContext';
import { Wallet, Copy, ExternalLink, Trash2, RefreshCw, Filter, Link as LinkIcon, History, Zap, TrendingUp } from 'lucide-react';
import { WalletOverview } from '../components/WalletOverview';

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
        case 'active': return 'bg-green-400/20 text-green-300 border-green-400/30';
        case 'paid': return 'bg-green-400/20 text-green-300 border-green-400/30';
        case 'cancelled': return 'bg-red-400/20 text-red-300 border-red-400/30';
        default: return 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30';
      }
    };

    const displayStatus = blockchainStatus || status;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(displayStatus)}`}>
        {displayStatus}
      </span>
    );
  };

  // Payment link card component
  const PaymentLinkCard = ({ link }: { link: PaymentLinkData }) => {
    const isGlobal = link.type === 'global';
    
    return (
      <div className="bg-black/20 backdrop-blur-xl rounded-xl border-2 border-green-400/30 p-4 font-mono">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2 flex-wrap gap-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
              isGlobal ? 'bg-green-400/20 text-green-300 border-green-400/30' : 'bg-blue-400/20 text-blue-300 border-blue-400/30'
            }`}>
              {isGlobal ? 'Global' : 'Fixed'}
            </span>
            <StatusBadge status={link.status} blockchainStatus={link.blockchainStatus} />
          </div>
          <button
            onClick={() => handleDelete(link.linkId)}
            className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0 p-1"
            title="Cancel Payment Link"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-green-300/60">Link ID</p>
            <p className="font-mono text-xs sm:text-sm text-green-300 break-all">{link.linkId}</p>
          </div>

          {!isGlobal && (
            <div>
              <p className="text-xs text-green-300/60">Amount</p>
              <p className="text-sm font-semibold text-green-400">{link.amount} XFI</p>
            </div>
          )}

          {isGlobal && link.onChainData && (
            <div>
              <p className="text-xs text-green-300/60">Total Contributions</p>
              <p className="text-sm font-semibold text-green-400">{link.onChainData.totalContributionsInXFI || 0} XFI</p>
            </div>
          )}

          <div>
            <p className="text-xs text-green-300/60">Created</p>
            <p className="text-xs text-green-300">{new Date(link.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="flex space-x-2 mt-3">
            <button
              onClick={() => copyToClipboard(link.shareableUrl, link.linkId)}
              className="flex-1 flex items-center justify-center space-x-1 px-2 py-2 bg-green-400/10 hover:bg-green-400/20 border border-green-400/30 text-green-400 rounded-lg transition-all duration-200"
            >
              <Copy size={12} />
              <span className="text-xs font-mono">
                {copySuccess === link.linkId ? 'Copied!' : 'Copy'}
              </span>
            </button>
            <a
              href={link.shareableUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-3 py-2 bg-green-400/10 hover:bg-green-400/20 border border-green-400/30 text-green-400 rounded-lg transition-all duration-200"
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
        <LinkIcon className="w-12 h-12 text-green-400 mx-auto mb-4 animate-pulse" />
        <p className="text-base text-green-300 font-mono">Loading payment links...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-green-400 font-mono">My Payment Links</h3>
        <button
          onClick={refresh}
          className="flex items-center space-x-2 px-3 py-2 bg-green-400/10 hover:bg-green-400/20 border border-green-400/30 text-green-400 rounded-lg transition-all duration-200 font-mono"
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span className="text-sm">Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-black/20 backdrop-blur-xl p-4 rounded-xl border-2 border-green-400/30">
            <p className="text-xs text-green-300/60 font-mono">Total Links</p>
            <p className="text-lg font-bold text-green-400 font-mono">{stats.totalLinks}</p>
          </div>
          <div className="bg-black/20 backdrop-blur-xl p-4 rounded-xl border-2 border-green-400/30">
            <p className="text-xs text-green-300/60 font-mono">Fixed Links</p>
            <p className="text-lg font-bold text-blue-300 font-mono">{stats.fixedLinks.count}</p>
            <p className="text-xs text-green-300/60 font-mono">{stats.fixedLinks.totalAmount} XFI</p>
          </div>
          <div className="bg-black/20 backdrop-blur-xl p-4 rounded-xl border-2 border-green-400/30">
            <p className="text-xs text-green-300/60 font-mono">Global Links</p>
            <p className="text-lg font-bold text-green-300 font-mono">{stats.globalLinks.count}</p>
            <p className="text-xs text-green-300/60 font-mono">{stats.globalLinks.totalContributions} XFI</p>
          </div>
          <div className="bg-black/20 backdrop-blur-xl p-4 rounded-xl border-2 border-green-400/30">
            <p className="text-xs text-green-300/60 font-mono">Active Links</p>
            <p className="text-lg font-bold text-green-400 font-mono">
              {stats.fixedLinks.activeCount + stats.globalLinks.activeCount}
            </p>
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-2">
          <Filter size={14} className="text-green-400" />
          <span className="text-sm text-green-300 font-mono">Filter:</span>
        </div>
        <div className="flex space-x-2">
          {['all', 'fixed', 'global'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => handleFilterChange(filterType as 'all' | 'fixed' | 'global')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 font-mono ${
                filter === filterType
                  ? 'bg-green-400/20 text-green-400 border border-green-400/30'
                  : 'bg-black/20 backdrop-blur-xl text-green-300 hover:bg-green-400/10 border border-green-400/20'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-400/10 border-2 border-red-400/30 rounded-xl p-4">
          <p className="text-red-400 text-sm font-mono">{error}</p>
        </div>
      )}

      {/* Payment Links Grid */}
      {!loading && paymentLinks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paymentLinks.map((link) => (
            <PaymentLinkCard key={link.linkId} link={link} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && paymentLinks.length === 0 && (
        <div className="text-center py-8">
          <LinkIcon className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <p className="text-green-300 font-mono">No payment links found</p>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-3 mt-6">
          <button
            onClick={prevPage}
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 bg-black/20 backdrop-blur-xl text-green-400 rounded-lg hover:bg-green-400/10 border border-green-400/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-mono"
          >
            Previous
          </button>
          
          <div className="flex space-x-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-4 py-2 rounded-lg text-sm font-mono transition-all duration-200 ${
                  page === pagination.currentPage
                    ? 'bg-green-400/20 text-green-400 border border-green-400/30'
                    : 'bg-black/20 backdrop-blur-xl text-green-300 hover:bg-green-400/10 border border-green-400/20'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={nextPage}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-4 py-2 bg-black/20 backdrop-blur-xl text-green-400 rounded-lg hover:bg-green-400/10 border border-green-400/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-mono"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export const WalletPage = () => {
  const { backendWallet, loading } = useBackendWallet();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'actions' | 'payment-links' | 'dca-orders'>('overview');
  
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

  // Tab configuration with responsive icons and labels
  const tabs = [
    { id: 'overview', label: 'Wallet', shortLabel: 'Wallet', icon: Wallet },
    { id: 'history', label: 'Transactions', shortLabel: 'History', icon: History },
    { id: 'actions', label: 'Quick Actions', shortLabel: 'Actions', icon: Zap },
    { id: 'payment-links', label: 'Payment Links', shortLabel: 'Links', icon: LinkIcon },
    { id: 'dca-orders', label: 'DCA Orders', shortLabel: 'DCA', icon: TrendingUp },
  ] as const;

  return (
    <div className="min-h-screen relative">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6 h-[90vh] flex flex-col">
        <div className="flex justify-center flex-1 min-h-0">
          {/* Main Interface - Centered content with sidebar */}
          <div className="w-full max-w-6xl h-full">
            <div className="bg-black/20 backdrop-blur-xl rounded-2xl border-2 border-green-400/30 shadow-2xl h-full flex flex-col">
              <div className="flex flex-1 min-h-0">
                {/* Sidebar Navigation */}
                <div className="w-64 bg-black/10 backdrop-blur-xl border-r-2 border-green-400/30 rounded-l-2xl flex-shrink-0">
                  <div className="p-6 h-full flex flex-col">
                    <h3 className="text-xl font-semibold text-green-400 mb-6 flex-shrink-0 font-mono">Navigation</h3>
                    <nav className="space-y-3 flex-1">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 font-mono ${
                              activeTab === tab.id
                                ? 'text-green-400 bg-green-400/10 border-2 border-green-400/30'
                                : 'text-green-300 hover:text-green-400 hover:bg-green-400/10 border-2 border-transparent'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8">
                    <Wallet className="w-12 h-12 text-green-400 mx-auto mb-4 animate-pulse" />
                    <p className="text-base text-green-300 font-mono">Loading Oni wallet...</p>
                  </div>
                ) : activeTab === 'overview' ? (
                  backendWallet ? (
                    <Portfolio walletAddress={backendWallet} />
                  ) : (
                    <div className="text-center py-8">
                      <Wallet className="w-12 h-12 text-green-400 mx-auto mb-4 animate-pulse" />
                      <p className="text-base text-green-300 font-mono">Loading Oni wallet...</p>
                    </div>
                  )
                ) : activeTab === 'history' ? (
                  backendWallet ? (
                    <TransactionHistory walletAddress={backendWallet} />
                  ) : (
                    <div className="text-center py-8">
                      <Wallet className="w-12 h-12 text-green-400 mx-auto mb-4 animate-pulse" />
                      <p className="text-base text-green-300 font-mono">Loading Oni wallet...</p>
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
                ) : activeTab === 'dca-orders' ? (
                  <DCAOrders />
                ) : (
                  <QuickActions />
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
