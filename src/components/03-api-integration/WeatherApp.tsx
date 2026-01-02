import React, { useState, useEffect, useCallback } from 'react';
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  MapPin,
  Loader2,
  AlertCircle,
  RefreshCw,
  Search,
  Navigation,
  Sunrise,
  Sunset,
  Gauge,
  CloudDrizzle
} from 'lucide-react';

interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  pressure: number;
  visibility: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  icon: string;
  sunrise: string;
  sunset: string;
  feelsLike: number;
  cloudCover: number;
}

interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

interface WeatherState {
  current: WeatherData | null;
  forecast: ForecastDay[];
  loading: boolean;
  error: string | null;
  searchLocation: string;
  unit: 'metric' | 'imperial';
  lastUpdated: Date | null;
  locationPermission: boolean;
}

// Mock weather data generator (since we don't have a real API key)
const generateMockWeatherData = (location: string): WeatherData => {
  const conditions = [
    { condition: 'Clear', description: 'Clear sky', icon: 'clear' },
    { condition: 'Clouds', description: 'Partly cloudy', icon: 'partly-cloudy' },
    { condition: 'Rain', description: 'Light rain', icon: 'rain' },
    { condition: 'Snow', description: 'Snow', icon: 'snow' },
    { condition: 'Thunderstorm', description: 'Thunderstorm', icon: 'thunderstorm' }
  ];

  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  const baseTemp = Math.floor(Math.random() * 30) + 10; // 10-40°C

  return {
    location: location || 'New York',
    country: 'US',
    temperature: baseTemp,
    condition: randomCondition.condition,
    description: randomCondition.description,
    humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
    pressure: Math.floor(Math.random() * 50) + 1000, // 1000-1050 hPa
    visibility: Math.floor(Math.random() * 10) + 5, // 5-15 km
    windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
    windDirection: Math.floor(Math.random() * 360), // 0-360°
    uvIndex: Math.floor(Math.random() * 11), // 0-10
    icon: randomCondition.icon,
    sunrise: '06:30',
    sunset: '18:45',
    feelsLike: baseTemp + Math.floor(Math.random() * 6) - 3, // ±3°C from actual temp
    cloudCover: Math.floor(Math.random() * 100) // 0-100%
  };
};

const generateMockForecast = (days: number = 7): ForecastDay[] => {
  const conditions = ['Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm'];
  const icons = ['clear', 'partly-cloudy', 'rain', 'snow', 'thunderstorm'];

  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index + 1);
    const conditionIndex = Math.floor(Math.random() * conditions.length);

    return {
      date: date.toISOString().split('T')[0],
      maxTemp: Math.floor(Math.random() * 15) + 20, // 20-35°C
      minTemp: Math.floor(Math.random() * 10) + 10, // 10-20°C
      condition: conditions[conditionIndex],
      icon: icons[conditionIndex],
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
      precipitation: Math.floor(Math.random() * 100) // 0-100%
    };
  });
};

