import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Plus, 
  Minus,
  Truck,
  Shield,
  RotateCcw,
  Gift,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  User,
  Verified,
  Award,
  Package,
  CreditCard,
  MapPin,
  Clock,
  Camera,
  ChevronDown,
  Filter,
  Search,
  Check,
  X
} from 'lucide-react';

interface Product {
  id: string;
  title: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  features: string[];
  specifications: { [key: string]: string };
  category: string;
  inStock: boolean;
  stockCount: number;
  seller: string;
  shippingInfo: {
    freeShipping: boolean;
    estimatedDays: number;
    prime: boolean;
  };
  warranty: string;
  returnPolicy: string;
}

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
  videoUrl?: string;
}

interface CartItem {
  productId: string;
  quantity: number;
  selectedOptions?: { [key: string]: string };
}

const sampleProduct: Product = {
  id: '1',
  title: 'Sony WH-1000XM4 Wireless Premium Noise Canceling Overhead Headphones with Mic for Phone-Call and Alexa Voice Control, Black',
  brand: 'Sony',
  price: 279.99,
  originalPrice: 349.99,
  discount: 20,
  rating: 4.5,
  reviewCount: 47824,
  images: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&h=500&fit=crop'
  ],
  description: 'Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with Edge-AI, co-developed with Sony Music Studios Tokyo. Up to 30-hour battery life with quick charge.',
  features: [
    'Industry-leading noise canceling technology',
    '30-hour battery life with quick charge',
    'Touch Sensor controls to pause play skip tracks',
    'Speak-to-chat technology',
    'Superior call quality with precise voice pickup',
    'Wearing detection pauses playback when headphones are removed'
  ],
  specifications: {
    'Brand': 'Sony',
    'Model': 'WH-1000XM4',
    'Color': 'Black',
    'Connectivity': 'Wireless, Bluetooth 5.0',
    'Battery Life': '30 hours',
    'Weight': '254 grams',
    'Frequency Response': '4 Hz-40,000 Hz',
    'Noise Cancellation': 'Yes',
    'Microphone': 'Built-in',
    'Compatibility': 'Universal'
  },
  category: 'Electronics > Headphones',
  inStock: true,
  stockCount: 157,
  seller: 'Amazon.com',
  shippingInfo: {
    freeShipping: true,
    estimatedDays: 2,
    prime: true
  },
  warranty: '1 Year Manufacturer Warranty',
  returnPolicy: '30-day returns'
};

const sampleReviews: Review[] = [
  {
    id: '1',
    userName: 'TechReviewer2023',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    rating: 5,
    title: 'Amazing noise cancellation and sound quality!',
    content: 'I\'ve been using these headphones for 6 months now and they\'re absolutely fantastic. The noise cancellation is incredible - I can\'t hear anything when it\'s on. The sound quality is crisp and clear with great bass. Battery life easily lasts me a week of regular use.',
    date: '2023-12-15',
    verified: true,
    helpful: 234,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop']
  },
  {
    id: '2',
    userName: 'MusicLover99',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    rating: 4,
    title: 'Great for travel and work',
    content: 'Perfect for my daily commute and working from home. The touch controls take some getting used to, but once you do, they\'re very convenient. Only complaint is they can get a bit warm during long sessions.',
    date: '2023-12-10',
    verified: true,
    helpful: 87
  },
  {
    id: '3',
    userName: 'AudioEnthusiast',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    rating: 5,
    title: 'Best investment I\'ve made!',
    content: 'Coming from cheaper headphones, the difference is night and day. The build quality feels premium, and the adaptive sound control is a game-changer. Highly recommend for anyone serious about audio quality.',
    date: '2023-12-08',
    verified: true,
    helpful: 156
  }
];

const relatedProducts: Product[] = [
  {
    id: '2',
    title: 'Bose QuietComfort 45',
    brand: 'Bose',
    price: 329.00,
    rating: 4.3,
    reviewCount: 12456,
    images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop'],
    description: 'Wireless Bluetooth Over Ear Headphones',
    features: [],
    specifications: {},
    category: 'Electronics',
    inStock: true,
    stockCount: 89,
    seller: 'Amazon.com',
    shippingInfo: { freeShipping: true, estimatedDays: 2, prime: true },
    warranty: '1 Year',
    returnPolicy: '30-day returns'
  },
  {
    id: '3',
    title: 'Apple AirPods Max',
    brand: 'Apple',
    price: 549.00,
    rating: 4.4,
    reviewCount: 8734,
    images: ['https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop'],
    description: 'Over-Ear Headphones',
    features: [],
    specifications: {},
    category: 'Electronics',
    inStock: true,
    stockCount: 23,
    seller: 'Amazon.com',
    shippingInfo: { freeShipping: true, estimatedDays: 1, prime: true },
    warranty: '1 Year',
    returnPolicy: '30-day returns'
  }
];

