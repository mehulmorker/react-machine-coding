import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, ZoomIn, ZoomOut, Download, Heart, RotateCw } from 'lucide-react';

interface CarouselImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  thumbnail?: string;
}

interface CarouselProps {
  images: CarouselImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showThumbnails?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  infiniteLoop?: boolean;
  onImageChange?: (index: number) => void;
}

/**
 * Image Carousel Component
 * 
 * Features:
 * - Auto-play with pause/resume
 * - Thumbnail navigation
 * - Touch/swipe support
 * - Zoom functionality
 * - Image download
 * - Keyboard navigation
 * - Infinite loop
 * - Responsive design
 * - Image rotation
 * - Favorite/like functionality
 */
const ImageCarouselDemo: React.FC = () => {
  const [autoPlay, setAutoPlay] = useState(true);
  const [autoPlayInterval, setAutoPlayInterval] = useState(3000);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showIndicators, setShowIndicators] = useState(true);
  const [infiniteLoop, setInfiniteLoop] = useState(true);

  // Sample images - in a real app, these would come from props or API
  const sampleImages: CarouselImage[] = [
    {
      id: '1',
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      alt: 'Mountain landscape',
      title: 'Mountain Peak',
      description: 'Beautiful mountain landscape during golden hour',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=75&fit=crop'
    },
    {
      id: '2',
      src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
      alt: 'Forest path',
      title: 'Forest Trail',
      description: 'Peaceful forest path in the morning mist',
      thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=100&h=75&fit=crop'
    },
    {
      id: '3',
      src: 'https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?w=800&h=600&fit=crop',
      alt: 'Ocean sunset',
      title: 'Ocean Sunset',
      description: 'Stunning sunset over the ocean waves',
      thumbnail: 'https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?w=100&h=75&fit=crop'
    },
    {
      id: '4',
      src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      alt: 'Forest landscape',
      title: 'Autumn Forest',
      description: 'Dense forest with autumn colors',
      thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=75&fit=crop'
    },
    {
      id: '5',
      src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
      alt: 'Desert landscape',
      title: 'Desert Dunes',
      description: 'Sand dunes in the desert under clear blue sky',
      thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=100&h=75&fit=crop'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Image Carousel</h1>
          <p className="text-gray-600">
            Interactive image carousel with auto-play, thumbnails, and touch support
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoPlay}
              onChange={(e) => setAutoPlay(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Auto Play</span>
          </label>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Interval:</span>
            <select
              value={autoPlayInterval}
              onChange={(e) => setAutoPlayInterval(parseInt(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={2000}>2s</option>
              <option value={3000}>3s</option>
              <option value={5000}>5s</option>
              <option value={10000}>10s</option>
            </select>
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showThumbnails}
              onChange={(e) => setShowThumbnails(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Thumbnails</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showControls}
              onChange={(e) => setShowControls(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Controls</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showIndicators}
              onChange={(e) => setShowIndicators(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Indicators</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={infiniteLoop}
              onChange={(e) => setInfiniteLoop(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Infinite Loop</span>
          </label>
        </div>

        {/* Carousel */}
        <CarouselComponent
          images={sampleImages}
          autoPlay={autoPlay}
          autoPlayInterval={autoPlayInterval}
          showThumbnails={showThumbnails}
          showControls={showControls}
          showIndicators={showIndicators}
          infiniteLoop={infiniteLoop}
        />
      </div>
    </div>
  );
};

const CarouselComponent: React.FC<CarouselProps> = ({
  images,
  autoPlay = false,
  autoPlayInterval = 3000,
  showThumbnails = true,
  showControls = true,
  showIndicators = true,
  infiniteLoop = true,
  onImageChange
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const nextImage = useCallback(() => {
    if (infiniteLoop) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    } else {
      setCurrentIndex((prev) => Math.min(prev + 1, images.length - 1));
    }
    resetImageState();
  }, [images.length, infiniteLoop]);

  const prevImage = useCallback(() => {
    if (infiniteLoop) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    } else {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
    resetImageState();
  }, [images.length, infiniteLoop]);

  const resetImageState = useCallback(() => {
    setZoom(1);
    setRotation(0);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && autoPlay && images.length > 1) {
      intervalRef.current = setInterval(() => {
        nextImage();
      }, autoPlayInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, autoPlay, autoPlayInterval, currentIndex, images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          prevImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextImage();
          break;
        case ' ':
          event.preventDefault();
          togglePlayPause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextImage, prevImage, togglePlayPause]);

  const goToImage = useCallback((index: number) => {
    setCurrentIndex(index);
    resetImageState();
    onImageChange?.(index);
  }, [onImageChange, resetImageState]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const toggleFavorite = (imageId: string) => {
    setFavorites(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = images[currentIndex].src;
    link.download = `image-${currentIndex + 1}.jpg`;
    link.click();
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No images to display
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        <div
          className="relative w-full h-full flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            ref={imageRef}
            src={currentImage.src}
            alt={currentImage.alt}
            className="max-w-full max-h-full object-contain transition-transform duration-300"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`
            }}
          />

          {/* Navigation Arrows */}
          {showControls && (
            <>
              <button
                onClick={prevImage}
                disabled={!infiniteLoop && currentIndex === 0}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                disabled={!infiniteLoop && currentIndex === images.length - 1}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Top Controls */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={togglePlayPause}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              onClick={() => toggleFavorite(currentImage.id)}
              className={`bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-all ${
                favorites.includes(currentImage.id) ? 'text-red-500' : 'text-white'
              }`}
            >
              <Heart className="h-4 w-4" fill={favorites.includes(currentImage.id) ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 flex space-x-2">
            <button
              onClick={handleZoomOut}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={handleZoomIn}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleRotate}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            >
              <RotateCw className="h-4 w-4" />
            </button>
            <button
              onClick={downloadImage}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>

          {/* Image Info */}
          {currentImage.title && (
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-lg max-w-xs">
              <h3 className="font-medium text-sm">{currentImage.title}</h3>
              {currentImage.description && (
                <p className="text-xs text-gray-300 mt-1">{currentImage.description}</p>
              )}
            </div>
          )}
        </div>

        {/* Indicators */}
        {showIndicators && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-white' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-20 h-15 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex 
                  ? 'border-blue-500 shadow-lg' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <img
                src={image.thumbnail || image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t text-center">
        <div>
          <div className="text-lg font-semibold text-gray-900">{currentIndex + 1}/{images.length}</div>
          <div className="text-xs text-gray-500">Current</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-900">{zoom.toFixed(2)}x</div>
          <div className="text-xs text-gray-500">Zoom</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-900">{rotation}°</div>
          <div className="text-xs text-gray-500">Rotation</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-900">{favorites.length}</div>
          <div className="text-xs text-gray-500">Favorites</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-900">{isPlaying ? 'Playing' : 'Paused'}</div>
          <div className="text-xs text-gray-500">Status</div>
        </div>
      </div>
    </div>
  );
};

export default ImageCarouselDemo; 