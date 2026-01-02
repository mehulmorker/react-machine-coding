import React, { useState, useEffect } from 'react';
import {
  Star,
  Heart,
  Share,
  MapPin,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  Tv,
  Coffee,
  Snowflake,
  Utensils,
  Waves,
  Dumbbell,
  Flame,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Search,
  Filter,
  Award,
  Shield,
  Clock
} from 'lucide-react';

interface PropertyImage {
  id: string;
  url: string;
  alt: string;
}

interface Host {
  id: string;
  name: string;
  avatar: string;
  joinedDate: string;
  responseRate: number;
  responseTime: string;
  isSuperhost: boolean;
  verified: boolean;
  languages: string[];
  about: string;
}

interface Review {
  id: string;
  user: {
    name: string;
    avatar: string;
    location: string;
  };
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

interface Amenity {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'popular' | 'safety' | 'internet' | 'kitchen' | 'bathroom' | 'entertainment';
}

interface Property {
  id: string;
  title: string;
  location: string;
  coordinates: { lat: number; lng: number };
  images: PropertyImage[];
  hostId: string;
  rating: number;
  reviewCount: number;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  pricePerNight: number;
  cleaningFee: number;
  serviceFee: number;
  description: string;
  amenities: string[];
  houseRules: string[];
  cancellationPolicy: string;
  instantBook: boolean;
  minimumStay: number;
  maximumStay: number;
  availableDates: string[];
}

const AirbnbListing: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [nights, setNights] = useState(0);
  const [showBookingBreakdown, setShowBookingBreakdown] = useState(false);

