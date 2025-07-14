import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TimeFrame = '1' | '7' | '30' | '90' | '365';

export interface PricePoint {
  timestamp: number;
  price: number;
}

export interface MarketData {
  symbol: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d?: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  last_updated: string;
}

export interface CachedPriceData {
  chartData: PricePoint[];
  marketData: MarketData | null;
  fetchedAt: number;
  expiresAt: number;
}

interface PriceStoreState {
  // Cached data by coinId and timeframe
  cache: Record<string, Record<TimeFrame, CachedPriceData | null>>;
  
  // Loading states
  loading: Record<string, Record<TimeFrame, boolean>>;
  
  // Error states
  errors: Record<string, Record<TimeFrame, string | null>>;
  
  // Actions
  setPriceData: (coinId: string, timeframe: TimeFrame, data: CachedPriceData) => void;
  setLoading: (coinId: string, timeframe: TimeFrame, loading: boolean) => void;
  setError: (coinId: string, timeframe: TimeFrame, error: string | null) => void;
  getCachedData: (coinId: string, timeframe: TimeFrame) => CachedPriceData | null;
  isDataExpired: (coinId: string, timeframe: TimeFrame) => boolean;
  clearExpiredData: () => void;
  clearCoinData: (coinId: string) => void;
  clearAllData: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache on frontend

const createInitialTimeframeState = () => ({
  '1': null as CachedPriceData | null,
  '7': null as CachedPriceData | null,
  '30': null as CachedPriceData | null,
  '90': null as CachedPriceData | null,
  '365': null as CachedPriceData | null,
});

const createInitialLoadingState = () => ({
  '1': false,
  '7': false,
  '30': false,
  '90': false,
  '365': false,
});

const createInitialErrorState = () => ({
  '1': null as string | null,
  '7': null as string | null,
  '30': null as string | null,
  '90': null as string | null,
  '365': null as string | null,
});

export const usePriceStore = create<PriceStoreState>()(
  persist(
    (set, get) => ({
      cache: {},
      loading: {},
      errors: {},

      setPriceData: (coinId: string, timeframe: TimeFrame, data: CachedPriceData) => {
        set((state) => ({
          cache: {
            ...state.cache,
            [coinId]: {
              ...state.cache[coinId],
              [timeframe]: data,
            },
          },
        }));
      },

      setLoading: (coinId: string, timeframe: TimeFrame, loading: boolean) => {
        set((state) => ({
          loading: {
            ...state.loading,
            [coinId]: {
              ...(state.loading[coinId] || createInitialLoadingState()),
              [timeframe]: loading,
            },
          },
        }));
      },

      setError: (coinId: string, timeframe: TimeFrame, error: string | null) => {
        set((state) => ({
          errors: {
            ...state.errors,
            [coinId]: {
              ...(state.errors[coinId] || createInitialErrorState()),
              [timeframe]: error,
            },
          },
        }));
      },

      getCachedData: (coinId: string, timeframe: TimeFrame): CachedPriceData | null => {
        const state = get();
        return state.cache[coinId]?.[timeframe] || null;
      },

      isDataExpired: (coinId: string, timeframe: TimeFrame): boolean => {
        const cachedData = get().getCachedData(coinId, timeframe);
        if (!cachedData) return true;
        return Date.now() > cachedData.expiresAt;
      },

      clearExpiredData: () => {
        const state = get();
        const now = Date.now();
        const updatedCache = { ...state.cache };

        Object.keys(updatedCache).forEach((coinId) => {
          Object.keys(updatedCache[coinId]).forEach((timeframe) => {
            const data = updatedCache[coinId][timeframe as TimeFrame];
            if (data && now > data.expiresAt) {
              updatedCache[coinId][timeframe as TimeFrame] = null;
            }
          });
        });

        set({ cache: updatedCache });
      },

      clearCoinData: (coinId: string) => {
        set((state) => {
          const newCache = { ...state.cache };
          const newLoading = { ...state.loading };
          const newErrors = { ...state.errors };
          
          delete newCache[coinId];
          delete newLoading[coinId];
          delete newErrors[coinId];
          
          return {
            cache: newCache,
            loading: newLoading,
            errors: newErrors,
          };
        });
      },

      clearAllData: () => {
        set({
          cache: {},
          loading: {},
          errors: {},
        });
      },
    }),
    {
      name: 'price-store',
      // Only persist cache data, not loading/error states
      partialize: (state) => ({ cache: state.cache }),
      // Custom storage to handle expiration on hydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.clearExpiredData();
        }
      },
    }
  )
);

// Helper function to transform API response to our format
export const transformChartData = (apiData: any): PricePoint[] => {
  if (!apiData?.prices) return [];
  
  return apiData.prices.map(([timestamp, price]: [number, number]) => ({
    timestamp,
    price,
  }));
};

// Helper function to transform market data
export const transformMarketData = (apiData: any): MarketData | null => {
  if (!apiData?.market_data && !apiData?.symbol) return null;
  
  const marketData = apiData.market_data || apiData;
  
  return {
    symbol: apiData.symbol || 'xfi',
    current_price: marketData.current_price?.usd || marketData.current_price || 0,
    market_cap: marketData.market_cap?.usd || marketData.market_cap || 0,
    total_volume: marketData.total_volume?.usd || marketData.total_volume || 0,
    price_change_24h: marketData.price_change_24h || 0,
    price_change_percentage_24h: marketData.price_change_percentage_24h || 0,
    price_change_percentage_7d: marketData.price_change_percentage_7d,
    ath: marketData.ath?.usd || marketData.ath || 0,
    ath_change_percentage: marketData.ath_change_percentage?.usd || marketData.ath_change_percentage || 0,
    ath_date: marketData.ath_date?.usd || marketData.ath_date || new Date().toISOString(),
    last_updated: marketData.last_updated || new Date().toISOString(),
  };
};

// Helper function to create cached data
export const createCachedData = (
  chartData: PricePoint[],
  marketData: MarketData | null = null
): CachedPriceData => {
  const now = Date.now();
  return {
    chartData,
    marketData,
    fetchedAt: now,
    expiresAt: now + CACHE_DURATION,
  };
}; 