const WeatherApp: React.FC = () => {
  const [state, setState] = useState<WeatherState>({
    current: null,
    forecast: [],
    loading: false,
    error: null,
    searchLocation: '',
    unit: 'metric',
    lastUpdated: null,
    locationPermission: false
  });

  // Get weather data
  const getWeatherData = useCallback(async (location?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, you would use a weather API like OpenWeatherMap
      const weatherData = generateMockWeatherData(location || 'Current Location');
      const forecastData = generateMockForecast(7);

      setState(prev => ({
        ...prev,
        current: weatherData,
        forecast: forecastData,
        loading: false,
        lastUpdated: new Date(),
        error: null
      }));

    } catch (error) {
      console.error('Error fetching weather data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch weather data. Please try again.'
      }));
    }
  }, []);

  // Get user location
  const getUserLocation = useCallback(() => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by this browser'
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real app, you would reverse geocode the coordinates to get the city name
        getWeatherData('Current Location');
        setState(prev => ({ ...prev, locationPermission: true }));
      },
      (error) => {
        console.error('Error getting location:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Unable to get your location. Please search for a city manually.'
        }));
        // Load default location
        getWeatherData('New York');
      }
    );
  }, [getWeatherData]);

  // Search for location
  const searchLocation = useCallback(() => {
    if (state.searchLocation.trim()) {
      getWeatherData(state.searchLocation.trim());
      setState(prev => ({ ...prev, searchLocation: '' }));
    }
  }, [state.searchLocation, getWeatherData]);

  // Convert temperature
  const convertTemp = useCallback((temp: number, unit: string) => {
    if (unit === 'imperial') {
      return Math.round((temp * 9/5) + 32);
    }
    return Math.round(temp);
  }, []);

  // Convert wind speed
  const convertWindSpeed = useCallback((speed: number, unit: string) => {
    if (unit === 'imperial') {
      return Math.round(speed * 0.621371); // km/h to mph
    }
    return Math.round(speed);
  }, []);

  // Get wind direction
  const getWindDirection = useCallback((degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  }, []);

  // Get weather icon
  const getWeatherIcon = (iconName: string, size: number = 24) => {
    const iconProps = { size, className: "text-current" };
    
    switch (iconName) {
      case 'clear':
        return <Sun {...iconProps} />;
      case 'partly-cloudy':
        return <Cloud {...iconProps} />;
      case 'rain':
        return <CloudRain {...iconProps} />;
      case 'snow':
        return <CloudSnow {...iconProps} />;
      case 'thunderstorm':
        return <CloudLightning {...iconProps} />;
      case 'drizzle':
        return <CloudDrizzle {...iconProps} />;
      default:
        return <Sun {...iconProps} />;
    }
  };

  // Get UV index color
  const getUVIndexColor = (uvIndex: number) => {
    if (uvIndex <= 2) return 'text-green-600';
    if (uvIndex <= 5) return 'text-yellow-600';
    if (uvIndex <= 7) return 'text-orange-600';
    if (uvIndex <= 10) return 'text-red-600';
    return 'text-purple-600';
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Load initial data
  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Cloud className="w-8 h-8 text-white mr-3" />
            <h1 className="text-3xl font-bold text-white">Weather App</h1>
          </div>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Get real-time weather information with location detection and 7-day forecasts
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for a city..."
                  value={state.searchLocation}
                  onChange={(e) => setState(prev => ({ ...prev, searchLocation: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
                  className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-lg text-white placeholder-white/70 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={searchLocation}
                disabled={state.loading || !state.searchLocation.trim()}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Search
              </button>

              <button
                onClick={getUserLocation}
                disabled={state.loading}
                className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors disabled:opacity-50"
                title="Use current location"
              >
                <MapPin className="w-5 h-5" />
              </button>

              <button
                onClick={() => state.current && getWeatherData(state.current.location)}
                disabled={state.loading}
                className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${state.loading ? 'animate-spin' : ''}`} />
              </button>

              {/* Unit Toggle */}
              <div className="flex bg-white/20 rounded-lg p-1">
                <button
                  onClick={() => setState(prev => ({ ...prev, unit: 'metric' }))}
                  className={`px-3 py-1 rounded ${state.unit === 'metric' ? 'bg-white text-blue-600' : 'text-white'} transition-colors`}
                >
                  °C
                </button>
                <button
                  onClick={() => setState(prev => ({ ...prev, unit: 'imperial' }))}
                  className={`px-3 py-1 rounded ${state.unit === 'imperial' ? 'bg-white text-blue-600' : 'text-white'} transition-colors`}
                >
                  °F
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {state.error && (
          <div className="bg-red-500/20 backdrop-blur-lg border border-red-400/30 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-300 mr-3" />
              <p className="text-red-100">{state.error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {state.loading && !state.current && (
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-12 text-center mb-8">
            <Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-4" />
            <p className="text-white">Loading weather data...</p>
          </div>
        )}

        {/* Current Weather */}
        {state.current && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Main Weather Card */}
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {state.current.location}, {state.current.country}
                  </h2>
                  {state.lastUpdated && (
                    <p className="text-blue-100 text-sm">
                      Last updated: {state.lastUpdated.toLocaleTimeString()}
                    </p>
                  )}
                </div>
                <div className="text-white/70">
                  {getWeatherIcon(state.current.icon, 48)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-6xl font-bold text-white mb-2">
                    {convertTemp(state.current.temperature, state.unit)}°
                  </div>
                  <div className="text-xl text-blue-100 mb-1">{state.current.condition}</div>
                  <div className="text-blue-200 mb-4">{state.current.description}</div>
                  <div className="text-blue-100">
                    Feels like {convertTemp(state.current.feelsLike, state.unit)}°
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Wind className="w-5 h-5 text-blue-200" />
                      <span className="text-blue-100">Wind</span>
                    </div>
                    <span className="text-white">
                      {convertWindSpeed(state.current.windSpeed, state.unit)} {state.unit === 'metric' ? 'km/h' : 'mph'} {getWindDirection(state.current.windDirection)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Droplets className="w-5 h-5 text-blue-200" />
                      <span className="text-blue-100">Humidity</span>
                    </div>
                    <span className="text-white">{state.current.humidity}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-5 h-5 text-blue-200" />
                      <span className="text-blue-100">Visibility</span>
                    </div>
                    <span className="text-white">{state.current.visibility} km</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Gauge className="w-5 h-5 text-blue-200" />
                      <span className="text-blue-100">Pressure</span>
                    </div>
                    <span className="text-white">{state.current.pressure} hPa</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-6">
              {/* Sun Info */}
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Sun</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sunrise className="w-5 h-5 text-yellow-300" />
                      <span className="text-blue-100">Sunrise</span>
                    </div>
                    <span className="text-white">{state.current.sunrise}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sunset className="w-5 h-5 text-orange-300" />
                      <span className="text-blue-100">Sunset</span>
                    </div>
                    <span className="text-white">{state.current.sunset}</span>
                  </div>
                </div>
              </div>

              {/* UV Index */}
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">UV Index</h3>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getUVIndexColor(state.current.uvIndex).replace('text-', 'text-white')}`}>
                    {state.current.uvIndex}
                  </div>
                  <div className="text-blue-100 text-sm mt-1">
                    {state.current.uvIndex <= 2 ? 'Low' :
                     state.current.uvIndex <= 5 ? 'Moderate' :
                     state.current.uvIndex <= 7 ? 'High' :
                     state.current.uvIndex <= 10 ? 'Very High' : 'Extreme'}
                  </div>
                </div>
              </div>

              {/* Cloud Cover */}
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Cloud Cover</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {state.current.cloudCover}%
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 mt-3">
                    <div
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${state.current.cloudCover}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7-Day Forecast */}
        {state.forecast.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-6">7-Day Forecast</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
              {state.forecast.map((day, index) => (
                <div key={day.date} className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-blue-100 text-sm mb-2">
                    {index === 0 ? 'Tomorrow' : formatDate(day.date)}
                  </div>
                  
                  <div className="text-white/70 mb-3 flex justify-center">
                    {getWeatherIcon(day.icon, 32)}
                  </div>
                  
                  <div className="text-white font-semibold mb-1">
                    {convertTemp(day.maxTemp, state.unit)}°
                  </div>
                  <div className="text-blue-200 text-sm mb-3">
                    {convertTemp(day.minTemp, state.unit)}°
                  </div>
                  
                  <div className="text-xs text-blue-100 space-y-1">
                    <div className="flex items-center justify-center space-x-1">
                      <Droplets className="w-3 h-3" />
                      <span>{day.precipitation}%</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <Wind className="w-3 h-3" />
                      <span>{convertWindSpeed(day.windSpeed, state.unit)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Data State */}
        {!state.current && !state.loading && !state.error && (
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-12 text-center">
            <Cloud className="w-16 h-16 mx-auto mb-4 text-white/50" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Weather App
            </h3>
            <p className="text-blue-100 mb-4">
              Search for a city or allow location access to get started
            </p>
            <div className="text-sm text-blue-200">
              <p>Features:</p>
              <ul className="mt-2 space-y-1">
                <li>• Real-time weather data</li>
                <li>• 7-day detailed forecast</li>
                <li>• Location-based weather</li>
                <li>• Multiple unit systems</li>
                <li>• Comprehensive weather metrics</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp; 