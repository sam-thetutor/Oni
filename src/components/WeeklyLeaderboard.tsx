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

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="w-full">
      {/* Header with Countdown */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-green-400 mb-4 font-mono">🏆 Weekly Leaderboard</h2>
        <p className="text-lg text-green-300 mb-6 font-mono">
          Week {weeklyStats?.weekNumber} • {weeklyStats?.year}
        </p>
        
        {/* Countdown Timer */}
        <div className="bg-black/20 backdrop-blur-xl border-2 border-green-400/30 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Clock className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-semibold font-mono">Next Reset</span>
          </div>
          <div className="text-3xl md:text-4xl font-mono font-bold text-green-400">
            {timeUntilReset}
          </div>
          <p className="text-sm text-green-300/60 mt-2 font-mono">Every Sunday at 00:00 UTC</p>
        </div>

        {/* Weekly Stats */}
        {weeklyStats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-black/20 backdrop-blur-xl rounded-xl p-6 border-2 border-green-400/30">
              <div className="text-2xl font-bold text-green-400 font-mono">{weeklyStats.totalParticipants}</div>
              <div className="text-sm text-green-300 font-mono">Weekly Participants</div>
            </div>
            <div className="bg-black/20 backdrop-blur-xl rounded-xl p-6 border-2 border-green-400/30">
              <div className="text-2xl font-bold text-green-400 font-mono">{(weeklyStats.totalWeeklyVolume ?? 0).toFixed(3)}</div>
              <div className="text-sm text-green-300 font-mono">Weekly Volume (XFI)</div>
            </div>
            <div className="bg-black/20 backdrop-blur-xl rounded-xl p-6 border-2 border-green-400/30">
              <div className="text-2xl font-bold text-green-400 font-mono">
                {weeklyLeaderboard.length > 0 ? weeklyLeaderboard[0].weeklyPoints : 0}
              </div>
              <div className="text-sm text-green-300 font-mono">Top Score</div>
            </div>
          </div>
        )}
      </div>

      {weeklyLoading ? (
        <div className="text-center text-green-300 py-12">
          <div className="inline-flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400"></div>
            <span className="text-lg font-mono">Loading weekly leaderboard...</span>
          </div>
        </div>
      ) : weeklyError ? (
        <div className="text-center text-red-400 py-12">
          <p className="text-lg font-mono">{weeklyError}</p>
          <button
            onClick={handleRefresh}
            className="mt-6 flex items-center space-x-2 px-6 py-3 bg-green-400/10 text-green-400 rounded-lg hover:bg-green-400/20 border border-green-400/30 transition-all duration-200 mx-auto font-mono"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      ) : (
        <>
          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-4">
            {weeklyLeaderboard.map((entry) => (
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
                          {formatAddress(entry.walletAddress)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold text-sm font-mono">{entry.weeklyPoints} pts</div>
                    <div className="text-xs text-green-300/60 font-mono">This Week</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-green-300">
                  <span className="font-mono">Weekly Volume</span>
                  <span className="text-yellow-400 font-semibold font-mono">{(entry.weeklyVolume ?? 0).toFixed(3)} XFI</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-x-auto">
            <div className="bg-black/20 backdrop-blur-xl rounded-xl border-2 border-green-400/30 overflow-hidden">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-green-400/10 border-b-2 border-green-400/30">
                    <th className="px-6 py-4 text-left text-sm font-mono text-green-400">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-mono text-green-400">Username / Address</th>
                    <th className="px-6 py-4 text-left text-sm font-mono text-green-400">Weekly Points</th>
                    <th className="px-6 py-4 text-left text-sm font-mono text-green-400">Weekly Volume (XFI)</th>
                    <th className="px-6 py-4 text-left text-sm font-mono text-green-400">Total Points</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyLeaderboard.map((entry) => (
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
                          <span className="font-mono">{entry.weeklyPoints}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-yellow-400 font-semibold text-sm font-mono">
                        {(entry.weeklyVolume ?? 0).toFixed(3)}
                      </td>
                      <td className="px-6 py-4 text-green-400 font-semibold text-sm font-mono">
                        {entry.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}; 


