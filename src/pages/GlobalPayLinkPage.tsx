import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { useGlobalPaymentLink } from '../hooks/useGlobalPaymentLink';

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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading global payment link...</p>
        </div>
      </div>
    );
  }

  if (error && !globalPaymentLink) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-red-500/20 backdrop-blur-md rounded-2xl p-8 text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">Global Payment Link Error</h1>
          <p className="text-red-300 mb-6">{error}</p>
          <button
            onClick={handleBackToHome}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full">
        {/* Global Payment Link Info */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🌍</div>
          <h1 className="text-2xl font-bold text-white mb-2">Global Payment Link</h1>
          {globalPaymentLink && (
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {globalPaymentLink.totalContributionsInXFI.toFixed(4)} XFI
              </div>
              <div className="text-gray-300 text-sm mb-2">
                Total Contributions
              </div>
              <div className="text-gray-300 text-sm">
                Creator: {formatAddress(globalPaymentLink.creator)}
              </div>
              <div className="text-gray-300 text-sm">
                Link ID: {globalPaymentLink.linkId}
              </div>
            </div>
          )}
        </div>

        {/* Contribution Status */}
        {contributionStatus === 'success' && (
          <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-6">
            <div className="text-green-400 text-center">
              <div className="text-2xl mb-2">✅</div>
              <p className="font-semibold">Contribution Successful!</p>
              {transactionHash && (
                <div className="mt-2">
                  <p className="text-sm">Transaction Hash:</p>
                  <p className="text-xs font-mono break-all">{transactionHash}</p>
                  <a 
                    href={`https://test.xfiscan.com/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-200 text-xs underline mt-1 inline-block"
                  >
                    View on Explorer →
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {contributionStatus === 'error' && error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
            <div className="text-red-400 text-center">
              <div className="text-2xl mb-2">❌</div>
              <p className="font-semibold">Contribution Failed</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          </div>
        )}

        {/* Contribution Form */}
        {authenticated && (
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
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
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
            />
            {contributionAmountError && (
              <p className="text-red-400 text-sm mt-1">{contributionAmountError}</p>
            )}
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>Min: 0.001 XFI</span>
              <span>Max: 1000 XFI</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          {!authenticated ? (
            <div className="text-center">
              <p className="text-gray-300 mb-4">Connect your wallet to contribute any amount</p>
              <button
                onClick={handleConnectWallet}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Connect Wallet to Contribute
              </button>
            </div>
          ) : contributionStatus === 'success' ? (
            <button
              onClick={handleBackToHome}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Done
            </button>
          ) : (
            <button
              onClick={handleContribution}
              disabled={loading || contributionStatus === 'processing' || !contributionAmount.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              {contributionStatus === 'processing' ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
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
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>🌍 Global payment links accept any amount</p>
          <p>💝 Your contribution will be added to the total</p>
          <p>🔒 Secure payment via smart contract</p>
        </div>

        {/* Back Button */}
        <div className="mt-4 text-center">
          <button
            onClick={handleBackToHome}
            className="text-gray-400 hover:text-white text-sm underline transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalPayLinkPage; 