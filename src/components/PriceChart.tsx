import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3, RefreshCw, AlertCircle } from 'lucide-react';
import { usePriceData } from '../hooks/usePriceData';
import { TimeFrame } from '../stores/priceStore';

interface TradingSignal {
  type: 'BUY' | 'SELL' | 'HOLD';
  strength: 'WEAK' | 'MODERATE' | 'STRONG';
  confidence: number;
  reasoning: string[];
}

interface PriceChartProps {
  coinId?: string;
  tradingSignal?: TradingSignal;
  className?: string;
}

const timeRangeOptions = [
  { label: '24H', timeframe: '1' as TimeFrame },
  { label: '7D', timeframe: '7' as TimeFrame },
  { label: '30D', timeframe: '30' as TimeFrame },
  { label: '90D', timeframe: '90' as TimeFrame },
  { label: '1Y', timeframe: '365' as TimeFrame }
];

export const PriceChart: React.FC<PriceChartProps> = ({
  coinId = 'crossfi',
  tradingSignal,
  className = ''
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>('7');
  
  // Use the new Zustand-powered hook
  const {
    chartData,
    marketData,
    loading,
    errors,
    fetchData,
    refreshData,
  } = usePriceData({
    coinId,
    autoFetch: true,
  });

  // Get current timeframe data
  const currentData = chartData[selectedTimeframe] || [];
  const isLoading = loading[selectedTimeframe] || false;
  const error = errors[selectedTimeframe];

  // Calculate price statistics with outlier detection
  const priceAnalysis = useMemo(() => {
    const allPrices = currentData.map((d: any) => d.price).filter((p: number) => p > 0);
    
    if (allPrices.length === 0) {
      return {
        allPrices: [],
        sortedPrices: [],
        prices: [],
        minPrice: 0,
        maxPrice: 0,
        avgPrice: 0,
        lowerBound: 0,
        upperBound: 0,
        p5: 0,
        p95: 0
      };
    }
    
    // Remove outliers using IQR method
    const sortedPrices = [...allPrices].sort((a, b) => a - b);
    const q1 = sortedPrices[Math.floor(sortedPrices.length * 0.25)] || 0;
    const q3 = sortedPrices[Math.floor(sortedPrices.length * 0.75)] || 0;
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    // Percentile bounds for fallback
    const p5 = sortedPrices[Math.floor(sortedPrices.length * 0.05)] || 0;
    const p95 = sortedPrices[Math.floor(sortedPrices.length * 0.95)] || 0;
    
    // Filter out outliers for chart display
    let prices = allPrices.filter(price => price >= lowerBound && price <= upperBound);
    
    // If too many outliers removed, fall back to percentile-based filtering
    if (prices.length < allPrices.length * 0.7) {
      prices = allPrices.filter(price => price >= p5 && price <= p95);
    }
    
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
    const avgPrice = prices.length > 0 ? prices.reduce((sum: number, price: number) => sum + price, 0) / prices.length : 0;
    
    return {
      allPrices,
      sortedPrices,
      prices,
      minPrice,
      maxPrice,
      avgPrice,
      lowerBound,
      upperBound,
      p5,
      p95
    };
  }, [currentData]);

  // Debug logging
  console.log('Price data debug:', {
    totalPoints: priceAnalysis.allPrices.length,
    filteredPoints: priceAnalysis.prices.length,
    minPrice: priceAnalysis.minPrice,
    maxPrice: priceAnalysis.maxPrice,
    avgPrice: priceAnalysis.avgPrice,
    outliers: priceAnalysis.allPrices.length - priceAnalysis.prices.length
  });

  const handleTimeRangeChange = async (timeframe: TimeFrame) => {
    console.log(`🔄 Button clicked for timeframe: ${timeframe}`);
    console.log(`📊 Current data before change:`, {
      selectedTimeframe,
      currentDataLength: currentData.length,
      chartData: Object.keys(chartData).map(tf => ({ timeframe: tf, length: chartData[tf as TimeFrame].length }))
    });
    
    setSelectedTimeframe(timeframe);
    
    try {
      console.log(`🚀 Starting fetchData for ${timeframe}...`);
      await fetchData(timeframe);
      console.log(`✅ Successfully fetched data for ${timeframe}`);
    } catch (error) {
      console.error(`❌ Failed to fetch data for ${timeframe}:`, error);
    }
  };

  // Determine price trend color
  const priceChange24h = marketData?.price_change_percentage_24h;
  const trendColor = priceChange24h !== undefined 
    ? priceChange24h >= 0 ? '#10B981' : '#EF4444'
    : '#6B7280';

  const signalColor = tradingSignal?.type === 'BUY' 
    ? '#10B981' 
    : tradingSignal?.type === 'SELL' 
    ? '#EF4444' 
    : '#F59E0B';

  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-600 rounded w-32"></div>
            <div className="h-8 bg-gray-600 rounded w-24"></div>
          </div>
          <div className="h-64 bg-gray-600 rounded mb-4"></div>
          <div className="flex space-x-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-8 bg-gray-600 rounded w-12"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Create a simple visual representation of price data
  const createSimpleChart = () => {
    if (currentData.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center bg-gray-800/30 rounded-lg">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400">No price data available</p>
          </div>
        </div>
      );
    }

    // Calculate chart dimensions and scaling
    const chartWidth = 100; // percentage
    const chartHeight = 200; // pixels
    
    // Create filtered dataset for chart (remove outliers)
    const filteredData = currentData.filter((d: any) => {
      const price = d.price;
      return price >= priceAnalysis.lowerBound && price <= priceAnalysis.upperBound && price > 0;
    });
    
    // If too few points after filtering, use percentile filtering
    const finalData = filteredData.length < currentData.length * 0.7 ? 
      currentData.filter((d: any) => {
        const price = d.price;
        return price >= priceAnalysis.p5 && price <= priceAnalysis.p95 && price > 0;
      }) : filteredData;
    
    console.log('Chart data points:', {
      original: currentData.length,
      filtered: finalData.length,
      priceRange: [priceAnalysis.minPrice, priceAnalysis.maxPrice]
    });
    
    // Normalize prices for visualization
    const normalizedPrices = finalData.map((d: any) => {
      if (priceAnalysis.maxPrice === priceAnalysis.minPrice) return 50; // If all prices are the same
      return ((d.price - priceAnalysis.minPrice) / (priceAnalysis.maxPrice - priceAnalysis.minPrice)) * 80 + 10; // 10-90% range
    });

    // Create SVG path
    const pathData = normalizedPrices.map((price, index) => {
      const x = (index / (normalizedPrices.length - 1)) * chartWidth;
      const y = chartHeight - (price / 100) * chartHeight;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    return (
      <div className="h-64 bg-gray-800/30 rounded-lg p-4 relative overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          <defs>
            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={trendColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={trendColor} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          
          {/* Horizontal grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={chartHeight - (y / 100) * chartHeight}
              x2={chartWidth}
              y2={chartHeight - (y / 100) * chartHeight}
              stroke="#374151"
              strokeWidth="0.5"
              opacity="0.3"
            />
          ))}
          
          {/* Price area */}
          <path
            d={`${pathData} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`}
            fill="url(#priceGradient)"
          />
          
          {/* Price line */}
          <path
            d={pathData}
            fill="none"
            stroke={trendColor}
            strokeWidth="2"
          />
          
          {/* Data points */}
          {normalizedPrices.map((price, index) => {
            const x = (index / (normalizedPrices.length - 1)) * chartWidth;
            const y = chartHeight - (price / 100) * chartHeight;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill={trendColor}
                opacity="0.8"
              />
            );
          })}
        </svg>
        
        {/* Price labels */}
        <div className="absolute top-2 left-2 text-xs text-gray-400">
          ${priceAnalysis.maxPrice.toFixed(5)}
        </div>
        <div className="absolute bottom-2 left-2 text-xs text-gray-400">
          ${priceAnalysis.minPrice.toFixed(5)}
        </div>
        <div className="absolute top-2 right-2 text-xs text-gray-400">
          {finalData.length} points
          {finalData.length < currentData.length && (
            <div className="text-xs text-yellow-400 mt-1">
              {currentData.length - finalData.length} outliers removed
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-bold text-white">XFI Price Chart</h3>
          {marketData?.current_price && (
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">
                ${marketData.current_price.toFixed(5)}
              </span>
              {priceChange24h !== undefined && (
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${
                  priceChange24h >= 0 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {priceChange24h >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{priceChange24h >= 0 ? '+' : ''}{priceChange24h.toFixed(2)}%</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Chart Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => refreshData(selectedTimeframe)}
            className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300 text-sm">Failed to load price data: {error}</span>
            <button
              onClick={() => refreshData(selectedTimeframe)}
              className="ml-auto px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-red-300 text-xs transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Trading Signal */}
      {tradingSignal && (
        <div className="mb-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-300">AI Trading Signal</h4>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              tradingSignal.type === 'BUY' 
                ? 'bg-green-500/20 text-green-400' 
                : tradingSignal.type === 'SELL'
                ? 'bg-red-500/20 text-red-400'
                : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {tradingSignal.type}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">
              {tradingSignal.strength} • {tradingSignal.confidence}% confidence
            </span>
            <div className="w-24 bg-gray-700 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${tradingSignal.confidence}%`,
                  backgroundColor: signalColor
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Price Statistics */}
      {priceAnalysis.prices.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800/30 rounded-lg p-3">
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Range High</p>
            <p className="text-white font-semibold">${priceAnalysis.maxPrice.toFixed(5)}</p>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3">
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Range Low</p>
            <p className="text-white font-semibold">${priceAnalysis.minPrice.toFixed(5)}</p>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3">
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Average</p>
            <p className="text-white font-semibold">${priceAnalysis.avgPrice.toFixed(5)}</p>
          </div>
        </div>
      )}

      {/* Chart */}
      {createSimpleChart()}

      {/* Time Range Selector */}
      <div className="flex items-center justify-center space-x-2 mt-6">
        {timeRangeOptions.map((option) => {
          const isLoading = loading[option.timeframe] || false;
          const isSelected = selectedTimeframe === option.timeframe;
          
          return (
            <button
              key={option.label}
              onClick={() => handleTimeRangeChange(option.timeframe)}
              disabled={isLoading}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
              }`}
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                </div>
              )}
              <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Trading Signal Reasoning */}
      {tradingSignal && tradingSignal.reasoning.length > 0 && (
        <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Analysis Reasoning</h4>
          <ul className="space-y-1">
            {tradingSignal.reasoning.slice(0, 3).map((reason, index) => (
              <li key={index} className="text-gray-400 text-xs flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Chart Library Notice */}
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-blue-300 text-xs">
              <strong>Enhanced Charts Available:</strong> Install recharts library for advanced interactive charts with zoom, tooltips, and detailed technical indicators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 