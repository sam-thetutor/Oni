import { useCallback, useEffect, useMemo } from 'react';
import { useBackend } from './useBackend';
import {
  usePriceStore,
  TimeFrame,
  PricePoint,
  MarketData,
  transformChartData,
  transformMarketData,
  createCachedData,
} from '../stores/priceStore';

export interface UsePriceDataOptions {
  coinId: string;
  timeframes?: TimeFrame[];
  autoFetch?: boolean;
  refreshInterval?: number;
}

export interface UsePriceDataReturn {
  // Data for each timeframe
  chartData: Record<TimeFrame, PricePoint[]>;
  marketData: MarketData | null;
  
  // Loading states
  loading: Record<TimeFrame, boolean>;
  isAnyLoading: boolean;
  
  // Error states
  errors: Record<TimeFrame, string | null>;
  hasError: boolean;
  
  // Actions
  fetchData: (timeframe: TimeFrame) => Promise<void>;
  fetchAllTimeframes: () => Promise<void>;
  refreshData: (timeframe?: TimeFrame) => Promise<void>;
  clearErrors: () => void;
  clearCoinData: () => void;
}

const DEFAULT_TIMEFRAMES: TimeFrame[] = ['1', '7', '30', '90', '365'];

export const usePriceData = (options: UsePriceDataOptions): UsePriceDataReturn => {
  const {
    coinId,
    timeframes = DEFAULT_TIMEFRAMES,
    autoFetch = true,
    refreshInterval = 0,
  } = options;

  const { authFetch } = useBackend();
  const {
    cache,
    loading,
    errors,
    setPriceData,
    setLoading,
    setError,
    getCachedData,
    isDataExpired,
    clearCoinData,
  } = usePriceStore();

  // Get cached data for each timeframe
  const chartData = useMemo(() => {
    const result: Record<TimeFrame, PricePoint[]> = {} as Record<TimeFrame, PricePoint[]>;
    timeframes.forEach((timeframe) => {
      const cached = getCachedData(coinId, timeframe);
      result[timeframe] = cached?.chartData || [];
    });
    return result;
  }, [cache, coinId, timeframes, getCachedData]);

  // Get market data (use the most recent one available)
  const marketData = useMemo(() => {
    for (const timeframe of timeframes) {
      const cached = getCachedData(coinId, timeframe);
      if (cached?.marketData) {
        return cached.marketData;
      }
    }
    return null;
  }, [cache, coinId, timeframes, getCachedData]);

  // Get loading states
  const loadingStates = useMemo(() => {
    const result: Record<TimeFrame, boolean> = {} as Record<TimeFrame, boolean>;
    timeframes.forEach((timeframe) => {
      result[timeframe] = loading[coinId]?.[timeframe] || false;
    });
    return result;
  }, [loading, coinId, timeframes]);

  // Get error states
  const errorStates = useMemo(() => {
    const result: Record<TimeFrame, string | null> = {} as Record<TimeFrame, string | null>;
    timeframes.forEach((timeframe) => {
      result[timeframe] = errors[coinId]?.[timeframe] || null;
    });
    return result;
  }, [errors, coinId, timeframes]);

  // Computed states
  const isAnyLoading = useMemo(() => {
    return Object.values(loadingStates).some(Boolean);
  }, [loadingStates]);

  const hasError = useMemo(() => {
    return Object.values(errorStates).some(Boolean);
  }, [errorStates]);

  // Fetch data for a specific timeframe
  const fetchData = useCallback(async (timeframe: TimeFrame) => {
    console.log(`🔄 fetchData called for ${coinId} - ${timeframe} days`);
    
    // Skip if already loading
    if (loadingStates[timeframe]) {
      console.log(`⏸️ Skipping fetch - already loading for ${timeframe}`);
      return;
    }

    // Skip if data is not expired
    if (!isDataExpired(coinId, timeframe)) {
      console.log(`⏸️ Skipping fetch - data not expired for ${coinId} - ${timeframe}`);
      return;
    }

    console.log(`🚀 Starting fetch for ${coinId} - ${timeframe} days`);
    setLoading(coinId, timeframe, true);
    setError(coinId, timeframe, null);

    try {
      // Fetch chart data
      const url = `/api/price/chart/${coinId}?days=${timeframe}`;
      console.log(`📡 Fetching chart data from: ${url}`);
      
      const chartResponse = await authFetch(url);
      if (!chartResponse.ok) {
        throw new Error(`Failed to fetch chart data: ${chartResponse.status}`);
      }
      const chartApiData = await chartResponse.json();
      console.log(`📊 Received chart data:`, {
        timeframe,
        dataLength: chartApiData?.prices?.length || 0,
        firstPoint: chartApiData?.prices?.[0],
        lastPoint: chartApiData?.prices?.[chartApiData?.prices?.length - 1]
      });
      
      const chartPoints = transformChartData(chartApiData);
      console.log(`🔧 Transformed chart points:`, { length: chartPoints.length, sample: chartPoints.slice(0, 3) });

      // Fetch market data (only if we don't have recent market data)
      let marketDataResult = marketData;
      if (!marketDataResult || isDataExpired(coinId, timeframe)) {
        try {
          const marketResponse = await authFetch(`/api/price/market/${coinId}`);
          if (marketResponse.ok) {
            const marketApiData = await marketResponse.json();
            marketDataResult = transformMarketData(marketApiData);
            console.log(`💰 Updated market data:`, { price: marketDataResult?.current_price });
          }
        } catch (marketError) {
          console.warn('Failed to fetch market data:', marketError);
          // Continue with chart data only
        }
      }

      // Store in cache
      const cachedData = createCachedData(chartPoints, marketDataResult);
      console.log(`💾 Storing in cache for ${coinId} - ${timeframe}:`, {
        chartDataLength: cachedData.chartData.length,
        hasMarketData: !!cachedData.marketData,
        expiresAt: new Date(cachedData.expiresAt).toISOString()
      });
      
      setPriceData(coinId, timeframe, cachedData);
      console.log(`✅ Successfully cached data for ${coinId} - ${timeframe}`);

    } catch (error: any) {
      console.error(`❌ Error fetching ${timeframe}d data for ${coinId}:`, error);
      setError(coinId, timeframe, error.message);
    } finally {
      setLoading(coinId, timeframe, false);
    }
  }, [
    coinId,
    loadingStates,
    isDataExpired,
    setLoading,
    setError,
    authFetch,
    setPriceData,
    marketData,
  ]);

  // Fetch all timeframes
  const fetchAllTimeframes = useCallback(async () => {
    const promises = timeframes.map((timeframe) => fetchData(timeframe));
    await Promise.allSettled(promises);
  }, [timeframes, fetchData]);

  // Refresh data (force refetch)
  const refreshData = useCallback(async (timeframe?: TimeFrame) => {
    if (timeframe) {
      // Force refresh specific timeframe by temporarily marking as expired
      const cached = getCachedData(coinId, timeframe);
      if (cached) {
        setPriceData(coinId, timeframe, { ...cached, expiresAt: 0 });
      }
      await fetchData(timeframe);
    } else {
      // Refresh all timeframes
      timeframes.forEach((tf) => {
        const cached = getCachedData(coinId, tf);
        if (cached) {
          setPriceData(coinId, tf, { ...cached, expiresAt: 0 });
        }
      });
      await fetchAllTimeframes();
    }
  }, [coinId, timeframes, getCachedData, setPriceData, fetchData, fetchAllTimeframes]);

  // Clear errors
  const clearErrors = useCallback(() => {
    timeframes.forEach((timeframe) => {
      setError(coinId, timeframe, null);
    });
  }, [coinId, timeframes, setError]);

  // Clear all data for this coin
  const clearCoinDataAction = useCallback(() => {
    clearCoinData(coinId);
  }, [coinId, clearCoinData]);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch && coinId) {
      fetchAllTimeframes();
    }
  }, [autoFetch, coinId, fetchAllTimeframes]);

  // Set up refresh interval
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        fetchAllTimeframes();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, fetchAllTimeframes]);

  return {
    chartData,
    marketData,
    loading: loadingStates,
    isAnyLoading,
    errors: errorStates,
    hasError,
    fetchData,
    fetchAllTimeframes,
    refreshData,
    clearErrors,
    clearCoinData: clearCoinDataAction,
  };
}; 