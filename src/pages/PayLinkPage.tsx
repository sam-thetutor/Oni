import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { useContractPayment } from '../hooks/useContractPayment';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface PaymentLinkData {
  linkId: string;
  amount: number;
  status: string;
  createdAt: string;
  isPaid?: boolean;
  creator?: string;
  isGlobal?: boolean;
  totalContributions?: number;
}

const PayLinkPage: React.FC = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const navigate = useNavigate();
  const { ready, authenticated, login } = usePrivy();
  const { payFixedPaymentLink, getPaymentLinkDetails, loading } = useContractPayment();
  
  const [paymentLink, setPaymentLink] = useState<PaymentLinkData | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  useEffect(() => {
    if (linkId) {
      fetchPaymentLinkData();
    } else {
      setError('Invalid payment link');
      setLoadingData(false);
    }
  }, [linkId]);

  const fetchPaymentLinkData = async () => {
    if (!linkId) return;
    
    setLoadingData(true);
    const result = await getPaymentLinkDetails(linkId);
    
    if (result.success && result.data) {
      setPaymentLink(result.data);
    } else {
      setError(result.error || 'Failed to load payment link');
    }
    setLoadingData(false);
  };

  const handlePayment = async () => {
    if (!paymentLink || !authenticated) return;

    try {
      setPaymentStatus('processing');
      setError(null);

      console.log('Processing payment for link:', linkId, 'Amount:', paymentLink.amount);

      const result = await payFixedPaymentLink(linkId!, paymentLink.amount);

      if (result.success) {
        setPaymentStatus('success');
        setTransactionHash(result.transactionHash!);
        
        // Update payment link status locally
        setPaymentLink(prev => prev ? { ...prev, status: 'paid' } : null);
      } else {
        setPaymentStatus('error');
        setError(result.error || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      setError(error.message || 'An unexpected error occurred');
    }
  };

  const handleConnectWallet = () => {
    login();
  };

  const handleBackToHome = () => {
    navigate('/');
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
          <p className="text-green-300 text-lg font-mono">Loading payment link...</p>
        </div>
      </div>
    );
  }

  if (error && !paymentLink) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <div className="bg-black/20 backdrop-blur-xl border-2 border-red-500/30 rounded-xl p-8 text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-400 mb-4 font-mono">Payment Link Error</h1>
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
          {/* Payment Link Info */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">💳</div>
            <h1 className="text-2xl font-bold text-green-400 mb-2 font-mono">Payment Request</h1>
            {paymentLink && (
              <div className="bg-black/20 backdrop-blur-xl border border-green-400/20 rounded-lg p-4 mb-6">
                <div className="text-3xl font-bold text-green-400 mb-2 font-mono">
                  {paymentLink.amount} XFI
                </div>
                <div className="text-green-300 text-sm font-mono">
                  Link ID: {paymentLink.linkId}
                </div>
                <div className="text-green-300 text-sm font-mono">
                  Status: <span className={`font-semibold ${
                    paymentLink.isPaid || paymentLink.status === 'paid' ? 'text-green-400' : 
                    paymentLink.status === 'active' ? 'text-blue-400' : 'text-gray-400'
                  }`}>
                    {paymentLink.isPaid ? 'Paid' : paymentLink.status}
                  </span>
                </div>
                {paymentLink.creator && (
                  <div className="text-green-300 text-sm font-mono">
                    Creator: {paymentLink.creator.slice(0, 6)}...{paymentLink.creator.slice(-4)}
                  </div>
                )}
                {paymentLink.isGlobal && paymentLink.totalContributions !== undefined && (
                  <div className="text-green-300 text-sm font-mono">
                    Total Contributions: {paymentLink.totalContributions} XFI
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Payment Status */}
          {paymentStatus === 'success' && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
              <div className="text-green-400 text-center">
                <div className="text-2xl mb-2">✅</div>
                <p className="font-semibold font-mono">Payment Successful!</p>
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

          {paymentStatus === 'error' && error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <div className="text-red-400 text-center">
                <div className="text-2xl mb-2">❌</div>
                <p className="font-semibold font-mono">Payment Failed</p>
                <p className="text-sm mt-2 font-mono">{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {!authenticated ? (
              <button
                onClick={handleConnectWallet}
                className="w-full bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 hover:text-green-300 py-3 px-6 rounded-lg font-semibold transition-all duration-200 font-mono"
              >
                Connect Wallet to Pay
              </button>
            ) : paymentLink?.isPaid || paymentLink?.status === 'paid' ? (
              <div className="text-center">
                <p className="text-green-400 font-semibold mb-4 font-mono">This payment link has already been paid</p>
                <button
                  onClick={handleBackToHome}
                  className="bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 text-gray-300 hover:text-gray-200 px-6 py-2 rounded-lg transition-all duration-200 font-mono"
                >
                  Go Back Home
                </button>
              </div>
            ) : paymentStatus === 'success' ? (
              <button
                onClick={handleBackToHome}
                className="w-full bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 hover:text-green-300 py-3 px-6 rounded-lg font-semibold transition-all duration-200 font-mono"
              >
                Done
              </button>
            ) : (
              <button
                onClick={handlePayment}
                disabled={loading || paymentStatus === 'processing'}
                className="w-full bg-green-500/10 hover:bg-green-500/20 disabled:bg-gray-600/20 disabled:cursor-not-allowed border border-green-500/30 text-green-400 hover:text-green-300 disabled:text-gray-400 py-3 px-6 rounded-lg font-semibold transition-all duration-200 font-mono"
              >
                {paymentStatus === 'processing' ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-400 mr-2"></div>
                    Processing Payment...
                  </div>
                ) : (
                  `Pay ${paymentLink?.amount || '0'} XFI`
                )}
              </button>
            )}
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center text-green-400/70 text-sm font-mono">
            <p>🔒 Secure payment via smart contract</p>
            <p>Only pay if you trust the request sender</p>
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

export default PayLinkPage; 