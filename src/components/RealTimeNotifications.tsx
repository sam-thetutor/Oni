import React from 'react';
import { useRealTimeWallet } from '../hooks/useRealTimeWallet';
import { CheckCircle, TrendingUp, Trophy, X } from 'lucide-react';

export const RealTimeNotifications: React.FC = () => {
  const { 
    pointsEarned, 
    lastTransaction, 
    clearPointsNotification, 
    clearTransactionNotification 
  } = useRealTimeWallet();

  if (!pointsEarned && !lastTransaction) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {/* Points Earned Notification */}
      {pointsEarned && (
        <div className="bg-green-500/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-lg border border-green-400/50 max-w-sm animate-in slide-in-from-right-2 duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Trophy className="w-5 h-5 text-yellow-300 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm">Points Earned! 🏆</h4>
                <p className="text-xs opacity-90">
                  +{pointsEarned.points} points for {pointsEarned.reason}
                </p>
                <p className="text-xs opacity-75 mt-1">
                  TX: {pointsEarned.transactionHash.slice(0, 8)}...
                </p>
              </div>
            </div>
            <button
              onClick={clearPointsNotification}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Transaction Success Notification */}
      {lastTransaction && (
        <div className="bg-blue-500/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-lg border border-blue-400/50 max-w-sm animate-in slide-in-from-right-2 duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm">Transaction Successful! ✅</h4>
                <p className="text-xs opacity-90">
                  Sent {lastTransaction.value} XFI to {lastTransaction.to.slice(0, 8)}...
                </p>
                {lastTransaction.explorerUrl && (
                  <a
                    href={lastTransaction.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-200 hover:text-blue-100 underline mt-1 inline-block"
                  >
                    View on Explorer
                  </a>
                )}
              </div>
            </div>
            <button
              onClick={clearTransactionNotification}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 