  // Sample data
  const property: Property = {
    id: '1',
    title: 'Stunning Oceanview Villa with Private Pool',
    location: 'Malibu, California, United States',
    coordinates: { lat: 34.0259, lng: -118.7798 },
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
        alt: 'Oceanview villa exterior'
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        alt: 'Living room with ocean view'
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&h=600&fit=crop',
        alt: 'Modern kitchen'
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop',
        alt: 'Master bedroom'
      },
      {
        id: '5',
        url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
        alt: 'Private pool area'
      }
    ],
    hostId: 'host1',
    rating: 4.87,
    reviewCount: 243,
    guests: 8,
    bedrooms: 4,
    beds: 6,
    bathrooms: 3,
    pricePerNight: 450,
    cleaningFee: 85,
    serviceFee: 67,
    description: `Escape to this breathtaking oceanview villa perched on the cliffs of Malibu. This stunning property offers unparalleled views of the Pacific Ocean, complete with a private infinity pool, spacious outdoor terraces, and luxurious amenities throughout.

The villa features an open-concept design that seamlessly blends indoor and outdoor living. Floor-to-ceiling windows frame the spectacular ocean views, while the gourmet kitchen and elegant living spaces provide the perfect setting for both relaxation and entertainment.

Each of the four bedrooms is thoughtfully designed with comfort in mind, and the master suite boasts a private balcony overlooking the ocean. The property also includes a dedicated office space, perfect for remote work with a view.

Located in one of Malibu's most exclusive neighborhoods, you'll be just minutes from pristine beaches, world-class dining, and the best that Southern California has to offer.`,
    amenities: [
      'wifi', 'pool', 'parking', 'kitchen', 'tv', 'ac', 'heating', 'washer', 'dryer',
      'hot_tub', 'gym', 'beach_access', 'ocean_view', 'balcony', 'patio', 'bbq'
    ],
    houseRules: [
      'Check-in: 4:00 PM - 10:00 PM',
      'Checkout: 11:00 AM',
      'No smoking',
      'No pets',
      'No parties or events',
      'Quiet hours: 10:00 PM - 8:00 AM'
    ],
    cancellationPolicy: 'Strict',
    instantBook: true,
    minimumStay: 3,
    maximumStay: 30,
    availableDates: [
      '2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19',
      '2024-01-22', '2024-01-23', '2024-01-24', '2024-01-25', '2024-01-26'
    ]
  };

  const host: Host = {
    id: 'host1',
    name: 'Sarah',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    joinedDate: 'March 2018',
    responseRate: 98,
    responseTime: 'within an hour',
    isSuperhost: true,
    verified: true,
    languages: ['English', 'Spanish', 'French'],
    about: `I'm a Malibu native who loves sharing the beauty of our coastal paradise with guests from around the world. As a professional interior designer, I've carefully curated every detail of this property to ensure your stay is both comfortable and memorable.

When I'm not hosting, you can find me surfing at nearby beaches, exploring local farmers markets, or enjoying sunset yoga on the cliffs. I'm always happy to share recommendations for the best local spots!`
  };

  const reviews: Review[] = [
    {
      id: '1',
      user: {
        name: 'Michael',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        location: 'New York, NY'
      },
      rating: 5,
      comment: 'This place exceeded all expectations! The ocean views are absolutely breathtaking, and the infinity pool feels like you\'re swimming into the horizon. Sarah was an incredible host - responsive, thoughtful, and provided excellent local recommendations. The villa is even more stunning in person than in the photos.',
      date: 'December 2023',
      helpful: 12
    },
    {
      id: '2',
      user: {
        name: 'Emma',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        location: 'London, UK'
      },
      rating: 5,
      comment: 'Perfect for our family vacation! The kids loved the pool and we adults couldn\'t get enough of the sunset views. The kitchen is incredibly well-equipped and the outdoor dining area was perfect for our family meals. Would definitely book again!',
      date: 'November 2023',
      helpful: 8
    },
    {
      id: '3',
      user: {
        name: 'David',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        location: 'San Francisco, CA'
      },
      rating: 4,
      comment: 'Beautiful property with amazing views. The location is perfect for exploring Malibu. Only minor issue was that the hot tub wasn\'t working during our stay, but Sarah was quick to address it and offered a partial refund. Overall a fantastic experience.',
      date: 'October 2023',
      helpful: 5
    }
  ];

  const amenities: Amenity[] = [
    { id: 'wifi', name: 'Wi-Fi', icon: <Wifi className="w-6 h-6" />, category: 'internet' },
    { id: 'pool', name: 'Private pool', icon: <Waves className="w-6 h-6" />, category: 'popular' },
    { id: 'parking', name: 'Free parking', icon: <Car className="w-6 h-6" />, category: 'popular' },
    { id: 'kitchen', name: 'Full kitchen', icon: <Utensils className="w-6 h-6" />, category: 'kitchen' },
    { id: 'tv', name: '65" 4K TV', icon: <Tv className="w-6 h-6" />, category: 'entertainment' },
    { id: 'ac', name: 'Air conditioning', icon: <Snowflake className="w-6 h-6" />, category: 'popular' },
    { id: 'heating', name: 'Central heating', icon: <Flame className="w-6 h-6" />, category: 'popular' },
    { id: 'hot_tub', name: 'Hot tub', icon: <Waves className="w-6 h-6" />, category: 'popular' },
    { id: 'gym', name: 'Home gym', icon: <Dumbbell className="w-6 h-6" />, category: 'entertainment' },
    { id: 'ocean_view', name: 'Ocean view', icon: <Star className="w-6 h-6" />, category: 'popular' }
  ];

  // Calculate nights and total cost
  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays);
    }
  }, [checkIn, checkOut]);

  const totalNightsCost = nights * property.pricePerNight;
  const totalCost = totalNightsCost + property.cleaningFee + property.serviceFee;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-current text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-4 h-4 fill-current text-yellow-400" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">{property.title}</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-red-500' : 'text-gray-600'}`} />
                <span className="text-gray-700">Save</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                <Share className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">Share</span>
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-current text-yellow-400" />
              <span className="font-medium">{property.rating}</span>
            </div>
            <span className="text-gray-600">·</span>
            <button className="text-gray-900 font-medium underline">{property.reviewCount} reviews</button>
            <span className="text-gray-600">·</span>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="text-gray-900 font-medium">{property.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-96 rounded-xl overflow-hidden">
          {/* Main Image */}
          <div className="col-span-2 row-span-2 relative group cursor-pointer">
            <img
              src={property.images[0].url}
              alt={property.images[0].alt}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Secondary Images */}
          {property.images.slice(1, 5).map((image, index) => (
            <div key={image.id} className="relative group cursor-pointer">
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
              {index === 3 && property.images.length > 5 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-semibold">+{property.images.length - 5} photos</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column - Property Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Property Overview */}
          <div className="border-b border-gray-200 pb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Entire villa hosted by {host.name}
                </h2>
                <div className="flex items-center space-x-4 text-gray-600">
                  <span>{property.guests} guests</span>
                  <span>·</span>
                  <span>{property.bedrooms} bedrooms</span>
                  <span>·</span>
                  <span>{property.beds} beds</span>
                  <span>·</span>
                  <span>{property.bathrooms} bathrooms</span>
                </div>
              </div>
              <img
                src={host.avatar}
                alt={host.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>

            {/* Property Highlights */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-gray-700 mt-1" />
                <div>
                  <div className="font-medium text-gray-900">Self check-in</div>
                  <div className="text-gray-600 text-sm">Check yourself in with the keypad</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Star className="w-6 h-6 text-gray-700 mt-1" />
                <div>
                  <div className="font-medium text-gray-900">{host.name} is a Superhost</div>
                  <div className="text-gray-600 text-sm">Superhosts are experienced, highly rated hosts</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-6 h-6 text-gray-700 mt-1" />
                <div>
                  <div className="font-medium text-gray-900">Great location</div>
                  <div className="text-gray-600 text-sm">95% of recent guests gave the location a 5-star rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-b border-gray-200 pb-8">
            <div className="space-y-4">
              {property.description.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="border-b border-gray-200 pb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">What this place offers</h3>
            <div className="grid grid-cols-2 gap-4">
              {(showAllAmenities ? amenities : amenities.slice(0, 10)).map((amenity) => (
                <div key={amenity.id} className="flex items-center space-x-3">
                  {amenity.icon}
                  <span className="text-gray-700">{amenity.name}</span>
                </div>
              ))}
            </div>
            {amenities.length > 10 && (
              <button
                onClick={() => setShowAllAmenities(!showAllAmenities)}
                className="mt-6 px-6 py-3 border border-gray-900 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition-colors"
              >
                {showAllAmenities ? 'Show less' : `Show all ${amenities.length} amenities`}
              </button>
            )}
          </div>

          {/* Calendar */}
          <div className="border-b border-gray-200 pb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {nights} nights in {property.location.split(',')[0]}
            </h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-center text-gray-500 py-8">
                📅 Interactive calendar would be displayed here
                <div className="mt-4 text-sm">
                  Minimum stay: {property.minimumStay} nights
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="border-b border-gray-200 pb-8">
            <div className="flex items-center space-x-2 mb-6">
              <Star className="w-6 h-6 fill-current text-yellow-400" />
              <span className="text-xl font-semibold">{property.rating} · {property.reviewCount} reviews</span>
            </div>

            {/* Review Breakdown */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              {['Cleanliness', 'Accuracy', 'Check-in', 'Communication', 'Location', 'Value'].map((category, index) => {
                const rating = 4.8 + (Math.random() * 0.4); // Generate random ratings between 4.8-5.2
                return (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-gray-700">{category}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-gray-900 h-1 rounded-full"
                          style={{ width: `${(rating / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{rating.toFixed(1)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {(showAllReviews ? reviews : reviews.slice(0, 6)).map((review) => (
                <div key={review.id} className="flex space-x-4">
                  <img
                    src={review.user.avatar}
                    alt={review.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">{review.user.name}</span>
                      <span className="text-gray-500">·</span>
                      <span className="text-gray-500 text-sm">{review.date}</span>
                    </div>
                    <div className="flex items-center space-x-1 mb-2">
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-2">{review.comment}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{review.user.location}</span>
                      <span>·</span>
                      <button className="hover:text-gray-700">
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {reviews.length > 6 && (
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="mt-6 px-6 py-3 border border-gray-900 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition-colors"
              >
                {showAllReviews ? 'Show less' : `Show all ${reviews.length} reviews`}
              </button>
            )}
          </div>

          {/* Host Information */}
          <div className="border-b border-gray-200 pb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Meet your host</h3>
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-start space-x-6">
                <div className="text-center">
                  <img
                    src={host.avatar}
                    alt={host.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                  />
                  <h4 className="text-xl font-semibold text-gray-900 mb-1">{host.name}</h4>
                  {host.isSuperhost && (
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">Superhost</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-xl font-semibold text-gray-900">{reviews.length}</div>
                      <div className="text-sm text-gray-600">Reviews</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold text-gray-900">{property.rating}</div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold text-gray-900">6</div>
                      <div className="text-sm text-gray-600">Years hosting</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Response rate:</span>
                      <span className="font-medium">{host.responseRate}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Response time:</span>
                      <span className="font-medium">{host.responseTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Languages:</span>
                      <span className="font-medium">{host.languages.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-gray-700 leading-relaxed">{host.about}</p>
              </div>

              <button className="mt-6 px-6 py-3 border border-gray-900 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition-colors">
                Contact host
              </button>
            </div>
          </div>

          {/* House Rules */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Things to know</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">House rules</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  {property.houseRules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Safety & property</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>Pool/hot tub without a gate or lock</li>
                  <li>Security camera/recording device</li>
                  <li>Carbon monoxide alarm</li>
                  <li>Smoke alarm</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Cancellation policy</h4>
                <div className="space-y-2 text-gray-700 text-sm">
                  <p className="font-medium">{property.cancellationPolicy} cancellation</p>
                  <p>Cancel before check-in for a partial refund</p>
                  <button className="text-gray-900 underline">Show more</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="border border-gray-300 rounded-xl p-6 shadow-lg">
              <div className="flex items-baseline space-x-2 mb-6">
                <span className="text-2xl font-semibold text-gray-900">{formatPrice(property.pricePerNight)}</span>
                <span className="text-gray-600">night</span>
              </div>

              {/* Date Selection */}
              <div className="border border-gray-300 rounded-lg mb-4">
                <div className="grid grid-cols-2">
                  <div className="p-3 border-r border-gray-300">
                    <label className="block text-xs font-medium text-gray-700 mb-1">CHECK-IN</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full text-sm border-none focus:outline-none"
                    />
                  </div>
                  <div className="p-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">CHECKOUT</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full text-sm border-none focus:outline-none"
                    />
                  </div>
                </div>
                <div className="p-3 border-t border-gray-300">
                  <label className="block text-xs font-medium text-gray-700 mb-1">GUESTS</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full text-sm border-none focus:outline-none"
                  >
                    {Array.from({ length: property.guests }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reserve Button */}
              <button
                disabled={!checkIn || !checkOut}
                className="w-full bg-pink-500 text-white py-4 rounded-lg font-medium text-lg hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors mb-4"
              >
                {property.instantBook ? 'Reserve' : 'Request to book'}
              </button>

              <div className="text-center text-sm text-gray-600 mb-6">
                You won't be charged yet
              </div>

              {/* Cost Breakdown */}
              {nights > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700 underline">
                      {formatPrice(property.pricePerNight)} x {nights} nights
                    </span>
                    <span className="text-gray-900">{formatPrice(totalNightsCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 underline">Cleaning fee</span>
                    <span className="text-gray-900">{formatPrice(property.cleaningFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 underline">Airbnb service fee</span>
                    <span className="text-gray-900">{formatPrice(property.serviceFee)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">{formatPrice(totalCost)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Report Listing */}
            <button className="w-full mt-6 text-center text-gray-600 underline text-sm hover:text-gray-800">
              Report this listing
            </button>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="border-t border-gray-200 pt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Where you'll be</h3>
          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg font-medium">{property.location}</p>
              <p className="text-sm">Interactive map would be displayed here</p>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-gray-700 leading-relaxed">
              {property.location.split(',')[0]} is known for its stunning beaches, upscale dining, and celebrity homes. 
              You'll be just minutes from iconic Malibu Beach, Point Dume, and the Malibu Pier. 
              The area offers world-class surfing, hiking trails in the Santa Monica Mountains, 
              and some of the most beautiful sunset views in Southern California.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirbnbListing; 