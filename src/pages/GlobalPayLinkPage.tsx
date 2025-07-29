import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { useGlobalPaymentLink } from '../hooks/useGlobalPaymentLink';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface GlobalPaymentLinkData {
  linkId: string;
  creator: string;
  totalContributions: string;
  totalContributionsInXFI: number;
  exists: boolean;
}

const GlobalPayLinkPage: React.FC = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const navigate = useNavigate();
  const { ready, authenticated, login } = usePrivy();
  const { contributeToGlobalPaymentLink, getGlobalPaymentLinkDetails, loading } = useGlobalPaymentLink();
  
  const [globalPaymentLink, setGlobalPaymentLink] = useState<GlobalPaymentLinkData | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contributionStatus, setContributionStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState<string>('');
  const [contributionAmountError, setContributionAmountError] = useState<string | null>(null);

  useEffect(() => {
    if (linkId) {
      fetchGlobalPaymentLinkData();
    } else {
      setError('Invalid global payment link');
      setLoadingData(false);
    }
  }, [linkId]);

  const fetchGlobalPaymentLinkData = async () => {
    if (!linkId) return;
    
    setLoadingData(true);
    const result = await getGlobalPaymentLinkDetails(linkId);
    
    if (result.success && result.data) {
      setGlobalPaymentLink(result.data);
    } else {
      setError(result.error || 'Failed to load global payment link');
    }
    setLoadingData(false);
  };

  const validateAmount = (amount: string): boolean => {
    if (!amount || amount.trim() === '') {
      setContributionAmountError('Please enter an amount');
      return false;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setContributionAmountError('Please enter a valid positive amount');
      return false;
    }

    if (numAmount > 1000) {
      setContributionAmountError('Maximum contribution is 1000 XFI');
      return false;
    }

    setContributionAmountError(null);
    return true;
  };

  const handleContribution = async () => {
    if (!globalPaymentLink || !authenticated || !validateAmount(contributionAmount)) return;

    try {
      setContributionStatus('processing');
      setError(null);

      console.log('Processing contribution for global link:', linkId, 'Amount:', contributionAmount);

      const result = await contributeToGlobalPaymentLink(linkId!, parseFloat(contributionAmount));

      if (result.success) {
        setContributionStatus('success');
        setTransactionHash(result.transactionHash!);
        
        // Refresh the global payment link data to show updated total
        await fetchGlobalPaymentLinkData();
        
        // Clear the contribution amount input
        setContributionAmount('');
      } else {
        setContributionStatus('error');
        setError(result.error || 'Contribution failed');
      }
    } catch (error: any) {
      console.error('Contribution error:', error);
      setContributionStatus('error');
      setError(error.message || 'An unexpected error occurred');
    }
  };

  const handleConnectWallet = () => {
    login();
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContributionAmount(value);
    
    // Clear error when user starts typing
    if (contributionAmountError) {
      setContributionAmountError(null);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="text-green-400 text-xl font-mono">Initializing...</div>
      </div>
    );
  }

  if (loadingData) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="bg-black/20 backdrop-blur-xl border-2 border-green-400/30 rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-green-300 text-lg font-mono">Loading global payment link...</p>
        </div>
      </div>
    );
  }

  if (error && !globalPaymentLink) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <div className="bg-black/20 backdrop-blur-xl border-2 border-red-500/30 rounded-xl p-8 text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-400 mb-4 font-mono">Global Payment Link Error</h1>
          <p className="text-red-300 mb-6 font-mono">{error}</p>
          <button
            onClick={handleBackToHome}
            className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 px-6 py-2 rounded-lg transition-all duration-200 font-mono"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <Header />
      <div className="flex items-center justify-center p-4 pt-24 pb-32">
        <div className="bg-black/20 backdrop-blur-xl border-2 border-green-400/30 rounded-xl p-8 max-w-md w-full font-mono">
          {/* Global Payment Link Info */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🌍</div>
            <h1 className="text-2xl font-bold text-green-400 mb-2 font-mono">Global Payment Link</h1>
            {globalPaymentLink && (
              <div className="bg-black/20 backdrop-blur-xl border border-green-400/20 rounded-lg p-4 mb-6">
                <div className="text-3xl font-bold text-green-400 mb-2 font-mono">
                  {globalPaymentLink.totalContributionsInXFI.toFixed(4)} XFI
                </div>
                <div className="text-green-300 text-sm mb-2 font-mono">
                  Total Contributions
                </div>
                <div className="text-green-300 text-sm font-mono">
                  Creator: {formatAddress(globalPaymentLink.creator)}
                </div>
                <div className="text-green-300 text-sm font-mono">
                  Link ID: {globalPaymentLink.linkId}
                </div>
              </div>
            )}
          </div>

          {/* Contribution Status */}
          {contributionStatus === 'success' && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
              <div className="text-green-400 text-center">
                <div className="text-2xl mb-2">✅</div>
                <p className="font-semibold font-mono">Contribution Successful!</p>
                {transactionHash && (
                  <div className="mt-2">
                    <p className="text-sm font-mono">Transaction Hash:</p>
                    <p className="text-xs font-mono break-all text-green-300">{transactionHash}</p>
                    <a 
                      href={`${import.meta.env.VITE_EXPLORER_URL || 'https://xfiscan.com'}/tx/${transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-300 hover:text-green-200 text-xs underline mt-1 inline-block font-mono"
                    >
                      View on Explorer →
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {contributionStatus === 'error' && error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <div className="text-red-400 text-center">
                <div className="text-2xl mb-2">❌</div>
                <p className="font-semibold font-mono">Contribution Failed</p>
                <p className="text-sm mt-2 font-mono">{error}</p>
              </div>
            </div>
          )}

          {/* Contribution Form */}
          {authenticated && (
            <div className="mb-6">
              <label className="block text-green-300 text-sm font-medium mb-2 font-mono">
                Contribution Amount (XFI)
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                max="1000"
                value={contributionAmount}
                onChange={handleAmountChange}
                placeholder="Enter amount to contribute"
                className="w-full bg-black/20 backdrop-blur-xl border border-green-400/30 rounded-lg px-4 py-3 text-green-300 placeholder-green-400/50 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 font-mono"
              />
              {contributionAmountError && (
                <p className="text-red-400 text-sm mt-1 font-mono">{contributionAmountError}</p>
              )}
              <div className="flex justify-between mt-2 text-xs text-green-400/70 font-mono">
                <span>Min: 0.001 XFI</span>
                <span>Max: 1000 XFI</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {!authenticated ? (
              <div className="text-center">
                <p className="text-green-300 mb-4 font-mono">Connect your wallet to contribute any amount</p>
                <button
                  onClick={handleConnectWallet}
                  className="w-full bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 hover:text-green-300 py-3 px-6 rounded-lg font-semibold transition-all duration-200 font-mono"
                >
                  Connect Wallet to Contribute
                </button>
              </div>
            ) : contributionStatus === 'success' ? (
              <button
                onClick={handleBackToHome}
                className="w-full bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 hover:text-green-300 py-3 px-6 rounded-lg font-semibold transition-all duration-200 font-mono"
              >
                Done
              </button>
            ) : (
              <button
                onClick={handleContribution}
                disabled={loading || contributionStatus === 'processing' || !contributionAmount.trim()}
                className="w-full bg-green-500/10 hover:bg-green-500/20 disabled:bg-gray-600/20 disabled:cursor-not-allowed border border-green-500/30 text-green-400 hover:text-green-300 disabled:text-gray-400 py-3 px-6 rounded-lg font-semibold transition-all duration-200 font-mono"
              >
                {contributionStatus === 'processing' ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-400 mr-2"></div>
                    Processing Contribution...
                  </div>
                ) : contributionAmount.trim() ? (
                  `Contribute ${contributionAmount} XFI`
                ) : (
                  'Enter Amount to Contribute'
                )}
              </button>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-6 text-center text-green-400/70 text-sm font-mono">
            <p>🌍 Global payment links accept any amount</p>
            <p>💝 Your contribution will be added to the total</p>
            <p>🔒 Secure payment via smart contract</p>
          </div>

          {/* Back Button */}
          <div className="mt-4 text-center">
            <button
              onClick={handleBackToHome}
              className="text-green-400/70 hover:text-green-300 text-sm underline transition-colors font-mono"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GlobalPayLinkPage; 