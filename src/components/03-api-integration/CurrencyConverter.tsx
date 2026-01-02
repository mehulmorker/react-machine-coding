import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  DollarSign, 
  ArrowRightLeft, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Star,
  StarOff,
  Calculator,
  Clock,
  AlertCircle,
  RefreshCw,
  BarChart3,
  Globe,
  Heart,
  Info,
  Calendar,
  Activity
} from 'lucide-react';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  change24h: number;
  lastUpdated: Date;
}

interface HistoricalData {
  date: string;
  rate: number;
}

const POPULAR_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' }
];

// Mock exchange rate generator
const generateMockRates = (): ExchangeRate[] => {
  const rates: ExchangeRate[] = [];
  
  for (let i = 0; i < POPULAR_CURRENCIES.length; i++) {
    for (let j = 0; j < POPULAR_CURRENCIES.length; j++) {
      if (i !== j) {
        const from = POPULAR_CURRENCIES[i];
        const to = POPULAR_CURRENCIES[j];
        
        // Generate realistic exchange rates
        let baseRate = 1;
        if (from.code === 'USD') {
          baseRate = getUSDRate(to.code);
        } else if (to.code === 'USD') {
          baseRate = 1 / getUSDRate(from.code);
        } else {
          baseRate = getUSDRate(to.code) / getUSDRate(from.code);
        }
        
        rates.push({
          from: from.code,
          to: to.code,
          rate: baseRate,
          change24h: (Math.random() - 0.5) * 10, // -5% to +5%
          lastUpdated: new Date()
        });
      }
    }
  }
  
  return rates;
};

const getUSDRate = (currency: string): number => {
  const rates: { [key: string]: number } = {
    'EUR': 0.85,
    'GBP': 0.73,
    'JPY': 150,
    'CAD': 1.35,
    'AUD': 1.50,
    'CHF': 0.88,
    'CNY': 7.3,
    'INR': 83,
    'BRL': 5.2
  };
  return rates[currency] || 1;
};

// Generate historical data
const generateHistoricalData = (fromCurrency: string, toCurrency: string): HistoricalData[] => {
  const data: HistoricalData[] = [];
  const today = new Date();
  const baseRate = getUSDRate(toCurrency) / getUSDRate(fromCurrency);
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate some volatility
    const volatility = (Math.random() - 0.5) * 0.1;
    const rate = baseRate * (1 + volatility);
    
    data.push({
      date: date.toISOString().split('T')[0],
      rate: rate
    });
  }
  
  return data;
};

