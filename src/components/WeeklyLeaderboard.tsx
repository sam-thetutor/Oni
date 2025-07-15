import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award, TrendingUp, Clock, Calendar, RefreshCw } from 'lucide-react';
import { useLeaderboardStore } from '../stores/leaderboardStore';

export const WeeklyLeaderboard: React.FC = () => {
  const [timeUntilReset, setTimeUntilReset] = useState<string>('');
  
  // Get data from Zustand store
  const {
    weeklyLeaderboard,
    weeklyStats,
    weeklyLoading,
    weeklyError,
    fetchWeeklyLeaderboard,
  } = useLeaderboardStore();

  // Calculate time until next weekly reset (every Sunday at 00:00 UTC)
  const calculateTimeUntilReset = () => {
    const now = new Date();
    const daysUntilSunday = (7 - now.getUTCDay()) % 7;
    const nextReset = new Date(now);
    nextReset.setUTCDate(now.getUTCDate() + daysUntilSunday);
    nextReset.setUTCHours(0, 0, 0, 0);

    const timeDiff = nextReset.getTime() - now.getTime();
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const updateCountdown = () => {
      setTimeUntilReset(calculateTimeUntilReset());
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // Manual refresh function
  const handleRefresh = () => {
    fetchWeeklyLeaderboard(true); // Force refresh
  };

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

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="w-full">
      {/* Header with Countdown */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">🏆 Weekly Leaderboard</h2>
        <p className="text-sm sm:text-base text-gray-400 mb-4">
          Week {weeklyStats?.weekNumber} • {weeklyStats?.year}
        </p>
        
        {/* Countdown Timer */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-purple-300" />
            <span className="text-purple-300 font-semibold">Next Reset</span>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white">
            {timeUntilReset}
          </div>
          <p className="text-xs text-gray-400 mt-1">Every Sunday at 00:00 UTC</p>
        </div>

        {/* Weekly Stats */}
        {weeklyStats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-purple-300">{weeklyStats.totalParticipants}</div>
              <div className="text-sm text-gray-400">Weekly Participants</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-green-300">{(weeklyStats.totalWeeklyVolume ?? 0).toFixed(3)}</div>
              <div className="text-sm text-gray-400">Weekly Volume (XFI)</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-blue-300">
                {weeklyLeaderboard.length > 0 ? weeklyLeaderboard[0].weeklyPoints : 0}
              </div>
              <div className="text-sm text-gray-400">Top Score</div>
            </div>
          </div>
        )}
      </div>

      {weeklyLoading ? (
        <div className="text-center text-gray-400 py-8 sm:py-12">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 sm:h-6 sm:w-6 border-b-2 border-purple-400"></div>
            <span className="text-sm sm:text-base">Loading weekly leaderboard...</span>
          </div>
        </div>
      ) : weeklyError ? (
        <div className="text-center text-red-400 py-8 sm:py-12">
          <p className="text-sm sm:text-base">{weeklyError}</p>
          <button
            onClick={handleRefresh}
            className="mt-4 flex items-center space-x-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      ) : (
        <>
          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-3">
            {weeklyLeaderboard.map((entry) => (
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
                          {formatAddress(entry.walletAddress)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-300 font-bold text-sm">{entry.weeklyPoints} pts</div>
                    <div className="text-xs text-gray-400">This Week</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Weekly Volume</span>
                  <span className="text-yellow-200 font-semibold">{(entry.weeklyVolume ?? 0).toFixed(3)} XFI</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-gray-900/50 rounded-lg overflow-hidden backdrop-blur-sm">
              <thead>
                <tr className="bg-gradient-to-r from-purple-700 to-blue-700 text-white">
                  <th className="px-4 lg:px-6 py-3 text-left text-sm lg:text-base">Rank</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-sm lg:text-base">Username / Address</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-sm lg:text-base">Weekly Points</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-sm lg:text-base">Weekly Volume (XFI)</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-sm lg:text-base">Total Points</th>
                </tr>
              </thead>
              <tbody>
                {weeklyLeaderboard.map((entry) => (
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
                        <span>{entry.weeklyPoints}</span>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-3 text-yellow-200 font-semibold text-sm lg:text-base">
                      {(entry.weeklyVolume ?? 0).toFixed(3)}
                    </td>
                    <td className="px-4 lg:px-6 py-3 text-purple-300 font-semibold text-sm lg:text-base">
                      {entry.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}; 