const AmazonProductCard: React.FC = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedTab, setSelectedTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const [reviewFilter, setReviewFilter] = useState<'all' | 1 | 2 | 3 | 4 | 5>('all');
  const [sortReviews, setSortReviews] = useState<'helpful' | 'recent' | 'rating'>('helpful');
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [selectedColor, setSelectedColor] = useState('Black');
  const [selectedSize, setSelectedSize] = useState('Standard');

  const product = sampleProduct;

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stockCount) {
      setQuantity(newQuantity);
    }
  };

  const addToCart = () => {
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { productId: product.id, quantity }]);
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    };

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const filteredReviews = sampleReviews.filter(review => {
    if (reviewFilter === 'all') return true;
    return review.rating === reviewFilter;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortReviews) {
      case 'helpful':
        return b.helpful - a.helpful;
      case 'recent':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">amazon</h1>
            <div className="relative flex-1 max-w-2xl">
              <input
                type="text"
                placeholder="Search Amazon"
                className="w-full bg-white text-black rounded-md py-2 px-4 pr-12"
              />
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Deliver to New York 10001</span>
            </div>
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-100 px-4 py-2">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-gray-600">
            <span>Electronics</span> › <span>Headphones</span> › <span>Over-Ear</span> › <span className="text-orange-600">Noise Canceling</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Image Gallery */}
          <div className="lg:col-span-5">
            <div className="sticky top-6">
              {/* Main Image */}
              <div className="mb-4">
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.title}
                  className="w-full aspect-square object-cover rounded-lg border"
                />
              </div>
              
              {/* Thumbnail Images */}
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageSelect(index)}
                    className={`flex-shrink-0 w-16 h-16 border-2 rounded-md overflow-hidden ${
                      selectedImageIndex === index ? 'border-orange-500' : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Share and Wishlist */}
              <div className="flex items-center space-x-4 mt-6">
                <button
                  onClick={toggleWishlist}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md border transition-colors ${
                    isWishlisted 
                      ? 'bg-red-50 border-red-300 text-red-600' 
                      : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-4">
            <div className="space-y-4">
              {/* Brand and Title */}
              <div>
                <div className="text-blue-600 font-medium text-sm mb-1">{product.brand}</div>
                <h1 className="text-2xl font-normal text-gray-900 leading-tight">{product.title}</h1>
              </div>

              {/* Rating and Reviews */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {renderStars(product.rating)}
                  <span className="text-blue-600 text-sm ml-1">{product.rating}</span>
                </div>
                <a href="#reviews" className="text-blue-600 text-sm hover:text-orange-600">
                  {formatNumber(product.reviewCount)} ratings
                </a>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Award className="w-4 h-4" />
                  <span>Amazon's Choice</span>
                </div>
              </div>

              <hr />

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-medium text-red-600">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                        -{product.discount}%
                      </span>
                    </>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  FREE Returns & FREE delivery tomorrow if you order in the next 3 hours
                </div>
              </div>

              <hr />

              {/* Options */}
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-2">Color: {selectedColor}</div>
                  <div className="flex space-x-2">
                    {['Black', 'Silver', 'Blue'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-md border text-sm ${
                          selectedColor === color
                            ? 'border-orange-500 bg-orange-50 text-orange-600'
                            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-900 mb-2">Size: {selectedSize}</div>
                  <div className="flex space-x-2">
                    {['Standard', 'Travel'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-md border text-sm ${
                          selectedSize === size
                            ? 'border-orange-500 bg-orange-50 text-orange-600'
                            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <hr />

              {/* Features */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">About this item</h3>
                <ul className="space-y-2">
                  {product.features.slice(0, showAllFeatures ? product.features.length : 3).map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {product.features.length > 3 && (
                  <button
                    onClick={() => setShowAllFeatures(!showAllFeatures)}
                    className="text-blue-600 text-sm hover:text-orange-600 mt-2"
                  >
                    {showAllFeatures ? 'Show less' : `Show ${product.features.length - 3} more features`}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Purchase Options */}
          <div className="lg:col-span-3">
            <div className="sticky top-6">
              <div className="border border-gray-300 rounded-lg p-4 space-y-4">
                <div className="text-2xl font-medium text-red-600">{formatPrice(product.price)}</div>
                
                {/* Shipping Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-blue-600">
                    <Truck className="w-4 h-4" />
                    <span>FREE delivery tomorrow</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Deliver to New York 10001</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-600">
                    <Package className="w-4 h-4" />
                    <span>In Stock - {product.stockCount} remaining</span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium">Qty:</span>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-2 hover:bg-gray-100"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-2 hover:bg-gray-100"
                      disabled={quantity >= product.stockCount}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={addToCart}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-full transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-full transition-colors">
                    Buy Now
                  </button>
                </div>

                {/* Security Features */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Secure transaction</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RotateCcw className="w-4 h-4" />
                    <span>30-day returns</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Gift className="w-4 h-4" />
                    <span>Gift options available</span>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="border-t pt-4 space-y-2 text-sm">
                  <div>Ships from: <span className="font-medium">Amazon.com</span></div>
                  <div>Sold by: <span className="font-medium">{product.seller}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'description', label: 'Product Description' },
                { id: 'specifications', label: 'Technical Details' },
                { id: 'reviews', label: 'Customer Reviews' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {selectedTab === 'description' && (
              <div>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Key Features</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2 text-gray-700">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {selectedTab === 'specifications' && (
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Technical Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-900">{key}</span>
                      <span className="text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div>
                {/* Review Summary */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-2xl font-medium text-gray-900 mb-4">Customer Reviews</h4>
                      <div className="flex items-center space-x-4 mb-4">
                        {renderStars(product.rating, 'lg')}
                        <span className="text-3xl font-medium">{product.rating}</span>
                        <span className="text-gray-600">out of 5</span>
                      </div>
                      <p className="text-gray-600">{formatNumber(product.reviewCount)} global ratings</p>
                    </div>
                    
                    {/* Rating Breakdown */}
                    <div>
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const percentage = Math.floor(Math.random() * 60) + 20; // Simulated data
                        return (
                          <div key={stars} className="flex items-center space-x-2 mb-2">
                            <span className="text-sm text-blue-600 hover:text-orange-600 cursor-pointer">
                              {stars} star
                            </span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{percentage}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Review Filters */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">Filter by:</span>
                    <select
                      value={reviewFilter}
                      onChange={(e) => setReviewFilter(e.target.value as any)}
                      className="border border-gray-300 rounded px-3 py-1 text-sm"
                    >
                      <option value="all">All ratings</option>
                      <option value={5}>5 stars</option>
                      <option value={4}>4 stars</option>
                      <option value={3}>3 stars</option>
                      <option value={2}>2 stars</option>
                      <option value={1}>1 star</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">Sort by:</span>
                    <select
                      value={sortReviews}
                      onChange={(e) => setSortReviews(e.target.value as any)}
                      className="border border-gray-300 rounded px-3 py-1 text-sm"
                    >
                      <option value="helpful">Most helpful</option>
                      <option value="recent">Most recent</option>
                      <option value="rating">Highest rating</option>
                    </select>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {sortedReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={review.userAvatar}
                          alt={review.userName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-gray-900">{review.userName}</span>
                            {review.verified && (
                              <div className="flex items-center space-x-1 text-orange-600">
                                <Verified className="w-4 h-4" />
                                <span className="text-xs">Verified Purchase</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 mb-2">
                            {renderStars(review.rating)}
                            <span className="font-medium text-gray-900">{review.title}</span>
                          </div>
                          
                          <p className="text-gray-700 mb-3">{review.content}</p>
                          
                          {review.images && (
                            <div className="flex space-x-2 mb-3">
                              {review.images.map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt={`Review ${index + 1}`}
                                  className="w-20 h-20 object-cover rounded border"
                                />
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{review.date}</span>
                            <div className="flex items-center space-x-4">
                              <button className="flex items-center space-x-1 hover:text-blue-600">
                                <ThumbsUp className="w-4 h-4" />
                                <span>Helpful ({review.helpful})</span>
                              </button>
                              <button className="flex items-center space-x-1 hover:text-blue-600">
                                <ThumbsDown className="w-4 h-4" />
                                <span>Not helpful</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h3 className="text-xl font-medium text-gray-900 mb-6">Customers who viewed this item also viewed</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <img
                  src={relatedProduct.images[0]}
                  alt={relatedProduct.title}
                  className="w-full aspect-square object-cover rounded mb-3"
                />
                <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">{relatedProduct.title}</h4>
                <div className="flex items-center space-x-1 mb-2">
                  {renderStars(relatedProduct.rating, 'sm')}
                  <span className="text-xs text-gray-600">({formatNumber(relatedProduct.reviewCount)})</span>
                </div>
                <div className="text-lg font-medium text-gray-900">{formatPrice(relatedProduct.price)}</div>
                {relatedProduct.shippingInfo.prime && (
                  <div className="text-xs text-blue-600 mt-1">Prime</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmazonProductCard; 