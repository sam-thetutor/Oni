import { useState, useEffect, useCallback } from 'react';

export interface PriceDataPoint {
  timestamp: number;
  price: number;
  date: string;
  volume?: number;
  marketCap?: number;
}

export interface MarketData {
  symbol: string;
  currentPrice: number;
  marketCap: number;
  totalVolume: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  priceChangePercentage7d?: number;
  ath: number;
  athChangePercentage: number;
  athDate: string;
  lastUpdated: string;
}

export interface TradingSignal {
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  strength: 'WEAK' | 'MODERATE' | 'STRONG';
  confidence: number;
  reasoning: string[];
  technicalIndicators: {
    trend: 'BULLISH' | 'BEARISH' | 'SIDEWAYS';
    rsi?: number;
    movingAverages: {
      ma20?: number;
      ma50?: number;
    };
    keyLevels: {
      support?: number;
      resistance?: number;
    };
  };
}

export interface PricePrediction {
  timeframe: string;
  currentPrice: number;
  targetPrice: number;
  expectedChange: string;
  confidence: number;
  scenarios?: {
    bullish: { targetPrice: number; probability: number; scenario: string };
    neutral: { targetPrice: number; probability: number; scenario: string };
    bearish: { targetPrice: number; probability: number; scenario: string };
  };
}

interface UsePriceChartReturn {
  // Data
  priceData: PriceDataPoint[];
  marketData: MarketData | null;
  tradingSignal: TradingSignal | null;
  prediction: PricePrediction | null;
  
  // State
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchPriceData: (days: number) => Promise<void>;
  fetchMarketData: () => Promise<void>;
  fetchTradingSignal: (timeframe?: number) => Promise<void>;
  fetchPrediction: (horizon?: 'short' | 'medium' | 'long') => Promise<void>;
  refreshAll: () => Promise<void>;
}

