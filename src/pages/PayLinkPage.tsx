import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { useContractPayment } from '../hooks/useContractPayment';

interface PaymentLinkData {
  linkId: string;
  amount: number;
  status: string;
  createdAt: string;
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
    
    if (result.success) {
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
          <p className="text-white text-lg">Loading payment link...</p>
        </div>
      </div>
    );
  }

  if (error && !paymentLink) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-red-500/20 backdrop-blur-md rounded-2xl p-8 text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">Payment Link Error</h1>
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
        {/* Payment Link Info */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">💳</div>
          <h1 className="text-2xl font-bold text-white mb-2">Payment Request</h1>
          {paymentLink && (
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {paymentLink.amount} XFI
              </div>
              <div className="text-gray-300 text-sm">
                Link ID: {paymentLink.linkId}
              </div>
              <div className="text-gray-300 text-sm">
                Status: <span className={`font-semibold ${
                  paymentLink.status === 'paid' ? 'text-green-400' : 
                  paymentLink.status === 'active' ? 'text-blue-400' : 'text-gray-400'
                }`}>
                  {paymentLink.status}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Payment Status */}
        {paymentStatus === 'success' && (
          <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-6">
            <div className="text-green-400 text-center">
              <div className="text-2xl mb-2">✅</div>
              <p className="font-semibold">Payment Successful!</p>
              {transactionHash && (
                <p className="text-sm mt-2 break-all">
                  Transaction: <span className="font-mono">{transactionHash}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {paymentStatus === 'error' && error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
            <div className="text-red-400 text-center">
              <div className="text-2xl mb-2">❌</div>
              <p className="font-semibold">Payment Failed</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          {!authenticated ? (
            <button
              onClick={handleConnectWallet}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Connect Wallet to Pay
            </button>
          ) : paymentLink?.status === 'paid' ? (
            <div className="text-center">
              <p className="text-green-400 font-semibold mb-4">This payment link has already been paid</p>
              <button
                onClick={handleBackToHome}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Go Back Home
              </button>
            </div>
          ) : paymentStatus === 'success' ? (
            <button
              onClick={handleBackToHome}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Done
            </button>
          ) : (
            <button
              onClick={handlePayment}
              disabled={loading || paymentStatus === 'processing'}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              {paymentStatus === 'processing' ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </div>
              ) : (
                `Pay ${paymentLink?.amount || '0'} XFI`
              )}
            </button>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>🔒 Secure payment via smart contract</p>
          <p>Only pay if you trust the request sender</p>
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

export default PayLinkPage; 