import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { BACKEND_URL } from '../utils/constants';
import { useRealTimeWallet } from '../hooks/useRealTimeWallet';

interface LeaderboardEntry {
  rank: number;
  walletAddress: string;
  points: number;
  totalVolume: number;
  username?: string; // Added username to the interface
}

export const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isConnected, testConnection } = useRealTimeWallet();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BACKEND_URL}/api/gamification/leaderboard?limit=100`);
        console.log('Leaderboard response:', res);
        const data = await res.json();
        if (data.success) {
          setLeaderboard(data.leaderboard);
        } else {
          setError(data.error || 'Failed to load leaderboard');
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />;
      case 3:
        return <Award className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />;
      default:
        return <span className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-purple-300 font-bold text-sm sm:text-base">#{rank}</span>;
    }
  };

  const getRankColors = (rank: number) => {
    switch (rank) {
      case 1:
        return "border-yellow-400/30 bg-gradient-to-r from-yellow-500/10 to-yellow-600/5";
      case 2:
        return "border-gray-300/30 bg-gradient-to-r from-gray-400/10 to-gray-500/5";
      case 3:
        return "border-orange-400/30 bg-gradient-to-r from-orange-500/10 to-orange-600/5";
      default:
        return "border-gray-700/50 bg-gray-800/30";
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen w-full font-mono text-text max-w-5xl mx-auto py-6 sm:py-10 px-3 sm:px-4">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">🏆 Leaderboard</h2>
          <p className="text-sm sm:text-base text-gray-400">Top performers in the CrossFi ecosystem</p>
          <div className="mt-4 flex justify-center space-x-4">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <div className="flex items-center space-x-1 text-green-400 text-xs">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>WebSocket Connected</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-red-400 text-xs">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>WebSocket Disconnected</span>
                </div>
              )}
            </div>
            <button
              onClick={testConnection}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
            >
              Test WebSocket
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-8 sm:py-12">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 sm:h-6 sm:w-6 border-b-2 border-purple-400"></div>
              <span className="text-sm sm:text-base">Loading leaderboard...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-8 sm:py-12">
            <p className="text-sm sm:text-base">{error}</p>
          </div>
        ) : (
          <>
            {/* Mobile Card Layout (< md screens) */}
            <div className="md:hidden space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`border rounded-lg p-4 ${getRankColors(entry.rank)} hover:bg-gray-700/20 transition-all duration-200`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getRankIcon(entry.rank)}
                      <div>
                        {entry.username ? (
                          <span className="font-bold text-pink-300 text-sm">{entry.username}</span>
                        ) : (
                          <span className="text-blue-200 font-mono text-xs">
                            {entry.walletAddress.slice(0, 6)}...{entry.walletAddress.slice(-4)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-300 font-bold text-sm">{entry.points} pts</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Total Volume</span>
                    <span className="text-yellow-200 font-semibold">{entry.totalVolume.toFixed(3)} XFI</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table Layout (>= md screens) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full bg-gray-900/50 rounded-lg overflow-hidden backdrop-blur-sm">
              <thead>
                <tr className="bg-gradient-to-r from-purple-700 to-blue-700 text-white">
                    <th className="px-4 lg:px-6 py-3 text-left text-sm lg:text-base">Rank</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-sm lg:text-base">Username / Address</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-sm lg:text-base">Points</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-sm lg:text-base">Total Volume (XFI)</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                    <tr 
                      key={entry.rank} 
                      className={`border-b border-gray-800 hover:bg-gray-800/50 transition-all duration-200 ${
                        entry.rank <= 3 ? getRankColors(entry.rank) : ''
                      }`}
                    >
                      <td className="px-4 lg:px-6 py-3 font-semibold">
                        <div className="flex items-center space-x-2">
                          {getRankIcon(entry.rank)}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 text-blue-200 font-mono">
                        {entry.username ? (
                          <span className="font-bold text-pink-300 text-sm lg:text-base">{entry.username}</span>
                    ) : (
                          <span className="text-xs lg:text-sm">
                            {entry.walletAddress.slice(0, 8)}...{entry.walletAddress.slice(-6)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 lg:px-6 py-3 text-green-300 font-semibold text-sm lg:text-base">
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{entry.points}</span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 text-yellow-200 font-semibold text-sm lg:text-base">
                        {entry.totalVolume.toFixed(3)}
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

            {/* Summary Stats */}
            {leaderboard.length > 0 && (
              <div className="mt-6 sm:mt-8 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-purple-300">{leaderboard.length}</div>
                    <div className="text-xs sm:text-sm text-gray-400">Total Players</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-green-300">
                      {leaderboard.reduce((sum, entry) => sum + entry.points, 0).toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">Total Points</div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <div className="text-lg sm:text-xl font-bold text-yellow-300">
                      {leaderboard.reduce((sum, entry) => sum + entry.totalVolume, 0).toFixed(3)}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">Total Volume (XFI)</div>
                  </div>
                </div>
              </div>
            )}

            {leaderboard.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="text-4xl sm:text-6xl mb-4">🏆</div>
                <h3 className="text-lg sm:text-xl text-gray-300 mb-2">No players yet</h3>
                <p className="text-sm sm:text-base text-gray-500">Be the first to start earning points!</p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default LeaderboardPage; 