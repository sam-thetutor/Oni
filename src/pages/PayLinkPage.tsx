import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useBackend } from '../hooks/useBackend';
import oniLogo from '../assets/logos.png';

interface PaymentLinkData {
  linkId: string;
  amount: number;
  status: string;
  creator: string;
  createdAt: string;
}

export const PayLinkPage: React.FC = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const navigate = useNavigate();
  const { authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const { sendMessage } = useBackend();
  
  const [paymentLink, setPaymentLink] = useState<PaymentLinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Fetch payment link details
  useEffect(() => {
    const fetchPaymentLink = async () => {
      if (!linkId) {
        setError('Invalid payment link');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3030'}/api/user/wallet/paylink/${linkId}`);
        const result = await response.json();
        
        if (result.success) {
          setPaymentLink({
            linkId: result.data.linkId,
            amount: result.data.amount,
            status: result.data.status,
            creator: '', // We don't have creator info in current schema
            createdAt: result.data.createdAt
          });
        } else {
          setError(result.error || 'Payment link not found');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load payment link');
        setLoading(false);
      }
    };

    fetchPaymentLink();
  }, [linkId]);

  const handlePayment = async () => {
    if (!authenticated) {
      login();
      return;
    }

    if (!paymentLink || wallets.length === 0) {
      setError('Please connect your wallet first');
      return;
    }

    setPaying(true);
    setError(null);

    try {
      // Use the AI backend to process the payment
      const result = await sendMessage(
        `Pay the fixed payment link ${linkId} with amount ${paymentLink.amount} XFI`
      );

      if (result.includes('success')) {
        setPaymentSuccess(true);
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-main-gradient font-mono text-text flex items-center justify-center">
        <div className="text-center">
          <img src={oniLogo} alt="Oni" className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-300">Loading payment link...</p>
        </div>
      </div>
    );
  }

  if (error && !paymentLink) {
    return (
      <div className="min-h-screen bg-main-gradient font-mono text-text flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-md">
            <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-accent hover:bg-accent/80 text-dark px-4 py-2 rounded-lg transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-main-gradient font-mono text-text flex items-center justify-center">
        <div className="text-center">
          <div className="bg-green-900/20 border border-green-500 rounded-lg p-8 max-w-md">
            <div className="text-green-400 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-green-400 mb-2">Payment Successful!</h2>
            <p className="text-gray-300 mb-4">
              You have successfully paid {paymentLink?.amount} XFI
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-accent hover:bg-accent/80 text-dark px-6 py-3 rounded-lg transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-main-gradient font-mono text-text">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <img src={oniLogo} alt="Oni" className="w-12 h-12 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-accent mb-2">Payment Request</h1>
            <p className="text-gray-400">You've been asked to make a payment</p>
          </div>

          {/* Payment Details Card */}
          <div className="bg-dark/50 backdrop-blur-sm border border-accent/20 rounded-xl p-8 mb-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                <span className="text-2xl">💳</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-200 mb-2">Payment Amount</h2>
              <div className="text-4xl font-bold text-accent mb-1">
                {paymentLink?.amount} XFI
              </div>
              <p className="text-gray-400 text-sm">
                ≈ ${(paymentLink?.amount || 0 * 1.2).toFixed(2)} USD
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">Payment Link ID</span>
                <span className="text-gray-200 font-mono text-sm">{paymentLink?.linkId}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">Status</span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  paymentLink?.status === 'active' 
                    ? 'bg-green-900/30 text-green-400' 
                    : 'bg-red-900/30 text-red-400'
                }`}>
                  {paymentLink?.status}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400">Created</span>
                <span className="text-gray-200 text-sm">
                  {paymentLink ? new Date(paymentLink.createdAt).toLocaleDateString() : ''}
                </span>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-3 mb-6">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Payment Button */}
            <div className="space-y-4">
              {!authenticated ? (
                <button
                  onClick={() => login()}
                  className="w-full bg-accent hover:bg-accent/80 text-dark py-4 rounded-lg font-semibold transition-colors"
                >
                  Connect Wallet to Pay
                </button>
              ) : (
                <button
                  onClick={handlePayment}
                  disabled={paying || paymentLink?.status !== 'active'}
                  className="w-full bg-accent hover:bg-accent/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-dark py-4 rounded-lg font-semibold transition-colors"
                >
                  {paying ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Payment...
                    </span>
                  ) : (
                    `Pay ${paymentLink?.amount} XFI`
                  )}
                </button>
              )}
              
              <button
                onClick={() => navigate('/')}
                className="w-full bg-transparent border border-gray-600 hover:border-gray-500 text-gray-300 py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-yellow-900/10 border border-yellow-600/30 rounded-lg p-4">
            <div className="flex items-start">
              <span className="text-yellow-500 mr-2">⚠️</span>
              <div>
                <p className="text-yellow-400 text-sm font-semibold mb-1">Security Notice</p>
                <p className="text-gray-400 text-xs">
                  Always verify the payment amount and recipient before confirming. 
                  Transactions on the blockchain are irreversible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 