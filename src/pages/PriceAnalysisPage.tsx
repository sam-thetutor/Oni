import React, { useState } from 'react';
import { PriceChart } from '../components/PriceChart';
import { usePriceChart } from '../hooks/usePriceChart';
import { TrendingUp, TrendingDown, Target, Brain, AlertCircle, RefreshCw } from 'lucide-react';

export const PriceAnalysisPage: React.FC = () => {
  const {
    priceData,
    marketData,
    tradingSignal,
    prediction,
    loading,
    error,
    fetchPriceData,
    fetchTradingSignal,
    fetchPrediction,
    refreshAll
  } = usePriceChart();

  const [selectedTimeframe, setSelectedTimeframe] = useState(7);
  const [selectedPredictionHorizon, setSelectedPredictionHorizon] = useState<'short' | 'medium' | 'long'>('medium');

  const handleTimeRangeChange = async (days: number) => {
    setSelectedTimeframe(days);
    await fetchPriceData(days);
  };

  const handlePredictionHorizonChange = async (horizon: 'short' | 'medium' | 'long') => {
    setSelectedPredictionHorizon(horizon);
    await fetchPrediction(horizon);
  };

  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'BUY':
        return <TrendingUp className="w-5 h-5" />;
      case 'SELL':
        return <TrendingDown className="w-5 h-5" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  const getSignalColor = (type: string) => {
    switch (type) {
      case 'BUY':
        return 'text-green-400 bg-green-500/20';
      case 'SELL':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-yellow-400 bg-yellow-500/20';
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Price Data</h2>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={refreshAll}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">XFI Price Analysis</h1>
          <p className="text-gray-400">AI-powered market insights and trading signals for CrossFi (XFI)</p>
        </div>
        <button
          onClick={refreshAll}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Market Overview */}
      {marketData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Current Price</h3>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">
                ${marketData.currentPrice.toFixed(5)}
              </span>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                marketData.priceChangePercentage24h >= 0 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {marketData.priceChangePercentage24h >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{marketData.priceChangePercentage24h >= 0 ? '+' : ''}{marketData.priceChangePercentage24h.toFixed(2)}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Market Cap</h3>
            <span className="text-2xl font-bold text-white">
              ${(marketData.marketCap / 1000000).toFixed(2)}M
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">24h Volume</h3>
            <span className="text-2xl font-bold text-white">
              ${(marketData.totalVolume / 1000).toFixed(0)}K
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">All-Time High</h3>
            <div className="space-y-1">
              <span className="text-2xl font-bold text-white">
                ${marketData.ath.toFixed(5)}
              </span>
              <p className="text-xs text-gray-400">
                {marketData.athChangePercentage.toFixed(1)}% from ATH
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Price Chart */}
      <PriceChart
        data={priceData}
        timeRange={`${selectedTimeframe}D`}
        isLoading={loading}
        onTimeRangeChange={handleTimeRangeChange}
        tradingSignal={tradingSignal ? {
          type: tradingSignal.recommendation,
          strength: tradingSignal.strength,
          confidence: tradingSignal.confidence,
          reasoning: tradingSignal.reasoning
        } : undefined}
        currentPrice={marketData?.currentPrice}
        priceChange24h={marketData?.priceChangePercentage24h}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trading Signal */}
        {tradingSignal && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">AI Trading Signal</h3>
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${getSignalColor(tradingSignal.recommendation)}`}>
                {getSignalIcon(tradingSignal.recommendation)}
                <span className="font-bold text-sm">{tradingSignal.recommendation}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Strength</span>
                <span className="text-white font-medium">{tradingSignal.strength}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Confidence</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${tradingSignal.confidence}%`,
                        backgroundColor: tradingSignal.confidence > 70 ? '#10B981' : tradingSignal.confidence > 50 ? '#F59E0B' : '#EF4444'
                      }}
                    />
                  </div>
                  <span className="text-white font-medium">{tradingSignal.confidence}%</span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 block mb-2">Technical Indicators</span>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-800/30 rounded-lg p-3">
                    <p className="text-gray-400 mb-1">Trend</p>
                    <p className={`font-medium ${
                      tradingSignal.technicalIndicators.trend === 'BULLISH' ? 'text-green-400' :
                      tradingSignal.technicalIndicators.trend === 'BEARISH' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {tradingSignal.technicalIndicators.trend}
                    </p>
                  </div>
                  {tradingSignal.technicalIndicators.rsi && (
                    <div className="bg-gray-800/30 rounded-lg p-3">
                      <p className="text-gray-400 mb-1">RSI</p>
                      <p className="font-medium text-white">{tradingSignal.technicalIndicators.rsi.toFixed(1)}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <span className="text-gray-400 block mb-2">Analysis Reasoning</span>
                <ul className="space-y-1">
                  {tradingSignal.reasoning.slice(0, 3).map((reason, index) => (
                    <li key={index} className="text-gray-300 text-sm flex items-start">
                      <span className="text-blue-400 mr-2 mt-1">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Price Prediction */}
        {prediction && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Price Prediction</h3>
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span className="text-purple-400 text-sm font-medium">AI Forecast</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-center py-4 bg-gray-800/30 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">{prediction.timeframe} Target</p>
                <p className="text-2xl font-bold text-white mb-1">
                  ${prediction.targetPrice.toFixed(5)}
                </p>
                <p className={`text-sm font-medium ${
                  prediction.expectedChange.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {prediction.expectedChange}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Confidence</span>
                <span className="text-white font-medium">{prediction.confidence}%</span>
              </div>

              {/* Prediction Horizon Selector */}
              <div>
                <p className="text-gray-400 text-sm mb-2">Prediction Timeframe</p>
                <div className="flex space-x-2">
                  {(['short', 'medium', 'long'] as const).map((horizon) => (
                    <button
                      key={horizon}
                      onClick={() => handlePredictionHorizonChange(horizon)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        selectedPredictionHorizon === horizon
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                      }`}
                    >
                      {horizon === 'short' ? '1W' : horizon === 'medium' ? '3W' : '2M'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scenarios */}
              {prediction.scenarios && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Scenarios</p>
                  <div className="space-y-2">
                    {Object.entries(prediction.scenarios).map(([scenario, data]) => (
                      <div key={scenario} className="flex items-center justify-between bg-gray-800/30 rounded-lg p-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            scenario === 'bullish' ? 'bg-green-400' :
                            scenario === 'bearish' ? 'bg-red-400' : 'bg-yellow-400'
                          }`} />
                          <span className="text-white text-sm font-medium capitalize">{scenario}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-white text-sm font-medium">
                            ${data.targetPrice.toFixed(5)}
                          </p>
                          <p className="text-gray-400 text-xs">{data.probability}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-yellow-400 font-medium mb-1">Important Disclaimer</h4>
            <p className="text-yellow-300 text-sm">
              This analysis is generated by AI for educational purposes only and should not be considered as financial advice. 
              Cryptocurrency markets are highly volatile and unpredictable. Always conduct your own research and consider 
              consulting with a financial advisor before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 