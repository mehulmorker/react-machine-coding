import React, { useState, useEffect } from 'react';
import { Map, MapPin, Navigation, Zap } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'restaurant' | 'hotel' | 'attraction' | 'store';
  rating: number;
}

const LazyMap: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // NYC

  // Simulate loading map data
  useEffect(() => {
    const timer = setTimeout(() => {
      const mockLocations: Location[] = [
        { id: '1', name: 'Central Park', lat: 40.7851, lng: -73.9683, type: 'attraction', rating: 4.8 },
        { id: '2', name: 'Times Square', lat: 40.7589, lng: -73.9851, type: 'attraction', rating: 4.3 },
        { id: '3', name: 'Empire State Building', lat: 40.7484, lng: -73.9857, type: 'attraction', rating: 4.6 },
        { id: '4', name: 'Brooklyn Bridge', lat: 40.7061, lng: -73.9969, type: 'attraction', rating: 4.7 },
        { id: '5', name: 'Statue of Liberty', lat: 40.6892, lng: -74.0445, type: 'attraction', rating: 4.5 },
        { id: '6', name: 'The Plaza Hotel', lat: 40.7648, lng: -73.9754, type: 'hotel', rating: 4.4 },
        { id: '7', name: 'Le Bernardin', lat: 40.7614, lng: -73.9776, type: 'restaurant', rating: 4.9 },
        { id: '8', name: 'Apple Store 5th Ave', lat: 40.7636, lng: -73.9731, type: 'store', rating: 4.2 }
      ];
      setLocations(mockLocations);
      setIsLoading(false);
    }, 1200); // Simulate loading time

    return () => clearTimeout(timer);
  }, []);

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'restaurant': return '🍽️';
      case 'hotel': return '🏨';
      case 'attraction': return '🎭';
      case 'store': return '🏪';
      default: return '📍';
    }
  };

  const getLocationColor = (type: string) => {
    switch (type) {
      case 'restaurant': return 'bg-orange-500';
      case 'hotel': return 'bg-blue-500';
      case 'attraction': return 'bg-purple-500';
      case 'store': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Map className="w-8 h-8 animate-pulse text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Map className="w-6 h-6 text-green-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Interactive Map</h3>
            <p className="text-sm text-gray-600">New York City attractions and amenities</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Navigation className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">NYC</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <div className="relative bg-gray-100 rounded-lg h-64 overflow-hidden">
            {/* Simulated map background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
              {/* Grid pattern to simulate map */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className={`absolute border-gray-300 ${
                    i % 2 === 0 ? 'border-t w-full' : 'border-l h-full'
                  }`} style={{
                    [i % 2 === 0 ? 'top' : 'left']: `${(i / 20) * 100}%`
                  }} />
                ))}
              </div>
            </div>

            {/* Location markers */}
            {locations.map((location, index) => (
              <div
                key={location.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110 ${
                  selectedLocation?.id === location.id ? 'scale-125 z-10' : ''
                }`}
                style={{
                  left: `${20 + (index % 4) * 20}%`,
                  top: `${20 + Math.floor(index / 4) * 20}%`
                }}
                onClick={() => setSelectedLocation(location)}
              >
                <div className={`w-8 h-8 rounded-full ${getLocationColor(location.type)} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                  {getLocationIcon(location.type)}
                </div>
                {selectedLocation?.id === location.id && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white rounded-lg shadow-lg p-2 min-w-32 border">
                    <div className="text-xs font-semibold text-gray-900">{location.name}</div>
                    <div className="text-xs text-gray-600 flex items-center mt-1">
                      <span className="text-yellow-400 mr-1">★</span>
                      {location.rating}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Center marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Map controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                <Zap className="w-4 h-4 mr-1" />
                Find Route
              </button>
              <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                <Navigation className="w-4 h-4 mr-1" />
                My Location
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Zoom: 12x | {locations.length} locations
            </div>
          </div>
        </div>

        {/* Location List */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 mb-3">Nearby Locations</h4>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {locations.map((location) => (
              <div
                key={location.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedLocation?.id === location.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedLocation(location)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{getLocationIcon(location.type)}</span>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{location.name}</div>
                      <div className="text-xs text-gray-600 capitalize">{location.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="text-sm text-gray-600">{location.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Location stats */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        {['restaurant', 'hotel', 'attraction', 'store'].map((type) => {
          const count = locations.filter(loc => loc.type === type).length;
          const avgRating = locations
            .filter(loc => loc.type === type)
            .reduce((sum, loc) => sum + loc.rating, 0) / count || 0;
          
          return (
            <div key={type} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">{getLocationIcon(type)}</div>
              <div className="text-lg font-bold text-gray-900">{count}</div>
              <div className="text-xs text-gray-600 capitalize">{type}s</div>
              <div className="text-xs text-gray-500">★ {avgRating.toFixed(1)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LazyMap; 