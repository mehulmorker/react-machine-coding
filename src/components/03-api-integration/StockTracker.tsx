import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Search, 
  Eye, 
  EyeOff, 
  DollarSign, 
  Percent, 
  BarChart3, 
  LineChart, 
  RefreshCw, 
  Star, 
  StarOff, 
  Bell, 
  BellOff,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  previousClose: number;
  high52Week: number;
  low52Week: number;
  dividendYield?: number;
  peRatio?: number;
  sector: string;
}

interface PortfolioItem {
  stock: Stock;
  shares: number;
  purchasePrice: number;
  purchaseDate: string;
}

interface MarketNews {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  relatedSymbols: string[];
}

const StockTracker: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [marketNews, setMarketNews] = useState<MarketNews[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [activeTab, setActiveTab] = useState<'stocks' | 'watchlist' | 'portfolio' | 'news'>('stocks');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'change' | 'volume' | 'marketCap'>('symbol');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [alerts, setAlerts] = useState<{[symbol: string]: {price: number, type: 'above' | 'below'}}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(30); // seconds

  // Generate mock stock data
  const generateStockData = useCallback((): Stock[] => {
    const stockData = [
      { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary' },
      { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Discretionary' },
      { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology' },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financials' },
      { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
      { symbol: 'V', name: 'Visa Inc.', sector: 'Financials' },
      { symbol: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer Staples' },
      { symbol: 'UNH', name: 'UnitedHealth Group Inc.', sector: 'Healthcare' },
      { symbol: 'HD', name: 'Home Depot Inc.', sector: 'Consumer Discretionary' },
      { symbol: 'MA', name: 'Mastercard Inc.', sector: 'Financials' },
      { symbol: 'DIS', name: 'Walt Disney Co.', sector: 'Communication Services' },
      { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology' },
      { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services' },
      { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology' },
      { symbol: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology' },
      { symbol: 'PYPL', name: 'PayPal Holdings Inc.', sector: 'Financials' }
    ];

    return stockData.map(stock => {
      const basePrice = Math.random() * 500 + 50;
      const change = (Math.random() - 0.5) * 20;
      const changePercent = (change / basePrice) * 100;
      
      return {
        ...stock,
        price: Math.round(basePrice * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
        volume: Math.floor(Math.random() * 10000000) + 1000000,
        marketCap: Math.floor(Math.random() * 2000000000000) + 100000000000,
        previousClose: Math.round((basePrice - change) * 100) / 100,
        high52Week: Math.round((basePrice * 1.3) * 100) / 100,
        low52Week: Math.round((basePrice * 0.7) * 100) / 100,
        dividendYield: Math.random() > 0.3 ? Math.round(Math.random() * 5 * 100) / 100 : undefined,
        peRatio: Math.round((Math.random() * 40 + 10) * 100) / 100
      };
    });
  }, []);

  // Generate mock market news
  const generateMarketNews = useCallback((): MarketNews[] => {
    const newsTemplates = [
      { title: "Tech Stocks Rally on Strong Earnings", source: "Financial Times", symbols: ["AAPL", "GOOGL", "MSFT"] },
      { title: "Federal Reserve Signals Interest Rate Changes", source: "Reuters", symbols: ["JPM", "V", "MA"] },
      { title: "Energy Sector Faces Volatility", source: "Bloomberg", symbols: ["XOM", "CVX"] },
      { title: "Healthcare Innovation Drives Growth", source: "Wall Street Journal", symbols: ["JNJ", "UNH"] },
      { title: "Streaming Wars Heat Up", source: "CNBC", symbols: ["NFLX", "DIS"] },
      { title: "Electric Vehicle Market Expansion", source: "MarketWatch", symbols: ["TSLA"] },
      { title: "Cloud Computing Boom Continues", source: "TechCrunch", symbols: ["AMZN", "MSFT", "GOOGL"] },
      { title: "Cryptocurrency Market Update", source: "CoinDesk", symbols: ["PYPL", "SQ"] },
      { title: "Retail Earnings Beat Expectations", source: "Barron's", symbols: ["HD", "WMT"] },
      { title: "AI Revolution Impacts Multiple Sectors", source: "Wired", symbols: ["NVDA", "GOOGL", "MSFT"] }
    ];

    return newsTemplates.map((template, index) => ({
      id: `news-${index}`,
      title: template.title,
      summary: `Market analysis and insights on ${template.title.toLowerCase()}. Expert opinions and future outlook for related sectors and companies.`,
      source: template.source,
      publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      url: `#news-${index}`,
      relatedSymbols: template.symbols
    }));
  }, []);

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        setStocks(generateStockData());
        setMarketNews(generateMarketNews());
        setError(null);
      } catch (err) {
        setError('Failed to load market data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [generateStockData, generateMarketNews]);

  // Auto-refresh data
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        setStocks(generateStockData());
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, generateStockData]);

  // Filter and sort stocks
  const filteredAndSortedStocks = useMemo(() => {
    let filtered = stocks.filter(stock =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue as string)
          : (bValue as string).localeCompare(aValue);
      }
      
      return sortOrder === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return filtered;
  }, [stocks, searchQuery, sortBy, sortOrder]);

  // Watchlist functions
  const toggleWatchlist = (symbol: string) => {
    setWatchlist(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const watchlistStocks = useMemo(() => 
    stocks.filter(stock => watchlist.includes(stock.symbol)),
    [stocks, watchlist]
  );

  // Portfolio functions
  const addToPortfolio = (stock: Stock, shares: number, purchasePrice: number) => {
    const newItem: PortfolioItem = {
      stock,
      shares,
      purchasePrice,
      purchaseDate: new Date().toISOString().split('T')[0]
    };
    setPortfolio(prev => [...prev, newItem]);
  };

  const removeFromPortfolio = (index: number) => {
    setPortfolio(prev => prev.filter((_, i) => i !== index));
  };

  // Portfolio calculations
  const portfolioValue = useMemo(() => {
    return portfolio.reduce((total, item) => {
      return total + (item.stock.price * item.shares);
    }, 0);
  }, [portfolio]);

  const portfolioGainLoss = useMemo(() => {
    return portfolio.reduce((total, item) => {
      const currentValue = item.stock.price * item.shares;
      const purchaseValue = item.purchasePrice * item.shares;
      return total + (currentValue - purchaseValue);
    }, 0);
  }, [portfolio]);

  // Alert functions
  const setAlert = (symbol: string, price: number, type: 'above' | 'below') => {
    setAlerts(prev => ({
      ...prev,
      [symbol]: { price, type }
    }));
  };

  const removeAlert = (symbol: string) => {
    setAlerts(prev => {
      const newAlerts = { ...prev };
      delete newAlerts[symbol];
      return newAlerts;
    });
  };

  // Check alerts
  useEffect(() => {
    Object.entries(alerts).forEach(([symbol, alert]) => {
      const stock = stocks.find(s => s.symbol === symbol);
      if (stock) {
        if (
          (alert.type === 'above' && stock.price >= alert.price) ||
          (alert.type === 'below' && stock.price <= alert.price)
        ) {
          // In a real app, this would trigger a notification
          console.log(`Alert: ${symbol} is ${alert.type} $${alert.price}`);
        }
      }
    });
  }, [stocks, alerts]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toFixed(0)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading market data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 p-4 rounded-lg mb-4">
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
                Stock Tracker
              </h1>
              <p className="text-gray-600 mt-1">Real-time market data and portfolio management</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Refresh Settings */}
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value={0}>No Auto-refresh</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={300}>5 minutes</option>
              </select>
              
              {/* Manual Refresh */}
              <button
                onClick={() => setStocks(generateStockData())}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Summary */}
        {portfolio.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Portfolio Value</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(portfolioValue)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Gain/Loss</h3>
              <p className={`text-2xl font-bold ${portfolioGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(portfolioGainLoss)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Holdings</h3>
              <p className="text-2xl font-bold text-gray-900">{portfolio.length}</p>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'stocks', label: 'All Stocks', count: stocks.length },
                { key: 'watchlist', label: 'Watchlist', count: watchlist.length },
                { key: 'portfolio', label: 'Portfolio', count: portfolio.length },
                { key: 'news', label: 'Market News', count: marketNews.length }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Controls */}
          {(activeTab === 'stocks' || activeTab === 'watchlist') && (
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search stocks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Sort */}
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortBy(field as any);
                      setSortOrder(order as any);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="symbol-asc">Symbol (A-Z)</option>
                    <option value="symbol-desc">Symbol (Z-A)</option>
                    <option value="price-desc">Price (High-Low)</option>
                    <option value="price-asc">Price (Low-High)</option>
                    <option value="change-desc">Change (High-Low)</option>
                    <option value="change-asc">Change (Low-High)</option>
                    <option value="volume-desc">Volume (High-Low)</option>
                    <option value="marketCap-desc">Market Cap (High-Low)</option>
                  </select>
                </div>

                {/* View Mode */}
                <div className="flex items-center">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-l-lg border ${
                      viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-r-lg border-t border-r border-b ${
                      viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {activeTab === 'stocks' && (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredAndSortedStocks.map((stock) => (
              <div
                key={stock.symbol}
                className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                  viewMode === 'list' ? 'p-6' : 'p-4'
                }`}
                onClick={() => setSelectedStock(stock)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{stock.symbol}</h3>
                    <p className="text-sm text-gray-600">{stock.name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(stock.symbol);
                      }}
                      className={`p-1 rounded ${
                        watchlist.includes(stock.symbol) ? 'text-yellow-500' : 'text-gray-400'
                      }`}
                    >
                      {watchlist.includes(stock.symbol) ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alerts[stock.symbol] ? removeAlert(stock.symbol) : setAlert(stock.symbol, stock.price, 'above');
                      }}
                      className={`p-1 rounded ${
                        alerts[stock.symbol] ? 'text-blue-500' : 'text-gray-400'
                      }`}
                    >
                      {alerts[stock.symbol] ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stock.price)}</p>
                    <div className="flex items-center mt-1">
                      {stock.change >= 0 ? (
                        <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(Math.abs(stock.change))} ({Math.abs(stock.changePercent).toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>Volume: {stock.volume.toLocaleString()}</p>
                    <p>Mkt Cap: {formatNumber(stock.marketCap)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'watchlist' && (
          <div className="space-y-4">
            {watchlistStocks.length === 0 ? (
              <div className="text-center py-12">
                <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No stocks in your watchlist yet.</p>
                <p className="text-sm text-gray-500">Click the star icon on any stock to add it to your watchlist.</p>
              </div>
            ) : (
              watchlistStocks.map((stock) => (
                <div key={stock.symbol} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{stock.symbol}</h3>
                        <p className="text-sm text-gray-600">{stock.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">{formatCurrency(stock.price)}</p>
                        <div className="flex items-center">
                          {stock.change >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                          )}
                          <span className={`text-sm font-medium ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(Math.abs(stock.change))} ({Math.abs(stock.changePercent).toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleWatchlist(stock.symbol)}
                        className="text-yellow-500 p-2 hover:bg-yellow-50 rounded"
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                      <button
                        onClick={() => {
                          const shares = prompt('Enter number of shares:');
                          const price = prompt('Enter purchase price:');
                          if (shares && price) {
                            addToPortfolio(stock, Number(shares), Number(price));
                          }
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Add to Portfolio
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="space-y-4">
            {portfolio.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Your portfolio is empty.</p>
                <p className="text-sm text-gray-500">Add stocks from your watchlist to start tracking your investments.</p>
              </div>
            ) : (
              portfolio.map((item, index) => {
                const currentValue = item.stock.price * item.shares;
                const purchaseValue = item.purchasePrice * item.shares;
                const gainLoss = currentValue - purchaseValue;
                const gainLossPercent = (gainLoss / purchaseValue) * 100;

                return (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{item.stock.symbol}</h3>
                          <p className="text-sm text-gray-600">{item.stock.name}</p>
                          <p className="text-xs text-gray-500">
                            {item.shares} shares • Purchased: {new Date(item.purchaseDate).toLocaleDateString()} • {formatCurrency(item.purchasePrice)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">{formatCurrency(currentValue)}</p>
                        <div className="flex items-center justify-end">
                          {gainLoss >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                          )}
                          <span className={`text-sm font-medium ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(Math.abs(gainLoss))} ({Math.abs(gainLossPercent).toFixed(2)}%)
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromPortfolio(index)}
                          className="text-red-600 text-sm hover:text-red-800 mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'news' && (
          <div className="space-y-6">
            {marketNews.map((news) => (
              <div key={news.id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{news.title}</h3>
                    <p className="text-gray-600 mb-3">{news.summary}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{news.source}</span>
                      <span>•</span>
                      <span>{new Date(news.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                {news.relatedSymbols.length > 0 && (
                  <div className="flex items-center space-x-2 mt-3">
                    <span className="text-sm text-gray-500">Related:</span>
                    {news.relatedSymbols.map((symbol) => (
                      <span
                        key={symbol}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {symbol}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Stock Detail Modal */}
        {selectedStock && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedStock.symbol}</h2>
                    <p className="text-gray-600">{selectedStock.name}</p>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2 inline-block">
                      {selectedStock.sector}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedStock(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Price</h3>
                    <p className="text-3xl font-bold text-gray-900">{formatCurrency(selectedStock.price)}</p>
                    <div className="flex items-center mt-2">
                      {selectedStock.change >= 0 ? (
                        <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
                      )}
                      <span className={`font-medium ${selectedStock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(Math.abs(selectedStock.change))} ({Math.abs(selectedStock.changePercent).toFixed(2)}%)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Previous Close</p>
                        <p className="font-medium">{formatCurrency(selectedStock.previousClose)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Volume</p>
                        <p className="font-medium">{selectedStock.volume.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">52W High</p>
                        <p className="font-medium">{formatCurrency(selectedStock.high52Week)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">52W Low</p>
                        <p className="font-medium">{formatCurrency(selectedStock.low52Week)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Market Cap</p>
                        <p className="font-medium">{formatNumber(selectedStock.marketCap)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">P/E Ratio</p>
                        <p className="font-medium">{selectedStock.peRatio?.toFixed(2) || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => toggleWatchlist(selectedStock.symbol)}
                    className={`flex items-center px-4 py-2 rounded-lg border ${
                      watchlist.includes(selectedStock.symbol)
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {watchlist.includes(selectedStock.symbol) ? (
                      <Star className="w-4 h-4 mr-2 fill-current" />
                    ) : (
                      <StarOff className="w-4 h-4 mr-2" />
                    )}
                    {watchlist.includes(selectedStock.symbol) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  </button>

                  <button
                    onClick={() => {
                      const shares = prompt('Enter number of shares:');
                      const price = prompt('Enter purchase price:', selectedStock.price.toString());
                      if (shares && price) {
                        addToPortfolio(selectedStock, Number(shares), Number(price));
                        setSelectedStock(null);
                      }
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Portfolio
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockTracker; 