const CurrencyConverter: React.FC = () => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('100');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [favorites, setFavorites] = useState<string[]>(['USD', 'EUR', 'GBP']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showChart, setShowChart] = useState(false);

  // Get current exchange rate
  const currentRate = useMemo(() => {
    return exchangeRates.find(rate => 
      rate.from === fromCurrency && rate.to === toCurrency
    );
  }, [exchangeRates, fromCurrency, toCurrency]);

  // Calculate converted amount
  const convertedAmount = useMemo(() => {
    if (!currentRate || !amount) return '0';
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return '0';
    return (numAmount * currentRate.rate).toFixed(2);
  }, [amount, currentRate]);

  // Fetch exchange rates
  const fetchRates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRates = generateMockRates();
      setExchangeRates(mockRates);
      
      // Generate historical data for current pair
      const historical = generateHistoricalData(fromCurrency, toCurrency);
      setHistoricalData(historical);
      
    } catch (err) {
      setError('Failed to fetch exchange rates. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [fromCurrency, toCurrency]);

  // Refresh rates
  const refreshRates = useCallback(async () => {
    setRefreshing(true);
    await fetchRates();
    setRefreshing(false);
  }, [fetchRates]);

  // Swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Toggle favorite currency
  const toggleFavorite = (currencyCode: string) => {
    setFavorites(prev => 
      prev.includes(currencyCode)
        ? prev.filter(code => code !== currencyCode)
        : [...prev, currencyCode]
    );
  };

  // Get currency info
  const getCurrencyInfo = (code: string): Currency => {
    return POPULAR_CURRENCIES.find(curr => curr.code === code) || 
           { code, name: code, symbol: code, flag: '🌍' };
  };

  // Format number with commas
  const formatNumber = (num: string | number): string => {
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(numValue)) return '0';
    return numValue.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 6 
    });
  };

  // Get trend color
  const getTrendColor = (change: number): string => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // Get trend icon
  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Rates</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchRates}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Currency Converter</h1>
            </div>
            <button
              onClick={refreshRates}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Rates
            </button>
          </div>
          <p className="text-gray-600">
            Convert currencies with real-time exchange rates and historical data
          </p>
        </div>

        {/* Main Converter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
            {/* Amount Input */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <div className="relative">
                <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            {/* From Currency */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <div className="relative">
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg appearance-none bg-white"
                >
                  {POPULAR_CURRENCIES.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="lg:col-span-1 flex justify-center">
              <button
                onClick={swapCurrencies}
                className="p-3 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
              >
                <ArrowRightLeft className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </button>
            </div>

            {/* To Currency */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <div className="relative">
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg appearance-none bg-white"
                >
                  {POPULAR_CURRENCIES.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Result */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Result</label>
              <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg">
                <div className="text-lg font-semibold text-gray-900">
                  {getCurrencyInfo(toCurrency).symbol}{formatNumber(convertedAmount)}
                </div>
              </div>
            </div>
          </div>

          {/* Rate Information */}
          {currentRate && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    1 {fromCurrency} = {formatNumber(currentRate.rate)} {toCurrency}
                  </div>
                  <div className={`flex items-center space-x-1 text-sm ${getTrendColor(currentRate.change24h)}`}>
                    {getTrendIcon(currentRate.change24h)}
                    <span>{Math.abs(currentRate.change24h).toFixed(2)}%</span>
                    <span className="text-gray-500">24h</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Updated: {currentRate.lastUpdated.toLocaleTimeString()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Charts and Additional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Historical Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                30-Day Historical Chart
              </h2>
              <button
                onClick={() => setShowChart(!showChart)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
              >
                {showChart ? 'Hide' : 'Show'} Chart
              </button>
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
              {fromCurrency} to {toCurrency} exchange rate over the last 30 days
            </div>

            {showChart && (
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Interactive chart would be displayed here</p>
                  <p className="text-xs mt-1">Using libraries like Chart.js or D3.js</p>
                </div>
              </div>
            )}

            {/* Historical Data Summary */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-lg font-semibold text-gray-900">
                  {formatNumber(Math.max(...historicalData.map(d => d.rate)))}
                </div>
                <div className="text-xs text-gray-600">30-Day High</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-lg font-semibold text-gray-900">
                  {formatNumber(Math.min(...historicalData.map(d => d.rate)))}
                </div>
                <div className="text-xs text-gray-600">30-Day Low</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-lg font-semibold text-gray-900">
                  {formatNumber(historicalData.reduce((sum, d) => sum + d.rate, 0) / historicalData.length)}
                </div>
                <div className="text-xs text-gray-600">30-Day Average</div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Favorite Currencies */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Favorite Currencies
              </h3>
              <div className="space-y-2">
                {POPULAR_CURRENCIES.map(currency => (
                  <div key={currency.code} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{currency.flag}</span>
                      <div>
                        <div className="font-medium text-gray-900">{currency.code}</div>
                        <div className="text-xs text-gray-500">{currency.name}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(currency.code)}
                      className={`p-1 rounded transition-colors ${
                        favorites.includes(currency.code)
                          ? 'text-yellow-500 hover:text-yellow-600'
                          : 'text-gray-400 hover:text-yellow-500'
                      }`}
                    >
                      {favorites.includes(currency.code) ? (
                        <Star className="w-4 h-4 fill-current" />
                      ) : (
                        <StarOff className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Conversions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-blue-600" />
                Quick Conversions
              </h3>
              <div className="space-y-3">
                {favorites.slice(0, 3).map(currencyCode => {
                  const rate = exchangeRates.find(r => r.from === fromCurrency && r.to === currencyCode);
                  return (
                    <div key={currencyCode} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <span className="text-sm mr-2">{getCurrencyInfo(currencyCode).flag}</span>
                        <span className="text-sm font-medium">{currencyCode}</span>
                      </div>
                      <div className="text-sm font-medium">
                        {rate ? formatNumber((parseFloat(amount) || 0) * rate.rate) : '--'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Market Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-green-600" />
                Market Info
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Market Status</span>
                  <span className="text-green-600 font-medium">Open</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Update</span>
                  <span className="text-gray-900">Just now</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Data Source</span>
                  <span className="text-gray-900">Mock API</span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-start">
                    <Info className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-xs text-gray-600">
                      Exchange rates are for demonstration purposes only. 
                      Use real financial APIs for actual trading.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter; 