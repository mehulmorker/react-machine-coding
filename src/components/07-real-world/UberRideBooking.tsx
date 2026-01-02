import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Star, User, CreditCard, Gift, Settings, Menu, Search, Plus, Minus, Phone, MessageCircle, Share2 } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
}

interface Driver {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  totalRides: number;
  carModel: string;
  carColor: string;
  licensePlate: string;
  estimatedArrival: string;
  phone: string;
}

interface RideOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  estimatedTime: string;
  capacity: number;
  features: string[];
}

interface Ride {
  id: string;
  status: 'searching' | 'confirmed' | 'arriving' | 'in-progress' | 'completed';
  driver?: Driver;
  pickup: Location;
  destination: Location;
  rideOption: RideOption;
  estimatedFare: number;
  actualFare?: number;
  startTime?: string;
  endTime?: string;
  distance: string;
  duration: string;
}

const UberRideBooking: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'booking' | 'searching' | 'confirmed' | 'in-ride' | 'completed'>('booking');
  const [pickup, setPickup] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [selectedRideOption, setSelectedRideOption] = useState<RideOption | null>(null);
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  const [showRideOptions, setShowRideOptions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [searchType, setSearchType] = useState<'pickup' | 'destination'>('pickup');
  const [showSearch, setShowSearch] = useState(false);

  const rideOptions: RideOption[] = [
    {
      id: 'uberx',
      name: 'UberX',
      description: 'Affordable, everyday rides',
      icon: '🚗',
      price: 12.50,
      estimatedTime: '3 min',
      capacity: 4,
      features: ['Affordable', 'Reliable']
    },
    {
      id: 'comfort',
      name: 'Comfort',
      description: 'Newer cars with extra legroom',
      icon: '🚙',
      price: 16.75,
      estimatedTime: '5 min',
      capacity: 4,
      features: ['Extra legroom', 'Newer cars', 'Top-rated drivers']
    },
    {
      id: 'xl',
      name: 'UberXL',
      description: 'Affordable rides for groups up to 6',
      icon: '🚐',
      price: 19.25,
      estimatedTime: '4 min',
      capacity: 6,
      features: ['Seats 6', 'Extra space']
    },
    {
      id: 'black',
      name: 'Uber Black',
      description: 'Premium rides in luxury cars',
      icon: '🖤',
      price: 28.90,
      estimatedTime: '8 min',
      capacity: 4,
      features: ['Luxury vehicles', 'Professional drivers', 'Premium experience']
    }
  ];

  const sampleLocations: Location[] = [
    {
      id: '1',
      name: 'Times Square',
      address: '1560 Broadway, New York, NY 10036',
      coordinates: { lat: 40.7580, lng: -73.9855 }
    },
    {
      id: '2',
      name: 'Central Park',
      address: 'Central Park, New York, NY',
      coordinates: { lat: 40.7829, lng: -73.9654 }
    },
    {
      id: '3',
      name: 'Brooklyn Bridge',
      address: 'Brooklyn Bridge, New York, NY 10038',
      coordinates: { lat: 40.7061, lng: -73.9969 }
    },
    {
      id: '4',
      name: 'Empire State Building',
      address: '350 5th Ave, New York, NY 10118',
      coordinates: { lat: 40.7484, lng: -73.9857 }
    },
    {
      id: '5',
      name: 'JFK Airport',
      address: 'Queens, NY 11430',
      coordinates: { lat: 40.6413, lng: -73.7781 }
    }
  ];

  const sampleDriver: Driver = {
    id: '1',
    name: 'Michael Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 4.9,
    totalRides: 2847,
    carModel: 'Toyota Camry',
    carColor: 'Silver',
    licensePlate: 'ABC-1234',
    estimatedArrival: '3 min',
    phone: '+1 (555) 123-4567'
  };

  useEffect(() => {
    // Set default pickup location
    setPickup(sampleLocations[0]);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = sampleLocations.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleLocationSelect = (location: Location) => {
    if (searchType === 'pickup') {
      setPickup(location);
    } else {
      setDestination(location);
    }
    setShowSearch(false);
    setSearchQuery('');
    
    if (pickup && destination && searchType === 'destination') {
      setShowRideOptions(true);
    }
  };

  const handleBookRide = () => {
    if (pickup && destination && selectedRideOption) {
      const ride: Ride = {
        id: Date.now().toString(),
        status: 'searching',
        pickup,
        destination,
        rideOption: selectedRideOption,
        estimatedFare: selectedRideOption.price,
        distance: '2.5 miles',
        duration: '12 min'
      };
      setCurrentRide(ride);
      setCurrentStep('searching');
      
      // Simulate finding a driver
      setTimeout(() => {
        setCurrentRide(prev => prev ? { ...prev, status: 'confirmed', driver: sampleDriver } : null);
        setCurrentStep('confirmed');
      }, 3000);
    }
  };

  const handleCancelRide = () => {
    setCurrentRide(null);
    setCurrentStep('booking');
    setShowRideOptions(false);
  };

  const simulateRideProgress = () => {
    setCurrentStep('in-ride');
    setCurrentRide(prev => prev ? { ...prev, status: 'in-progress', startTime: new Date().toLocaleTimeString() } : null);
    
    // Simulate ride completion
    setTimeout(() => {
      setCurrentStep('completed');
      setCurrentRide(prev => prev ? { 
        ...prev, 
        status: 'completed', 
        endTime: new Date().toLocaleTimeString(),
        actualFare: selectedRideOption?.price || 0
      } : null);
    }, 8000);
  };

  const resetBooking = () => {
    setCurrentStep('booking');
    setCurrentRide(null);
    setDestination(null);
    setSelectedRideOption(null);
    setShowRideOptions(false);
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const BookingInterface = () => (
    <div className="space-y-4">
      {/* Location Inputs */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <button
            onClick={() => {
              setSearchType('pickup');
              setShowSearch(true);
            }}
            className="flex-1 p-4 bg-gray-100 rounded-lg text-left"
          >
            <p className="text-sm text-gray-500">Pickup location</p>
            <p className="font-medium">{pickup?.name || 'Choose pickup location'}</p>
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <button
            onClick={() => {
              setSearchType('destination');
              setShowSearch(true);
            }}
            className="flex-1 p-4 bg-gray-100 rounded-lg text-left"
          >
            <p className="text-sm text-gray-500">Where to?</p>
            <p className="font-medium">{destination?.name || 'Choose destination'}</p>
          </button>
        </div>
      </div>

      {/* Ride Options */}
      {showRideOptions && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Choose a ride</h3>
          {rideOptions.map(option => (
            <button
              key={option.id}
              onClick={() => setSelectedRideOption(option)}
              className={`w-full p-4 border rounded-lg text-left transition-colors ${
                selectedRideOption?.id === option.id
                  ? 'border-black bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{option.icon}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{option.name}</h4>
                      <span className="text-sm text-gray-500">{option.estimatedTime}</span>
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {option.features.map((feature, index) => (
                        <span key={index} className="text-xs bg-gray-200 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(option.price)}</p>
                  <p className="text-sm text-gray-500">{option.capacity} seats</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Payment & Promo */}
      {selectedRideOption && (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5" />
              <span>Payment method</span>
            </div>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="bg-transparent border-none outline-none"
            >
              <option value="card">•••• 1234</option>
              <option value="paypal">PayPal</option>
              <option value="cash">Cash</option>
            </select>
          </div>

          <button
            onClick={() => setShowPromoInput(!showPromoInput)}
            className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg w-full text-left"
          >
            <Gift className="w-5 h-5" />
            <span>Add promo code</span>
          </button>

          {showPromoInput && (
            <div className="flex space-x-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code"
                className="flex-1 p-3 border border-gray-300 rounded-lg"
              />
              <button className="px-4 py-3 bg-black text-white rounded-lg">Apply</button>
            </div>
          )}

          <button
            onClick={handleBookRide}
            className="w-full py-4 bg-black text-white rounded-lg font-semibold"
          >
            Request {selectedRideOption.name} • {formatPrice(selectedRideOption.price)}
          </button>
        </div>
      )}
    </div>
  );

  const SearchInterface = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setShowSearch(false)}
          className="text-gray-600"
        >
          ←
        </button>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search for ${searchType} location`}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
            autoFocus
          />
        </div>
      </div>

      <div className="space-y-2">
        {searchResults.map(location => (
          <button
            key={location.id}
            onClick={() => handleLocationSelect(location)}
            className="w-full p-4 text-left hover:bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium">{location.name}</p>
                <p className="text-sm text-gray-600">{location.address}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const SearchingInterface = () => (
    <div className="text-center space-y-6">
      <div className="animate-spin w-16 h-16 border-4 border-gray-200 border-t-black rounded-full mx-auto"></div>
      <div>
        <h3 className="text-xl font-semibold">Finding your ride...</h3>
        <p className="text-gray-600">This usually takes 1-3 minutes</p>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span>From: {pickup?.name}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span>To: {destination?.name}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span>Ride: {selectedRideOption?.name}</span>
          <span>{formatPrice(selectedRideOption?.price || 0)}</span>
        </div>
      </div>
      <button
        onClick={handleCancelRide}
        className="w-full py-3 border border-gray-300 rounded-lg"
      >
        Cancel
      </button>
    </div>
  );

  const ConfirmedInterface = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold">Driver found!</h3>
        <p className="text-gray-600">Your driver is on the way</p>
      </div>

      {currentRide?.driver && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <img
              src={currentRide.driver.avatar}
              alt={currentRide.driver.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h4 className="font-semibold">{currentRide.driver.name}</h4>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm">{currentRide.driver.rating}</span>
                <span className="text-sm text-gray-500">({currentRide.driver.totalRides} rides)</span>
              </div>
              <p className="text-sm text-gray-600">
                {currentRide.driver.carColor} {currentRide.driver.carModel} • {currentRide.driver.licensePlate}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{currentRide.driver.estimatedArrival}</p>
              <p className="text-sm text-gray-500">away</p>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-4">
            <button className="flex-1 flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-lg">
              <Phone className="w-5 h-5" />
              <span>Call</span>
            </button>
            <button className="flex-1 flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-lg">
              <MessageCircle className="w-5 h-5" />
              <span>Message</span>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span>From: {pickup?.name}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span>To: {destination?.name}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span>Estimated fare</span>
          <span>{formatPrice(currentRide?.estimatedFare || 0)}</span>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={simulateRideProgress}
          className="flex-1 py-3 bg-black text-white rounded-lg"
        >
          Start Ride
        </button>
        <button
          onClick={handleCancelRide}
          className="px-6 py-3 border border-gray-300 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const InRideInterface = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold">On your way</h3>
        <p className="text-gray-600">Enjoy your ride!</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="font-medium">Trip Progress</span>
          <span className="text-sm text-gray-500">{currentRide?.duration} remaining</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-black h-2 rounded-full w-1/3"></div>
        </div>
      </div>

      {currentRide?.driver && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <img
              src={currentRide.driver.avatar}
              alt={currentRide.driver.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <h4 className="font-semibold">{currentRide.driver.name}</h4>
              <p className="text-sm text-gray-600">
                {currentRide.driver.carColor} {currentRide.driver.carModel}
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 border border-gray-300 rounded-full">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 border border-gray-300 rounded-full">
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span>Distance</span>
          <span>{currentRide?.distance}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span>Estimated fare</span>
          <span>{formatPrice(currentRide?.estimatedFare || 0)}</span>
        </div>
      </div>

      <button className="w-full py-3 border border-gray-300 rounded-lg">
        Share Trip Status
      </button>
    </div>
  );

  const CompletedInterface = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✓</span>
        </div>
        <h3 className="text-xl font-semibold">Trip completed!</h3>
        <p className="text-gray-600">Hope you enjoyed your ride</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span>Trip fare</span>
          <span className="font-semibold">{formatPrice(currentRide?.actualFare || 0)}</span>
        </div>
        <div className="flex justify-between">
          <span>Distance</span>
          <span>{currentRide?.distance}</span>
        </div>
        <div className="flex justify-between">
          <span>Duration</span>
          <span>{currentRide?.duration}</span>
        </div>
        <div className="flex justify-between">
          <span>Payment method</span>
          <span>•••• 1234</span>
        </div>
      </div>

      {currentRide?.driver && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold mb-3">Rate your driver</h4>
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={currentRide.driver.avatar}
              alt={currentRide.driver.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{currentRide.driver.name}</p>
              <p className="text-sm text-gray-600">
                {currentRide.driver.carColor} {currentRide.driver.carModel}
              </p>
            </div>
          </div>
          <div className="flex space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map(star => (
              <button key={star} className="text-2xl text-yellow-500">
                ★
              </button>
            ))}
          </div>
          <textarea
            placeholder="Leave a comment (optional)"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none"
            rows={3}
          />
        </div>
      )}

      <div className="flex space-x-3">
        <button
          onClick={resetBooking}
          className="flex-1 py-3 bg-black text-white rounded-lg"
        >
          Book Another Ride
        </button>
        <button className="px-6 py-3 border border-gray-300 rounded-lg">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button className="p-2">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Uber</h1>
        <button className="p-2">
          <User className="w-6 h-6" />
        </button>
      </div>

      {/* Map Placeholder */}
      <div className="h-64 bg-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Interactive Map</p>
            <p className="text-sm text-gray-400">
              {pickup && destination ? `${pickup.name} → ${destination.name}` : 'Select locations to see route'}
            </p>
          </div>
        </div>
        
        {/* Current location indicator */}
        <div className="absolute top-4 right-4">
          <button className="p-2 bg-white rounded-full shadow-lg">
            <Navigation className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {showSearch && <SearchInterface />}
        {!showSearch && currentStep === 'booking' && <BookingInterface />}
        {currentStep === 'searching' && <SearchingInterface />}
        {currentStep === 'confirmed' && <ConfirmedInterface />}
        {currentStep === 'in-ride' && <InRideInterface />}
        {currentStep === 'completed' && <CompletedInterface />}
      </div>
    </div>
  );
};

export default UberRideBooking; 