export const usePriceChart = (): UsePriceChartReturn => {
  const [priceData, setPriceData] = useState<PriceDataPoint[]>([]);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [tradingSignal, setTradingSignal] = useState<TradingSignal | null>(null);
  const [prediction, setPrediction] = useState<PricePrediction | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Note: This hook fetches XFI price data from CoinGecko via backend proxy
  // Price data and market data are real-time from CoinGecko (proxied through backend)
  // Trading signals and predictions are simplified samples (would need AI analysis)

  // Fetch price chart data
  const fetchPriceData = useCallback(async (days: number = 7) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch XFI price data via backend proxy
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3030';
      const response = await fetch(
        `${BACKEND_URL}/api/price/chart/crossfi-2?days=${days}&vs_currency=usd`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Backend API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('XFI price data (from backend proxy):', data);
      
      // Parse CoinGecko response format: { prices: [[timestamp, price], ...] }
      if (data.prices && data.prices.length > 0) {
        const formattedData: PriceDataPoint[] = data.prices.map((point: [number, number]) => ({
          timestamp: point[0],
          price: point[1],
          date: new Date(point[0]).toISOString(),
          volume: data.total_volumes?.find((v: [number, number]) => v[0] === point[0])?.[1],
          marketCap: data.market_caps?.find((m: [number, number]) => m[0] === point[0])?.[1]
        }));
        
        setPriceData(formattedData);
      } else {
        throw new Error('No price data received from CoinGecko');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch price data';
      setError(`Price data error: ${errorMessage}`);
      console.error('Error fetching price data:', err);
      console.error('Error details:', {
        name: err instanceof Error ? err.name : 'Unknown',
        message: err instanceof Error ? err.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch market data
  const fetchMarketData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch XFI market data via backend proxy
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3030';
      const response = await fetch(
        `${BACKEND_URL}/api/price/market/crossfi-2`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Backend API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('XFI market data (from backend proxy):', data);
      
      // Parse CoinGecko market data response
      if (data.market_data) {
        const marketData: MarketData = {
          symbol: data.symbol?.toUpperCase() || 'XFI',
          currentPrice: data.market_data.current_price?.usd || 0,
          marketCap: data.market_data.market_cap?.usd || 0,
          totalVolume: data.market_data.total_volume?.usd || 0,
          priceChange24h: data.market_data.price_change_24h || 0,
          priceChangePercentage24h: data.market_data.price_change_percentage_24h || 0,
          priceChangePercentage7d: data.market_data.price_change_percentage_7d || 0,
          ath: data.market_data.ath?.usd || 0,
          athChangePercentage: data.market_data.ath_change_percentage?.usd || 0,
          athDate: data.market_data.ath_date?.usd || new Date().toISOString(),
          lastUpdated: data.market_data.last_updated || new Date().toISOString()
        };
        
        setMarketData(marketData);
      } else {
        throw new Error('No market data received from CoinGecko');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch market data';
      setError(`Market data error: ${errorMessage}`);
      console.error('Error fetching market data:', err);
      console.error('Error details:', {
        name: err instanceof Error ? err.name : 'Unknown',
        message: err instanceof Error ? err.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch trading signal (simplified for now - would need AI analysis)
  const fetchTradingSignal = useCallback(async (timeframe: number = 14) => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, generate a basic trading signal based on recent price data
      // In the future, this could call an AI service for technical analysis
      
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      // Generate a sample trading signal based on current market trends
      const signals = ['BUY', 'SELL', 'HOLD'] as const;
      const strengths = ['WEAK', 'MODERATE', 'STRONG'] as const;
      const trends = ['BULLISH', 'BEARISH', 'SIDEWAYS'] as const;
      
      const sampleSignal: TradingSignal = {
        recommendation: 'HOLD',
        strength: 'MODERATE',
        confidence: 65,
        reasoning: ['XFI showing mixed signals in current market conditions', 'Volume suggests consolidation phase'],
        technicalIndicators: {
          trend: 'SIDEWAYS',
          rsi: 52,
          movingAverages: {
            ma20: 0.082,
            ma50: 0.081
          },
          keyLevels: {
            support: 0.075,
            resistance: 0.090
          }
        }
      };
      
      setTradingSignal(sampleSignal);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch trading signal';
      setError(errorMessage);
      console.error('Error fetching trading signal:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch price prediction (simplified for now - would need AI analysis)
  const fetchPrediction = useCallback(async (horizon: 'short' | 'medium' | 'long' = 'medium') => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, generate a basic prediction based on market data
      // In the future, this could call an AI service for price prediction
      
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      // Generate a conservative prediction based on current market trends
      const currentPrice = 0.082; // Will be updated with real data
      const conservativeGrowth = horizon === 'short' ? 0.05 : horizon === 'medium' ? 0.15 : 0.25;
      
      const samplePrediction: PricePrediction = {
        timeframe: `${horizon}-term`,
        currentPrice: currentPrice,
        targetPrice: currentPrice * (1 + conservativeGrowth),
        expectedChange: `+${(conservativeGrowth * 100).toFixed(1)}%`,
        confidence: horizon === 'short' ? 70 : horizon === 'medium' ? 55 : 40,
        scenarios: {
          bullish: {
            targetPrice: currentPrice * (1 + conservativeGrowth * 1.5),
            probability: 25,
            scenario: 'Strong CrossFi ecosystem adoption and market growth'
          },
          neutral: {
            targetPrice: currentPrice * (1 + conservativeGrowth),
            probability: 50,
            scenario: 'Steady development and moderate market performance'
          },
          bearish: {
            targetPrice: currentPrice * (1 - conservativeGrowth * 0.3),
            probability: 25,
            scenario: 'Market volatility and reduced trading activity'
          }
        }
      };
      
      setPrediction(samplePrediction);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch prediction';
      setError(errorMessage);
      console.error('Error fetching prediction:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh all data
  const refreshAll = useCallback(async () => {
    setLoading(true);
    
    try {
      await Promise.all([
        fetchPriceData(7),
        fetchMarketData(),
        fetchTradingSignal(14),
        fetchPrediction('medium')
      ]);
    } catch (err) {
      console.error('Error refreshing all data:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchPriceData, fetchMarketData, fetchTradingSignal, fetchPrediction]);

  // Update predictions when market data changes
  useEffect(() => {
    if (marketData && prediction) {
      const horizon = prediction.timeframe.includes('short') ? 'short' : 
                    prediction.timeframe.includes('long') ? 'long' : 'medium';
      const conservativeGrowth = horizon === 'short' ? 0.05 : horizon === 'medium' ? 0.15 : 0.25;
      
      const updatedPrediction: PricePrediction = {
        ...prediction,
        currentPrice: marketData.currentPrice,
        targetPrice: marketData.currentPrice * (1 + conservativeGrowth),
        expectedChange: `+${(conservativeGrowth * 100).toFixed(1)}%`,
        scenarios: {
          bullish: {
            targetPrice: marketData.currentPrice * (1 + conservativeGrowth * 1.5),
            probability: 25,
            scenario: 'Strong CrossFi ecosystem adoption and market growth'
          },
          neutral: {
            targetPrice: marketData.currentPrice * (1 + conservativeGrowth),
            probability: 50,
            scenario: 'Steady development and moderate market performance'
          },
          bearish: {
            targetPrice: marketData.currentPrice * (1 - conservativeGrowth * 0.3),
            probability: 25,
            scenario: 'Market volatility and reduced trading activity'
          }
        }
      };
      
      setPrediction(updatedPrediction);
    }
  }, [marketData]);

  // Initial load
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return {
    // Data
    priceData,
    marketData,
    tradingSignal,
    prediction,
    
    // State
    loading,
    error,
    
    // Actions
    fetchPriceData,
    fetchMarketData,
    fetchTradingSignal,
    fetchPrediction,
    refreshAll,
  };
}; 