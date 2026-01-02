import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ChefHat, 
  Search, 
  Clock, 
  Users, 
  Heart,
  HeartOff,
  BookmarkPlus,
  BookmarkCheck,
  Calendar,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  X,
  Filter,
  Star,
  AlertCircle,
  Loader2,
  Utensils,
  Flame,
  Award,
  Share2,
  ChevronDown,
  Activity
} from 'lucide-react';

interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  reviewCount: number;
  calories: number;
  cuisine: string;
  diet: string[];
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: NutritionInfo;
  tags: string[];
  isFavorite: boolean;
  isInMealPlan: boolean;
  author: string;
}

interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: string;
  inShoppingList?: boolean;
}

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

interface MealPlan {
  date: string;
  meals: {
    breakfast?: Recipe[];
    lunch?: Recipe[];
    dinner?: Recipe[];
    snack?: Recipe[];
  };
}

const CUISINES = ['All', 'Italian', 'Mexican', 'Asian', 'Mediterranean', 'American', 'Indian', 'French', 'Thai', 'Japanese'];
const DIETS = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Paleo', 'Low-Carb', 'Dairy-Free'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

// Mock recipe data generator
const generateMockRecipes = (count: number = 20): Recipe[] => {
  const titles = [
    'Creamy Mushroom Risotto',
    'Spicy Thai Green Curry',
    'Classic Caesar Salad',
    'Homemade Pizza Margherita',
    'Chocolate Chip Cookies',
    'Grilled Salmon with Herbs',
    'Chicken Tikka Masala',
    'Fresh Caprese Salad',
    'Beef Tacos with Lime',
    'Vegetable Stir Fry',
    'Lemon Garlic Pasta',
    'BBQ Pulled Pork',
    'Greek Moussaka',
    'Banana Bread',
    'Tom Yum Soup',
    'Quinoa Buddha Bowl',
    'Stuffed Bell Peppers',
    'Apple Cinnamon Oatmeal',
    'Fish and Chips',
    'Mango Smoothie Bowl'
  ];

  const descriptions = [
    'A delicious and hearty dish perfect for any occasion with fresh ingredients and bold flavors.',
    'Quick and easy recipe that delivers amazing taste with minimal effort and maximum satisfaction.',
    'Traditional recipe with a modern twist, bringing comfort food to a whole new level.',
    'Healthy and nutritious meal that doesn\'t compromise on taste, perfect for meal prep.',
    'Family-friendly recipe that everyone will love, made with simple and wholesome ingredients.'
  ];

  const authors = ['Chef Maria', 'Gordon Smith', 'Lisa Chen', 'Carlos Rodriguez', 'Emma Johnson', 'David Park'];

  return Array.from({ length: count }, (_, i) => ({
    id: `recipe-${i + 1}`,
    title: titles[i % titles.length],
    description: descriptions[i % descriptions.length],
    imageUrl: `https://picsum.photos/400/300?random=${i + 50}`,
    prepTime: 10 + Math.floor(Math.random() * 30),
    cookTime: 15 + Math.floor(Math.random() * 45),
    servings: 2 + Math.floor(Math.random() * 6),
    difficulty: DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)] as 'Easy' | 'Medium' | 'Hard',
    rating: 3.5 + Math.random() * 1.5,
    reviewCount: 10 + Math.floor(Math.random() * 500),
    calories: 200 + Math.floor(Math.random() * 600),
    cuisine: CUISINES[Math.floor(Math.random() * (CUISINES.length - 1)) + 1],
    diet: DIETS.slice(0, Math.floor(Math.random() * 3)),
    ingredients: generateIngredients(8 + Math.floor(Math.random() * 5)),
    instructions: generateInstructions(4 + Math.floor(Math.random() * 4)),
    nutrition: {
      calories: 200 + Math.floor(Math.random() * 600),
      protein: 10 + Math.floor(Math.random() * 40),
      carbs: 20 + Math.floor(Math.random() * 60),
      fat: 5 + Math.floor(Math.random() * 30),
      fiber: 2 + Math.floor(Math.random() * 15),
      sugar: 5 + Math.floor(Math.random() * 25),
      sodium: 200 + Math.floor(Math.random() * 800)
    },
    tags: ['Quick', 'Healthy', 'Comfort Food', 'Spicy', 'Sweet'].slice(0, Math.floor(Math.random() * 3) + 1),
    isFavorite: Math.random() > 0.7,
    isInMealPlan: Math.random() > 0.8,
    author: authors[Math.floor(Math.random() * authors.length)]
  }));
};

