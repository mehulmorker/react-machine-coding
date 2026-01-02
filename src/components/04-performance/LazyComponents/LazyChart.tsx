import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Activity } from 'lucide-react';

// Simulate heavy component with data processing
const LazyChart: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      const chartData = Array.from({ length: 12 }, (_, i) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        sales: Math.floor(Math.random() * 1000) + 500,
        profit: Math.floor(Math.random() * 400) + 200,
        expenses: Math.floor(Math.random() * 300) + 100
      }));
      setData(chartData);
      setIsLoading(false);
    }, 1000); // Simulate loading time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-pulse text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Processing chart data...</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => Math.max(d.sales, d.profit, d.expenses)));

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Revenue Chart</h3>
            <p className="text-sm text-gray-600">Monthly performance overview</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2" />
            <span className="text-sm text-gray-600">Sales</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2" />
            <span className="text-sm text-gray-600">Profit</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2" />
            <span className="text-sm text-gray-600">Expenses</span>
          </div>
        </div>
      </div>

      <div className="h-64 flex items-end space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full flex items-end space-x-1 h-48">
              <div 
                className="bg-blue-500 rounded-t transition-all duration-1000 ease-out"
                style={{ 
                  height: `${(item.sales / maxValue) * 100}%`,
                  width: '30%'
                }}
                title={`Sales: $${item.sales}`}
              />
              <div 
                className="bg-green-500 rounded-t transition-all duration-1000 ease-out"
                style={{ 
                  height: `${(item.profit / maxValue) * 100}%`,
                  width: '30%'
                }}
                title={`Profit: $${item.profit}`}
              />
              <div 
                className="bg-red-500 rounded-t transition-all duration-1000 ease-out"
                style={{ 
                  height: `${(item.expenses / maxValue) * 100}%`,
                  width: '30%'
                }}
                title={`Expenses: $${item.expenses}`}
              />
            </div>
            <span className="text-xs text-gray-600 mt-2">{item.month}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">
            ${data.reduce((sum, item) => sum + item.sales, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Sales</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">
            ${data.reduce((sum, item) => sum + item.profit, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Profit</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">
            ${data.reduce((sum, item) => sum + item.expenses, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Expenses</div>
        </div>
      </div>
    </div>
  );
};

export default LazyChart; 