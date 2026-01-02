import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search,
  Filter,
  Download,
  Heart,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  Camera,
  ZoomIn,
  Info
} from 'lucide-react';

interface UnsplashImage {
  id: string;
  width: number;
  height: number;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    id: string;
    name: string;
    username: string;
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
  };
  description: string | null;
  alt_description: string | null;
  likes: number;
  downloads: number;
  tags: { title: string }[];
  created_at: string;
}

interface GalleryState {
  images: UnsplashImage[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  category: string;
  page: number;
  hasMore: boolean;
  view: 'grid' | 'masonry';
  selectedImage: UnsplashImage | null;
  favorites: string[];
  totalImages: number;
}

// Mock image data generator (using Unsplash-like structure)
const generateMockImages = (page: number, query: string = '', category: string = ''): UnsplashImage[] => {
  const images: UnsplashImage[] = [];
  const categories = ['nature', 'architecture', 'technology', 'food', 'travel', 'people', 'animals'];
  const photographers = ['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Wilson', 'Eve Davis'];
  
  for (let i = 0; i < 12; i++) {
    const id = `img-${page}-${i + 1}`;
    const width = 400 + Math.floor(Math.random() * 800);
    const height = 300 + Math.floor(Math.random() * 600);
    const photographer = photographers[Math.floor(Math.random() * photographers.length)];
    const imageCategory = category || categories[Math.floor(Math.random() * categories.length)];
    
    images.push({
      id,
      width,
      height,
      urls: {
        raw: `https://picsum.photos/id/${100 + (page - 1) * 12 + i}/${width}/${height}`,
        full: `https://picsum.photos/id/${100 + (page - 1) * 12 + i}/${width}/${height}`,
        regular: `https://picsum.photos/id/${100 + (page - 1) * 12 + i}/800/600`,
        small: `https://picsum.photos/id/${100 + (page - 1) * 12 + i}/400/300`,
        thumb: `https://picsum.photos/id/${100 + (page - 1) * 12 + i}/200/150`
      },
      user: {
        id: `user-${i}`,
        name: photographer,
        username: photographer.toLowerCase().replace(' ', ''),
        profile_image: {
          small: `https://api.dicebear.com/7.x/avataaars/svg?seed=${photographer}`,
          medium: `https://api.dicebear.com/7.x/avataaars/svg?seed=${photographer}`,
          large: `https://api.dicebear.com/7.x/avataaars/svg?seed=${photographer}`
        }
      },
      description: `Beautiful ${imageCategory} photograph`,
      alt_description: `A stunning ${imageCategory} scene captured in high detail`,
      likes: Math.floor(Math.random() * 1000) + 10,
      downloads: Math.floor(Math.random() * 500) + 5,
      tags: [
        { title: imageCategory },
        { title: 'photography' },
        { title: 'landscape' }
      ],
      created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    });
  }
  
  return images;
};

const ImageGallery: React.FC = () => {
  const [state, setState] = useState<GalleryState>({
    images: [],
    loading: false,
    error: null,
    searchTerm: '',
    category: '',
    page: 1,
    hasMore: true,
    view: 'grid',
    selectedImage: null,
    favorites: JSON.parse(localStorage.getItem('gallery-favorites') || '[]'),
    totalImages: 0
  });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  // Load images
  const loadImages = useCallback(async (page: number, reset: boolean = false) => {
    if (state.loading) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newImages = generateMockImages(page, state.searchTerm, state.category);
      const hasMore = page < 10; // Simulate limited pages

      setState(prev => ({
        ...prev,
        images: reset ? newImages : [...prev.images, ...newImages],
        loading: false,
        hasMore,
        page: hasMore ? page + 1 : prev.page,
        totalImages: reset ? newImages.length : prev.totalImages + newImages.length,
        error: null
      }));

    } catch (error) {
      console.error('Error loading images:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load images. Please try again.'
      }));
    }
  }, [state.loading, state.searchTerm, state.category]);

  // Search images
  const searchImages = useCallback(() => {
    setState(prev => ({
      ...prev,
      images: [],
      page: 1,
      hasMore: true,
      totalImages: 0
    }));
    loadImages(1, true);
  }, [loadImages]);

  // Set up intersection observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && state.hasMore && !state.loading) {
          loadImages(state.page);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [state.hasMore, state.loading, state.page, loadImages]);

  // Toggle favorite
  const toggleFavorite = useCallback((imageId: string) => {
    setState(prev => {
      const newFavorites = prev.favorites.includes(imageId)
        ? prev.favorites.filter(id => id !== imageId)
        : [...prev.favorites, imageId];
      
      localStorage.setItem('gallery-favorites', JSON.stringify(newFavorites));
      
      return {
        ...prev,
        favorites: newFavorites
      };
    });
  }, []);

  // Download image
  const downloadImage = useCallback(async (image: UnsplashImage) => {
    try {
      const link = document.createElement('a');
      link.href = image.urls.regular;
      link.download = `photo-${image.id}.jpg`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  }, []);

  // Navigate lightbox
  const navigateLightbox = useCallback((direction: 'prev' | 'next') => {
    if (!state.selectedImage) return;

    const selectedImage = state.selectedImage; // Create a const reference
    const currentIndex = state.images.findIndex(img => img.id === selectedImage.id);
    let newIndex: number;

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : state.images.length - 1;
    } else {
      newIndex = currentIndex < state.images.length - 1 ? currentIndex + 1 : 0;
    }

    setState(prev => ({
      ...prev,
      selectedImage: prev.images[newIndex]
    }));
  }, [state.selectedImage, state.images]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!state.selectedImage) return;

      switch (e.key) {
        case 'Escape':
          setState(prev => ({ ...prev, selectedImage: null }));
          break;
        case 'ArrowLeft':
          navigateLightbox('prev');
          break;
        case 'ArrowRight':
          navigateLightbox('next');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state.selectedImage, navigateLightbox]);

  // Initial load
  useEffect(() => {
    loadImages(1, true);
  }, []);

  // Filter categories
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'nature', label: 'Nature' },
    { value: 'architecture', label: 'Architecture' },
    { value: 'technology', label: 'Technology' },
    { value: 'food', label: 'Food' },
    { value: 'travel', label: 'Travel' },
    { value: 'people', label: 'People' },
    { value: 'animals', label: 'Animals' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Camera className="w-8 h-8 text-purple-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Image Gallery</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setState(prev => ({ ...prev, view: 'grid' }))}
                  className={`p-2 rounded ${state.view === 'grid' ? 'bg-white shadow-sm' : ''}`}
                  title="Grid view"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setState(prev => ({ ...prev, view: 'masonry' }))}
                  className={`p-2 rounded ${state.view === 'masonry' ? 'bg-white shadow-sm' : ''}`}
                  title="Masonry view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for photos..."
                value={state.searchTerm}
                onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && searchImages()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={state.category}
                  onChange={(e) => setState(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={searchImages}
                disabled={state.loading}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Search
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <div>
              {state.totalImages > 0 && `${state.totalImages} images loaded`}
              {state.favorites.length > 0 && ` • ${state.favorites.length} favorites`}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error State */}
        {state.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-red-700">{state.error}</p>
            </div>
          </div>
        )}

        {/* Images Grid */}
        {state.images.length > 0 ? (
          <div className={`${
            state.view === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6'
          }`}>
            {state.images.map((image) => (
              <div
                key={image.id}
                className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group cursor-pointer ${
                  state.view === 'masonry' ? 'break-inside-avoid' : ''
                }`}
                onClick={() => setState(prev => ({ ...prev, selectedImage: image }))}
              >
                <div className="relative">
                  <img
                    src={image.urls.small}
                    alt={image.alt_description || image.description || 'Gallery image'}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setState(prev => ({ ...prev, selectedImage: image }));
                        }}
                        className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                        title="View fullscreen"
                      >
                        <ZoomIn className="w-5 h-5 text-gray-700" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(image.id);
                        }}
                        className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                        title={state.favorites.includes(image.id) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart className={`w-5 h-5 ${
                          state.favorites.includes(image.id) ? 'text-red-500 fill-current' : 'text-gray-700'
                        }`} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadImage(image);
                        }}
                        className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                        title="Download image"
                      >
                        <Download className="w-5 h-5 text-gray-700" />
                      </button>
                    </div>
                  </div>

                  {/* Favorite indicator */}
                  {state.favorites.includes(image.id) && (
                    <div className="absolute top-3 right-3">
                      <Heart className="w-6 h-6 text-red-500 fill-current" />
                    </div>
                  )}
                </div>

                {/* Image Info */}
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={image.user.profile_image.small}
                      alt={image.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {image.user.name}
                      </p>
                      <p className="text-xs text-gray-500">@{image.user.username}</p>
                    </div>
                  </div>

                  {image.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {image.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{image.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>{image.downloads}</span>
                      </div>
                    </div>
                    <div className="text-xs">
                      {image.width} × {image.height}
                    </div>
                  </div>

                  {/* Tags */}
                  {image.tags && image.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {image.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : !state.loading && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Images Found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms or category filter
            </p>
          </div>
        )}

        {/* Loading */}
        {state.loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mr-3" />
            <span className="text-gray-600">Loading images...</span>
          </div>
        )}

        {/* Load more trigger */}
        <div ref={loadingRef} className="h-10" />

        {/* End of results */}
        {!state.hasMore && !state.loading && state.images.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No more images to load</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {state.selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full">
            {/* Close button */}
            <button
              onClick={() => setState(prev => ({ ...prev, selectedImage: null }))}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation */}
            <button
              onClick={() => navigateLightbox('prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigateLightbox('next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image */}
            <img
              src={state.selectedImage.urls.regular}
              alt={state.selectedImage.alt_description || state.selectedImage.description || 'Gallery image'}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm text-white p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={state.selectedImage.user.profile_image.small}
                    alt={state.selectedImage.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{state.selectedImage.user.name}</p>
                    <p className="text-sm text-white/70">@{state.selectedImage.user.username}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleFavorite(state.selectedImage!.id)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full"
                  >
                    <Heart className={`w-5 h-5 ${
                      state.favorites.includes(state.selectedImage.id) ? 'text-red-500 fill-current' : 'text-white'
                    }`} />
                  </button>
                  <button
                    onClick={() => downloadImage(state.selectedImage!)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full"
                  >
                    <Download className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
              {state.selectedImage.description && (
                <p className="mt-2 text-white/90">{state.selectedImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery; 