const generateIngredients = (count: number): Ingredient[] => {
  const ingredientNames = [
    'Chicken breast', 'Olive oil', 'Garlic', 'Onion', 'Tomatoes', 'Rice', 'Pasta',
    'Bell peppers', 'Mushrooms', 'Cheese', 'Herbs', 'Salt', 'Black pepper', 'Butter'
  ];
  
  const units = ['cups', 'tbsp', 'tsp', 'lbs', 'oz', 'cloves', 'pieces'];
  const categories = ['Protein', 'Vegetables', 'Grains', 'Dairy', 'Spices', 'Condiments'];

  return Array.from({ length: count }, (_, i) => ({
    id: `ingredient-${i + 1}`,
    name: ingredientNames[i % ingredientNames.length],
    amount: 1 + Math.floor(Math.random() * 4),
    unit: units[Math.floor(Math.random() * units.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    inShoppingList: false
  }));
};

const generateInstructions = (count: number): string[] => {
  const steps = [
    'Preheat oven to 375°F and prepare your ingredients.',
    'Heat oil in a large pan over medium heat.',
    'Add onions and garlic, cook until fragrant.',
    'Add main ingredients and cook according to recipe.',
    'Season with salt, pepper, and other spices.',
    'Simmer for the specified time until cooked through.',
    'Serve hot and enjoy your delicious meal.',
    'Garnish with fresh herbs before serving.'
  ];

  return steps.slice(0, count);
};

const RecipeFinder: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [maxPrepTime, setMaxPrepTime] = useState(60);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'meal-plan'>('all');
  const [shoppingList, setShoppingList] = useState<Ingredient[]>([]);
  const [showShoppingList, setShowShoppingList] = useState(false);

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    let filtered = recipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCuisine = selectedCuisine === 'All' || recipe.cuisine === selectedCuisine;
      
      const matchesDiet = selectedDiets.length === 0 || 
                         selectedDiets.every(diet => recipe.diet.includes(diet));
      
      const matchesPrepTime = recipe.prepTime <= maxPrepTime;
      
      const matchesDifficulty = selectedDifficulty.length === 0 || 
                               selectedDifficulty.includes(recipe.difficulty);
      
      const matchesTab = activeTab === 'all' || 
                        (activeTab === 'favorites' && recipe.isFavorite) ||
                        (activeTab === 'meal-plan' && recipe.isInMealPlan);
      
      return matchesSearch && matchesCuisine && matchesDiet && matchesPrepTime && matchesDifficulty && matchesTab;
    });

    return filtered.sort((a, b) => b.rating - a.rating);
  }, [recipes, searchTerm, selectedCuisine, selectedDiets, maxPrepTime, selectedDifficulty, activeTab]);

  // Fetch recipes
  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRecipes = generateMockRecipes(40);
      setRecipes(mockRecipes);
    } catch (err) {
      setError('Failed to fetch recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback((recipeId: string) => {
    setRecipes(prev => prev.map(recipe => 
      recipe.id === recipeId 
        ? { ...recipe, isFavorite: !recipe.isFavorite }
        : recipe
    ));
  }, []);

  // Toggle meal plan
  const toggleMealPlan = useCallback((recipeId: string) => {
    setRecipes(prev => prev.map(recipe => 
      recipe.id === recipeId 
        ? { ...recipe, isInMealPlan: !recipe.isInMealPlan }
        : recipe
    ));
  }, []);

  // Add to shopping list
  const addToShoppingList = useCallback((ingredients: Ingredient[]) => {
    setShoppingList(prev => {
      const newItems = ingredients.filter(ingredient => 
        !prev.some(item => item.name === ingredient.name)
      );
      return [...prev, ...newItems];
    });
  }, []);

  // Remove from shopping list
  const removeFromShoppingList = useCallback((ingredientId: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== ingredientId));
  }, []);

  // Toggle diet filter
  const toggleDiet = useCallback((diet: string) => {
    setSelectedDiets(prev => 
      prev.includes(diet)
        ? prev.filter(d => d !== diet)
        : [...prev, diet]
    );
  }, []);

  // Toggle difficulty filter
  const toggleDifficulty = useCallback((difficulty: string) => {
    setSelectedDifficulty(prev => 
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  }, []);

  // Format time
  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
            <span className="text-lg text-gray-600">Loading recipes...</span>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Recipes</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchRecipes}
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
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-orange-100 p-2 rounded-lg mr-3">
                <ChefHat className="w-6 h-6 text-orange-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Recipe Finder</h1>
            </div>
            <button
              onClick={() => setShowShoppingList(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Shopping List ({shoppingList.length})
            </button>
          </div>
          <p className="text-gray-600">
            Discover delicious recipes, plan your meals, and create shopping lists
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit">
            {[
              { key: 'all', label: 'All Recipes', count: recipes.length },
              { key: 'favorites', label: 'Favorites', count: recipes.filter(r => r.isFavorite).length },
              { key: 'meal-plan', label: 'Meal Plan', count: recipes.filter(r => r.isInMealPlan).length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search recipes or ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Quick Filters */}
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {CUISINES.map(cuisine => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>

            {/* Prep Time */}
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="15"
                max="120"
                value={maxPrepTime}
                onChange={(e) => setMaxPrepTime(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-gray-600 w-16">{formatTime(maxPrepTime)}</span>
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
              {/* Diet Filters */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Dietary Preferences</h3>
                <div className="flex flex-wrap gap-2">
                  {DIETS.map(diet => (
                    <button
                      key={diet}
                      onClick={() => toggleDiet(diet)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        selectedDiets.includes(diet)
                          ? 'bg-green-100 border-green-300 text-green-700'
                          : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filters */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Difficulty</h3>
                <div className="flex gap-2">
                  {DIFFICULTIES.map(difficulty => (
                    <button
                      key={difficulty}
                      onClick={() => toggleDifficulty(difficulty)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        selectedDifficulty.includes(difficulty)
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {difficulty}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recipes Grid */}
        {filteredRecipes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Recipes Found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map(recipe => (
              <div key={recipe.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                {/* Recipe Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRecipe(recipe);
                          setShowModal(true);
                        }}
                        className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100 transition-colors"
                      >
                        <Utensils className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleFavorite(recipe.id)}
                        className={`p-2 rounded-full transition-colors ${
                          recipe.isFavorite
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-white text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        {recipe.isFavorite ? <Heart className="w-4 h-4 fill-current" /> : <HeartOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => addToShoppingList(recipe.ingredients)}
                        className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100 transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Difficulty Badge */}
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </div>

                  {/* Rating */}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center">
                    <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" />
                    {recipe.rating.toFixed(1)}
                  </div>
                </div>

                {/* Recipe Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{recipe.title}</h3>
                    {recipe.isFavorite && <Heart className="w-4 h-4 text-red-500 fill-current" />}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recipe.description}</p>

                  {/* Recipe Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTime(recipe.prepTime + recipe.cookTime)}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {recipe.servings}
                    </div>
                    <div className="flex items-center">
                      <Flame className="w-3 h-3 mr-1" />
                      {recipe.calories} cal
                    </div>
                  </div>

                  {/* Cuisine & Diet Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                      {recipe.cuisine}
                    </span>
                    {recipe.diet.slice(0, 2).map(diet => (
                      <span key={diet} className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded">
                        {diet}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setSelectedRecipe(recipe);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View Recipe
                    </button>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleMealPlan(recipe.id)}
                        className={`p-1 rounded transition-colors ${
                          recipe.isInMealPlan
                            ? 'text-blue-600'
                            : 'text-gray-400 hover:text-blue-600'
                        }`}
                      >
                        {recipe.isInMealPlan ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recipe Details Modal */}
        {showModal && selectedRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="relative">
                <img
                  src={selectedRecipe.imageUrl}
                  alt={selectedRecipe.title}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-6 left-6 text-white">
                  <h2 className="text-3xl font-bold mb-2">{selectedRecipe.title}</h2>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
                      {selectedRecipe.rating.toFixed(1)} ({selectedRecipe.reviewCount} reviews)
                    </span>
                    <span>By {selectedRecipe.author}</span>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2">
                    {/* Recipe Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <Clock className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                        <div className="text-sm font-medium text-gray-900">Prep</div>
                        <div className="text-xs text-gray-600">{formatTime(selectedRecipe.prepTime)}</div>
                      </div>
                      <div className="text-center">
                        <Utensils className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                        <div className="text-sm font-medium text-gray-900">Cook</div>
                        <div className="text-xs text-gray-600">{formatTime(selectedRecipe.cookTime)}</div>
                      </div>
                      <div className="text-center">
                        <Users className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                        <div className="text-sm font-medium text-gray-900">Serves</div>
                        <div className="text-xs text-gray-600">{selectedRecipe.servings}</div>
                      </div>
                      <div className="text-center">
                        <Flame className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                        <div className="text-sm font-medium text-gray-900">Calories</div>
                        <div className="text-xs text-gray-600">{selectedRecipe.calories}</div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                      <p className="text-gray-600">{selectedRecipe.description}</p>
                    </div>

                    {/* Ingredients */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">Ingredients</h3>
                        <button
                          onClick={() => addToShoppingList(selectedRecipe.ingredients)}
                          className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Add to Shopping List
                        </button>
                      </div>
                      <div className="space-y-2">
                        {selectedRecipe.ingredients.map(ingredient => (
                          <div key={ingredient.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <span className="text-gray-700">
                              {ingredient.amount} {ingredient.unit} {ingredient.name}
                            </span>
                            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                              {ingredient.category}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Instructions</h3>
                      <ol className="space-y-3">
                        {selectedRecipe.instructions.map((step, index) => (
                          <li key={index} className="flex">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-sm rounded-full flex items-center justify-center mr-3 mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={() => toggleFavorite(selectedRecipe.id)}
                        className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                          selectedRecipe.isFavorite
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        {selectedRecipe.isFavorite ? (
                          <>
                            <Heart className="w-4 h-4 mr-2 fill-current" />
                            Favorited
                          </>
                        ) : (
                          <>
                            <HeartOff className="w-4 h-4 mr-2" />
                            Add to Favorites
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => toggleMealPlan(selectedRecipe.id)}
                        className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                          selectedRecipe.isInMealPlan
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        {selectedRecipe.isInMealPlan ? (
                          <>
                            <BookmarkCheck className="w-4 h-4 mr-2" />
                            In Meal Plan
                          </>
                        ) : (
                          <>
                            <BookmarkPlus className="w-4 h-4 mr-2" />
                            Add to Meal Plan
                          </>
                        )}
                      </button>

                      <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Recipe
                      </button>
                    </div>

                    {/* Nutrition Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Nutrition (per serving)</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Calories</span>
                          <span className="font-medium">{selectedRecipe.nutrition.calories}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Protein</span>
                          <span className="font-medium">{selectedRecipe.nutrition.protein}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Carbs</span>
                          <span className="font-medium">{selectedRecipe.nutrition.carbs}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fat</span>
                          <span className="font-medium">{selectedRecipe.nutrition.fat}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fiber</span>
                          <span className="font-medium">{selectedRecipe.nutrition.fiber}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sodium</span>
                          <span className="font-medium">{selectedRecipe.nutrition.sodium}mg</span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedRecipe.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                        {selectedRecipe.diet.map(diet => (
                          <span key={diet} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                            {diet}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shopping List Modal */}
        {showShoppingList && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Shopping List</h2>
                  <button
                    onClick={() => setShowShoppingList(false)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {shoppingList.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Your shopping list is empty</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {shoppingList.map(ingredient => (
                      <div key={ingredient.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-900">
                            {ingredient.amount} {ingredient.unit} {ingredient.name}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">({ingredient.category})</span>
                        </div>
                        <button
                          onClick={() => removeFromShoppingList(ingredient.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {shoppingList.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setShoppingList([])}
                      className="w-full py-2 text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Clear Shopping List
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeFinder; 