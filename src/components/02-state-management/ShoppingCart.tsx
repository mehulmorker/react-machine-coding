import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Package, 
  CreditCard, 
  Star,
  Filter,
  Search
} from 'lucide-react';

// Types
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  description: string;
  inStock: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Sample Products Data
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 99.99,
    image: "🎧",
    category: "Electronics",
    rating: 4.5,
    description: "High-quality wireless headphones with noise cancellation",
    inStock: 15
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 299.99,
    image: "⌚",
    category: "Electronics",
    rating: 4.8,
    description: "Advanced fitness tracking and smart notifications",
    inStock: 8
  },
  {
    id: 3,
    name: "Coffee Mug",
    price: 12.99,
    image: "☕",
    category: "Home",
    rating: 4.2,
    description: "Premium ceramic coffee mug with ergonomic design",
    inStock: 25
  },
  {
    id: 4,
    name: "Laptop Stand",
    price: 45.99,
    image: "💻",
    category: "Office",
    rating: 4.6,
    description: "Adjustable aluminum laptop stand for better ergonomics",
    inStock: 12
  },
  {
    id: 5,
    name: "Water Bottle",
    price: 18.99,
    image: "🚰",
    category: "Sports",
    rating: 4.3,
    description: "Insulated stainless steel water bottle, 24oz",
    inStock: 30
  },
  {
    id: 6,
    name: "Desk Lamp",
    price: 34.99,
    image: "💡",
    category: "Office",
    rating: 4.4,
    description: "LED desk lamp with adjustable brightness and color temperature",
    inStock: 18
  }
];

// Cart Actions
type CartAction = 
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

// Cart Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id 
            ? { ...item, quantity: Math.min(item.quantity + 1, item.inStock) }
            : item
        );
        return calculateTotals({ ...state, items: updatedItems });
      } else {
        const newItem: CartItem = { ...action.payload, quantity: 1 };
        return calculateTotals({ ...state, items: [...state.items, newItem] });
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return calculateTotals({ ...state, items: updatedItems });
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id 
          ? { ...item, quantity: Math.min(Math.max(action.payload.quantity, 0), item.inStock) }
          : item
      ).filter(item => item.quantity > 0);
      return calculateTotals({ ...state, items: updatedItems });
    }
    
    case 'CLEAR_CART': {
      return { items: [], total: 0, itemCount: 0 };
    }
    
    case 'LOAD_CART': {
      return calculateTotals({ ...state, items: action.payload });
    }
    
    default:
      return state;
  }
};

// Helper function to calculate totals
const calculateTotals = (state: CartState): CartState => {
  const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  return { ...state, total, itemCount };
};

// Cart Context
const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

// Cart Provider
const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('shopping-cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shopping-cart', JSON.stringify(state.items));
  }, [state.items]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Product Card Component
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { state, dispatch } = useCart();
  
  const cartItem = state.items.find(item => item.id === product.id);
  const isInCart = !!cartItem;
  const quantity = cartItem?.quantity || 0;
  
  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };
  
  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: product.id });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: product.id, quantity: newQuantity } });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
      <div className="text-center">
        <div className="text-4xl mb-2">{product.image}</div>
        <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
        
        <div className="flex items-center justify-center gap-1 mb-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm text-gray-600">{product.rating}</span>
        </div>
        
        <div className="text-xl font-bold text-gray-900 mb-3">
          ${product.price.toFixed(2)}
        </div>
        
        <div className="text-sm text-gray-500 mb-3">
          {product.inStock > 0 ? `${product.inStock} in stock` : 'Out of stock'}
        </div>
        
        {!isInCart ? (
          <button
            onClick={handleAddToCart}
            disabled={product.inStock === 0}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
            <button
              onClick={() => handleUpdateQuantity(quantity - 1)}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="font-semibold">{quantity}</span>
            <button
              onClick={() => handleUpdateQuantity(quantity + 1)}
              disabled={quantity >= product.inStock}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md disabled:bg-gray-200 disabled:cursor-not-allowed transition-shadow"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Cart Item Component
const CartItemComponent: React.FC<{ item: CartItem }> = ({ item }) => {
  const { dispatch } = useCart();
  
  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: item.id });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: newQuantity } });
    }
  };
  
  const handleRemove = () => {
    dispatch({ type: 'REMOVE_ITEM', payload: item.id });
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border">
      <div className="text-3xl">{item.image}</div>
      
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-600">{item.description}</p>
        <p className="text-lg font-semibold text-gray-900">${item.price.toFixed(2)}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleUpdateQuantity(item.quantity - 1)}
          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        <button
          onClick={() => handleUpdateQuantity(item.quantity + 1)}
          disabled={item.quantity >= item.inStock}
          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <div className="text-right">
        <div className="font-semibold text-gray-900">
          ${(item.price * item.quantity).toFixed(2)}
        </div>
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 transition-colors mt-1"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Cart Summary Component
const CartSummary: React.FC = () => {
  const { state, dispatch } = useCart();
  
  const subtotal = state.total;
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const total = subtotal + tax + shipping;
  
  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  if (state.items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h3>
        <p className="text-gray-500">Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Subtotal ({state.itemCount} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      
      <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors mb-3 flex items-center justify-center gap-2">
        <CreditCard className="h-5 w-5" />
        Proceed to Checkout
      </button>
      
      <button
        onClick={handleClearCart}
        className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors"
      >
        Clear Cart
      </button>
    </div>
  );
};

// Main Shopping Cart Component
const ShoppingCartComponent: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const categories = ['All', ...Array.from(new Set(SAMPLE_PRODUCTS.map(p => p.category)))];
  
  const filteredProducts = SAMPLE_PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <CartProvider>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete e-commerce cart with React Context API, local storage persistence, and real-time calculations
          </p>
        </div>
        
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Filter className="h-4 w-4 inline mr-1" />
                    {category}
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {/* Cart Items */}
            <CartItemsList />
          </div>
          
          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <CartSummary />
            </div>
          </div>
        </div>
      </div>
    </CartProvider>
  );
};

// Cart Items List Component
const CartItemsList: React.FC = () => {
  const { state } = useCart();
  
  if (state.items.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <ShoppingCart className="h-6 w-6" />
        Your Cart ({state.itemCount} items)
      </h2>
      <div className="space-y-3">
        {state.items.map(item => (
          <CartItemComponent key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ShoppingCartComponent;
