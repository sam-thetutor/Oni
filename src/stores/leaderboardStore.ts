import { create } from 'zustand';
import { BACKEND_URL } from '../utils/constants';

export interface LeaderboardEntry {
  rank: number;
  walletAddress: string;
  points: number;
  totalVolume: number;
  username?: string;
  weeklyPoints?: number;
  weeklyVolume?: number;
}

export interface WeeklyStats {
  totalParticipants: number;
  totalWeeklyVolume: number;
  resetTime: string;
  weekNumber: number;
  year: number;
}

interface LeaderboardState {
  // All-time leaderboard
  allTimeLeaderboard: LeaderboardEntry[];
  allTimeLoading: boolean;
  allTimeError: string | null;
  allTimeLastFetched: number | null;
  
  // Weekly leaderboard
  weeklyLeaderboard: LeaderboardEntry[];
  weeklyStats: WeeklyStats | null;
  weeklyLoading: boolean;
  weeklyError: string | null;
  weeklyLastFetched: number | null;
  
  // Actions
  fetchAllTimeLeaderboard: (force?: boolean) => Promise<void>;
  fetchWeeklyLeaderboard: (force?: boolean) => Promise<void>;
  clearCache: () => void;
}

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useLeaderboardStore = create<LeaderboardState>((set, get) => ({
  // Initial state
  allTimeLeaderboard: [],
  allTimeLoading: false,
  allTimeError: null,
  allTimeLastFetched: null,
  
  weeklyLeaderboard: [],
  weeklyStats: null,
  weeklyLoading: false,
  weeklyError: null,
  weeklyLastFetched: null,
  
  // Fetch all-time leaderboard
  fetchAllTimeLeaderboard: async (force = false) => {
    const state = get();
    const now = Date.now();
    
    // Check if we need to refresh (force refresh or data is stale)
    if (!force && 
        state.allTimeLastFetched && 
        (now - state.allTimeLastFetched) < REFRESH_INTERVAL) {
      return; // Use cached data
    }
    
    set({ allTimeLoading: true, allTimeError: null });
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/gamification/leaderboard?limit=100`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch leaderboard: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        set({
          allTimeLeaderboard: data.leaderboard,
          allTimeLastFetched: now,
          allTimeError: null,
        });
      } else {
        throw new Error(data.error || 'Failed to fetch leaderboard');
      }
    } catch (error) {
      console.error('Error fetching all-time leaderboard:', error);
      set({
        allTimeError: error instanceof Error ? error.message : 'Failed to fetch leaderboard',
      });
    } finally {
      set({ allTimeLoading: false });
    }
  },
  
  // Fetch weekly leaderboard
  fetchWeeklyLeaderboard: async (force = false) => {
    const state = get();
    const now = Date.now();
    
    // Check if we need to refresh (force refresh or data is stale)
    if (!force && 
        state.weeklyLastFetched && 
        (now - state.weeklyLastFetched) < REFRESH_INTERVAL) {
      return; // Use cached data
    }
    
    set({ weeklyLoading: true, weeklyError: null });
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/gamification/weekly-leaderboard`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch weekly leaderboard: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        set({
          weeklyLeaderboard: data.leaderboard,
          weeklyStats: data.stats,
          weeklyLastFetched: now,
          weeklyError: null,
        });
      } else {
        throw new Error(data.error || 'Failed to fetch weekly leaderboard');
      }
    } catch (error) {
      console.error('Error fetching weekly leaderboard:', error);
      set({
        weeklyError: error instanceof Error ? error.message : 'Failed to fetch weekly leaderboard',
      });
    } finally {
      set({ weeklyLoading: false });
    }
  },
  
  // Clear cache
  clearCache: () => {
    set({
      allTimeLastFetched: null,
      weeklyLastFetched: null,
    });
  },
}));

// Auto-refresh setup
let refreshInterval: NodeJS.Timeout | null = null;

export const startLeaderboardAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
  
  refreshInterval = setInterval(() => {
    const store = useLeaderboardStore.getState();
    store.fetchAllTimeLeaderboard();
    store.fetchWeeklyLeaderboard();
  }, REFRESH_INTERVAL);
};

export const stopLeaderboardAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}; 