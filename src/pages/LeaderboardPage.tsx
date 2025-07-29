import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Trophy, Calendar, TrendingUp } from 'lucide-react';
import { WeeklyLeaderboard } from '../components/WeeklyLeaderboard';
import { useLeaderboardStore, startLeaderboardAutoRefresh, stopLeaderboardAutoRefresh } from '../stores/leaderboardStore';
import { useWebSocket } from '../context/WebSocketContext';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'all-time' | 'weekly'>('all-time');
  const { isConnected } = useWebSocket();
  
  // Get data from Zustand store
  const {
    allTimeLeaderboard,
    allTimeLoading,
    allTimeError,
    fetchAllTimeLeaderboard,
    fetchWeeklyLeaderboard,
  } = useLeaderboardStore();

  // Test WebSocket connection
  const testConnection = () => {
    console.log('WebSocket connection status:', isConnected);
  };

  // Initialize data fetching and auto-refresh
  useEffect(() => {
    // Fetch initial data
    fetchAllTimeLeaderboard();
    fetchWeeklyLeaderboard();
    
    // Start auto-refresh
    startLeaderboardAutoRefresh();
    
    // Cleanup on unmount
    return () => {
      stopLeaderboardAutoRefresh();
    };
  }, [fetchAllTimeLeaderboard, fetchWeeklyLeaderboard]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />;
      case 2:
        return <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />;
      case 3:
        return <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />;
      default:
        return <span className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-green-300 font-bold text-sm sm:text-base">#{rank}</span>;
    }
  };

  const getRankColors = (rank: number) => {
    switch (rank) {
      case 1:
        return "border-yellow-400/30 bg-black/20 backdrop-blur-xl";
      case 2:
        return "border-gray-300/30 bg-black/20 backdrop-blur-xl";
      case 3:
        return "border-orange-400/30 bg-black/20 backdrop-blur-xl";
      default:
        return "border-green-400/30 bg-black/20 backdrop-blur-xl";
    }
  };

  return (
    <div className="min-h-screen relative">
      <Header />
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-green-400 mb-4 font-mono">🏆 Leaderboard</h2>
          <p className="text-xl text-green-300 max-w-2xl mx-auto font-mono">Top performers in the CrossFi ecosystem</p>
          
          {/* Tab Navigation */}
          <div className="mt-8 flex justify-center">
            <div className="bg-black/20 backdrop-blur-xl rounded-xl border-2 border-green-400/30 p-1">
              <button
                onClick={() => setActiveTab('all-time')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'all-time'
                    ? 'bg-green-400/20 text-green-400 border-2 border-green-400'
                    : 'text-green-300 hover:text-green-400 hover:bg-green-400/10'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4" />
                  <span className="font-mono">All Time</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('weekly')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'weekly'
                    ? 'bg-green-400/20 text-green-400 border-2 border-green-400'
                    : 'text-green-300 hover:text-green-400 hover:bg-green-400/10'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-mono">Weekly</span>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={testConnection}
              className="px-4 py-2 bg-green-400/10 hover:bg-green-400/20 border border-green-400/30 text-green-400 text-sm rounded-lg transition-all duration-200 font-mono"
            >
              Test WebSocket
            </button>
          </div>
        </div>

        {activeTab === 'weekly' ? (
          <WeeklyLeaderboard />
        ) : (
          <>
            {allTimeLoading ? (
              <div className="text-center text-green-300 py-12">
                <div className="inline-flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400"></div>
                  <span className="text-lg font-mono">Loading leaderboard...</span>
                </div>
              </div>
            ) : allTimeError ? (
              <div className="text-center text-red-400 py-12">
                <p className="text-lg font-mono">{allTimeError}</p>
              </div>
            ) : (
              <>
                {/* Mobile Card Layout (< md screens) */}
                <div className="md:hidden space-y-4">
                  {allTimeLeaderboard.map((entry) => (
                    <div
                      key={entry.rank}
                      className={`border-2 rounded-xl p-6 ${getRankColors(entry.rank)} hover:border-green-400 transition-all duration-200`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getRankIcon(entry.rank)}
                          <div>
                            {entry.username ? (
                              <span className="font-bold text-green-400 text-sm font-mono">{entry.username}</span>
                            ) : (
                              <span className="text-green-300 font-mono text-xs">
                                {entry.walletAddress.slice(0, 6)}...{entry.walletAddress.slice(-4)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-bold text-sm font-mono">{entry.points} pts</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-green-300">
                        <span className="font-mono">Total Volume</span>
                        <span className="text-yellow-400 font-semibold font-mono">{entry.totalVolume.toFixed(3)} XFI</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table Layout (>= md screens) */}
                <div className="hidden md:block overflow-x-auto">
                  <div className="bg-black/20 backdrop-blur-xl rounded-xl border-2 border-green-400/30 overflow-hidden">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-green-400/10 border-b-2 border-green-400/30">
                          <th className="px-6 py-4 text-left text-sm font-mono text-green-400">Rank</th>
                          <th className="px-6 py-4 text-left text-sm font-mono text-green-400">Username / Address</th>
                          <th className="px-6 py-4 text-left text-sm font-mono text-green-400">Points</th>
                          <th className="px-6 py-4 text-left text-sm font-mono text-green-400">Total Volume (XFI)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allTimeLeaderboard.map((entry) => (
                          <tr 
                            key={entry.rank} 
                            className={`border-b border-green-400/20 hover:bg-green-400/5 transition-all duration-200 ${
                              entry.rank <= 3 ? getRankColors(entry.rank) : ''
                            }`}
                          >
                            <td className="px-6 py-4 font-semibold">
                              <div className="flex items-center space-x-2">
                                {getRankIcon(entry.rank)}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-green-300 font-mono">
                              {entry.username ? (
                                <span className="font-bold text-green-400 text-sm">{entry.username}</span>
                              ) : (
                                <span className="text-sm">
                                  {entry.walletAddress.slice(0, 8)}...{entry.walletAddress.slice(-6)}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-green-400 font-semibold text-sm">
                              <div className="flex items-center space-x-2">
                                <TrendingUp className="w-4 h-4" />
                                <span className="font-mono">{entry.points}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-yellow-400 font-semibold text-sm font-mono">
                              {entry.totalVolume.toFixed(3)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Summary Stats */}
                {allTimeLeaderboard.length > 0 && (
                  <div className="mt-8 p-6 bg-black/20 backdrop-blur-xl rounded-xl border-2 border-green-400/30">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-400 font-mono">{allTimeLeaderboard.length}</div>
                        <div className="text-sm text-green-300 font-mono">Total Players</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-400 font-mono">
                          {allTimeLeaderboard.reduce((sum, entry) => sum + entry.points, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-green-300 font-mono">Total Points</div>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <div className="text-2xl font-bold text-yellow-400 font-mono">
                          {allTimeLeaderboard.reduce((sum, entry) => sum + entry.totalVolume, 0).toFixed(3)}
                        </div>
                        <div className="text-sm text-green-300 font-mono">Total Volume (XFI)</div>
                      </div>
                    </div>
                  </div>
                )}

                {allTimeLeaderboard.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-6">🏆</div>
                    <h3 className="text-2xl text-green-300 mb-3 font-mono">No players yet</h3>
                    <p className="text-lg text-green-300/60 font-mono">Be the first to start earning points!</p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}; 