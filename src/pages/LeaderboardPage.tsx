import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';

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

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:3030/api/gamification/leaderboard');
        const data = await res.json();
        if (data.success) {
          setLeaderboard(data.leaderboard);
        } else {
          setError(data.error || 'Failed to load leaderboard');
        }
      } catch (err) {
        setError('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen w-full  font-mono text-text max-w-3xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">Leaderboard</h2>
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-400">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-purple-700 to-blue-700 text-white">
                  <th className="px-4 py-3 text-left">Rank</th>
                  <th className="px-4 py-3 text-left">Username / Address</th>
                  <th className="px-4 py-3 text-left">Points</th>
                  <th className="px-4 py-3 text-left">Total Volume (XFI)</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr key={entry.rank} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                    <td className="px-4 py-2 font-semibold text-purple-300">{entry.rank}</td>
                    <td className="px-4 py-2 text-blue-200 font-mono">{entry.username ? (
                      <span className="font-bold text-pink-300">{entry.username}</span>
                    ) : (
                      <span>{entry.walletAddress.slice(0, 6)}...{entry.walletAddress.slice(-4)}</span>
                    )}</td>
                    <td className="px-4 py-2 text-green-300">{entry.points}</td>
                    <td className="px-4 py-2 text-yellow-200">{entry.totalVolume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default LeaderboardPage; 