import React, { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import {
  Image,
  Eye,
  EyeOff,
  Settings,
  BarChart3,
  Clock,
  Download,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertCircle,
  Zap,
  Package,
  Monitor,
  Wifi,
  WifiOff
} from 'lucide-react';

// Lazy loaded components
const LazyChart = lazy(() => import('./LazyComponents/LazyChart'));
const LazyMap = lazy(() => import('./LazyComponents/LazyMap'));
const LazyDataTable = lazy(() => import('./LazyComponents/LazyDataTable'));

interface LazyLoadingState {
  imagesLoaded: Set<string>;
  componentsLoaded: Set<string>;
  intersectionThreshold: number;
  rootMargin: string;
  enableProgressiveLoading: boolean;
  showMetrics: boolean;
  loadingStrategy: 'eager' | 'lazy' | 'progressive';
  imageQuality: 'low' | 'medium' | 'high';
  enablePlaceholders: boolean;
  connectionSpeed: 'slow' | 'fast' | 'offline';
}

interface LoadingMetrics {
  totalImages: number;
  loadedImages: number;
  failedImages: number;
  loadTime: { [key: string]: number };
  averageLoadTime: number;
  totalDataTransfer: number;
  componentsLoadTime: { [key: string]: number };
}

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: 'low' | 'medium' | 'high';
  placeholder?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  className?: string;
}

// Custom Lazy Image Component
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width = 400,
  height = 300,
  quality = 'medium',
  placeholder = true,
  onLoad,
  onError,
  className = ''
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loadTime, setLoadTime] = useState<number>(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const startTime = useRef<number>(0);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          startTime.current = performance.now();
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Handle image load
  const handleLoad = useCallback(() => {
    const endTime = performance.now();
    const duration = endTime - startTime.current;
    setLoadTime(duration);
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  // Handle image error
  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // Get optimized image URL based on quality
  const getOptimizedSrc = (baseSrc: string, quality: string) => {
    const qualityMap = { low: 'w=200', medium: 'w=400', high: 'w=800' };
    return `${baseSrc}?${qualityMap[quality as keyof typeof qualityMap]}`;
  };

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden bg-gray-200 ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder */}
      {placeholder && !isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          {isInView ? (
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          ) : (
            <Image className="w-8 h-8 text-gray-300" />
          )}
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-sm text-red-600">Failed to load</p>
          </div>
        </div>
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={getOptimizedSrc(src, quality)}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />
      )}

      {/* Loading indicator */}
      {isLoaded && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
          {loadTime.toFixed(0)}ms
        </div>
      )}
    </div>
  );
};

// Component loading wrapper
const LazyComponentWrapper: React.FC<{
  name: string;
  onLoad: (name: string, time: number) => void;
  children: React.ReactNode;
}> = ({ name, onLoad, children }) => {
  const [startTime] = useState(performance.now());

  useEffect(() => {
    const endTime = performance.now();
    onLoad(name, endTime - startTime);
  }, [name, onLoad, startTime]);

  return <>{children}</>;
};

const LazyLoading: React.FC = () => {
  const [state, setState] = useState<LazyLoadingState>({
    imagesLoaded: new Set(),
    componentsLoaded: new Set(),
    intersectionThreshold: 0.1,
    rootMargin: '50px',
    enableProgressiveLoading: true,
    showMetrics: true,
    loadingStrategy: 'lazy',
    imageQuality: 'medium',
    enablePlaceholders: true,
    connectionSpeed: 'fast'
  });

  const [metrics, setMetrics] = useState<LoadingMetrics>({
    totalImages: 0,
    loadedImages: 0,
    failedImages: 0,
    loadTime: {},
    averageLoadTime: 0,
    totalDataTransfer: 0,
    componentsLoadTime: {}
  });

  const [activeTab, setActiveTab] = useState<'images' | 'components' | 'progressive'>('images');

  // Sample images for demonstration
  const images = Array.from({ length: 20 }, (_, i) => ({
    id: `img-${i}`,
    src: `https://picsum.photos/id/${100 + i}/400/300`,
    alt: `Sample image ${i + 1}`,
    title: `Image ${i + 1}`,
    description: `This is a sample image for testing lazy loading performance and optimization techniques.`
  }));

  // Handle image load
  const handleImageLoad = useCallback((imageId: string) => {
    setState(prev => ({
      ...prev,
      imagesLoaded: new Set([...Array.from(prev.imagesLoaded), imageId])
    }));
    setMetrics(prev => ({
      ...prev,
      loadedImages: prev.loadedImages + 1
    }));
  }, []);

  // Handle image error
  const handleImageError = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      failedImages: prev.failedImages + 1
    }));
  }, []);

  // Handle component load
  const handleComponentLoad = useCallback((name: string, loadTime: number) => {
    setState(prev => ({
      ...prev,
      componentsLoaded: new Set([...Array.from(prev.componentsLoaded), name])
    }));
    setMetrics(prev => ({
      ...prev,
      componentsLoadTime: {
        ...prev.componentsLoadTime,
        [name]: loadTime
      }
    }));
  }, []);

  // Initialize metrics
  useEffect(() => {
    setMetrics(prev => ({
      ...prev,
      totalImages: images.length
    }));
  }, [images.length]);

  // Calculate average load time
  useEffect(() => {
    const loadTimes = Object.values(metrics.loadTime);
    const average = loadTimes.length > 0 
      ? loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length 
      : 0;
    setMetrics(prev => ({
      ...prev,
      averageLoadTime: average
    }));
  }, [metrics.loadTime]);

  // Reset all loading
  const resetLoading = useCallback(() => {
    setState(prev => ({
      ...prev,
      imagesLoaded: new Set(),
      componentsLoaded: new Set()
    }));
    setMetrics({
      totalImages: images.length,
      loadedImages: 0,
      failedImages: 0,
      loadTime: {},
      averageLoadTime: 0,
      totalDataTransfer: 0,
      componentsLoadTime: {}
    });
    // Force re-render by changing a key
    window.location.reload();
  }, [images.length]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lazy Loading</h1>
                <p className="text-gray-600">Progressive content loading with optimization techniques</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  state.connectionSpeed === 'fast' ? 'bg-green-500' : 
                  state.connectionSpeed === 'slow' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-sm text-gray-600 capitalize">{state.connectionSpeed} Connection</span>
              </div>
              
              <button
                onClick={() => setState(prev => ({ ...prev, showMetrics: !prev.showMetrics }))}
                className={`p-2 rounded-lg transition-colors ${
                  state.showMetrics ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}
                title="Toggle metrics"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
              <button
                onClick={resetLoading}
                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                title="Reset loading"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loading Strategy</label>
              <select
                value={state.loadingStrategy}
                onChange={(e) => setState(prev => ({ ...prev, loadingStrategy: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="eager">Eager Loading</option>
                <option value="lazy">Lazy Loading</option>
                <option value="progressive">Progressive Loading</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image Quality</label>
              <select
                value={state.imageQuality}
                onChange={(e) => setState(prev => ({ ...prev, imageQuality: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="low">Low Quality</option>
                <option value="medium">Medium Quality</option>
                <option value="high">High Quality</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Connection Speed</label>
              <select
                value={state.connectionSpeed}
                onChange={(e) => setState(prev => ({ ...prev, connectionSpeed: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="fast">Fast (4G/WiFi)</option>
                <option value="slow">Slow (3G)</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            <div className="flex items-center space-x-4 pt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={state.enablePlaceholders}
                  onChange={(e) => setState(prev => ({ ...prev, enablePlaceholders: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Placeholders</span>
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Metrics Panel */}
          {state.showMetrics && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Loading Metrics
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Image className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-600">Images Loaded</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {metrics.loadedImages}/{metrics.totalImages}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">Success Rate</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {metrics.totalImages > 0 ? Math.round((metrics.loadedImages / metrics.totalImages) * 100) : 0}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-600">Avg Load Time</span>
                    </div>
                    <span className="font-semibold text-gray-900">{metrics.averageLoadTime.toFixed(0)}ms</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-sm text-gray-600">Failed</span>
                    </div>
                    <span className="font-semibold text-gray-900">{metrics.failedImages}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Package className="w-4 h-4 text-purple-500 mr-2" />
                      <span className="text-sm text-gray-600">Components</span>
                    </div>
                    <span className="font-semibold text-gray-900">{state.componentsLoaded.size}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Loading Progress</span>
                    <span className="text-sm text-gray-500">
                      {Math.round((metrics.loadedImages / metrics.totalImages) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(metrics.loadedImages / metrics.totalImages) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Component Load Times */}
              {Object.keys(metrics.componentsLoadTime).length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Component Load Times
                  </h3>
                  
                  <div className="space-y-2">
                    {Object.entries(metrics.componentsLoadTime).map(([name, time]) => (
                      <div key={name} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{name}</span>
                        <span className="text-sm font-semibold text-gray-900">{time.toFixed(0)}ms</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Content Area */}
          <div className={state.showMetrics ? "lg:col-span-3" : "lg:col-span-4"}>
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {[
                    { id: 'images', name: 'Image Lazy Loading', icon: Image },
                    { id: 'components', name: 'Component Lazy Loading', icon: Package },
                    { id: 'progressive', name: 'Progressive Loading', icon: Zap }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`${
                        activeTab === tab.id
                          ? 'border-green-500 text-green-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                      <tab.icon className="w-4 h-4 mr-2" />
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Image Lazy Loading Tab */}
                {activeTab === 'images' && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Image Lazy Loading Demo</h3>
                      <p className="text-gray-600">
                        Images are loaded only when they enter the viewport using the Intersection Observer API.
                        Scroll down to see lazy loading in action.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {images.map((image) => (
                        <div key={image.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                          <LazyImage
                            src={image.src}
                            alt={image.alt}
                            quality={state.imageQuality}
                            placeholder={state.enablePlaceholders}
                            onLoad={() => handleImageLoad(image.id)}
                            onError={handleImageError}
                            className="w-full h-48"
                          />
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">{image.title}</h4>
                            <p className="text-sm text-gray-600">{image.description}</p>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xs text-gray-500">Quality: {state.imageQuality}</span>
                              <div className="flex items-center">
                                {state.imagesLoaded.has(image.id) ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Clock className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Component Lazy Loading Tab */}
                {activeTab === 'components' && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Component Lazy Loading Demo</h3>
                      <p className="text-gray-600">
                        Heavy components are loaded on-demand using React.lazy() and Suspense boundaries.
                        Click the buttons to load components dynamically.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Chart Component */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">Interactive Chart Component</h4>
                          <div className="flex items-center">
                            {state.componentsLoaded.has('LazyChart') && (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            )}
                            <span className="text-sm text-gray-500">
                              {metrics.componentsLoadTime['LazyChart'] 
                                ? `${metrics.componentsLoadTime['LazyChart'].toFixed(0)}ms` 
                                : 'Not loaded'}
                            </span>
                          </div>
                        </div>
                        
                        <Suspense fallback={
                          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">Loading Chart Component...</p>
                            </div>
                          </div>
                        }>
                          <LazyComponentWrapper name="LazyChart" onLoad={handleComponentLoad}>
                            <LazyChart />
                          </LazyComponentWrapper>
                        </Suspense>
                      </div>

                      {/* Map Component */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">Interactive Map Component</h4>
                          <div className="flex items-center">
                            {state.componentsLoaded.has('LazyMap') && (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            )}
                            <span className="text-sm text-gray-500">
                              {metrics.componentsLoadTime['LazyMap'] 
                                ? `${metrics.componentsLoadTime['LazyMap'].toFixed(0)}ms` 
                                : 'Not loaded'}
                            </span>
                          </div>
                        </div>
                        
                        <Suspense fallback={
                          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">Loading Map Component...</p>
                            </div>
                          </div>
                        }>
                          <LazyComponentWrapper name="LazyMap" onLoad={handleComponentLoad}>
                            <LazyMap />
                          </LazyComponentWrapper>
                        </Suspense>
                      </div>

                      {/* Data Table Component */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">Data Table Component</h4>
                          <div className="flex items-center">
                            {state.componentsLoaded.has('LazyDataTable') && (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            )}
                            <span className="text-sm text-gray-500">
                              {metrics.componentsLoadTime['LazyDataTable'] 
                                ? `${metrics.componentsLoadTime['LazyDataTable'].toFixed(0)}ms` 
                                : 'Not loaded'}
                            </span>
                          </div>
                        </div>
                        
                        <Suspense fallback={
                          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">Loading Data Table Component...</p>
                            </div>
                          </div>
                        }>
                          <LazyComponentWrapper name="LazyDataTable" onLoad={handleComponentLoad}>
                            <LazyDataTable />
                          </LazyComponentWrapper>
                        </Suspense>
                      </div>
                    </div>
                  </div>
                )}

                {/* Progressive Loading Tab */}
                {activeTab === 'progressive' && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Progressive Loading Demo</h3>
                      <p className="text-gray-600">
                        Content is loaded progressively based on user interaction, connection speed, and priority.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Connection Status */}
                      <div className="bg-white rounded-lg border p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                          {state.connectionSpeed === 'fast' ? <Wifi className="w-5 h-5 mr-2 text-green-500" /> :
                           state.connectionSpeed === 'slow' ? <Wifi className="w-5 h-5 mr-2 text-yellow-500" /> :
                           <WifiOff className="w-5 h-5 mr-2 text-red-500" />}
                          Connection Status
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Speed</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              state.connectionSpeed === 'fast' ? 'bg-green-100 text-green-800' :
                              state.connectionSpeed === 'slow' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {state.connectionSpeed.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Loading Strategy</span>
                            <span className="text-sm font-medium text-gray-900">{state.loadingStrategy}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Image Quality</span>
                            <span className="text-sm font-medium text-gray-900">{state.imageQuality}</span>
                          </div>
                        </div>
                      </div>

                      {/* Loading Recommendations */}
                      <div className="bg-white rounded-lg border p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <Zap className="w-5 h-5 mr-2 text-blue-500" />
                          Optimization Recommendations
                        </h4>
                        <div className="space-y-2">
                          {state.connectionSpeed === 'slow' && (
                            <div className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                              <p className="text-sm text-gray-600">Consider using low quality images for better performance</p>
                            </div>
                          )}
                          {state.connectionSpeed === 'offline' && (
                            <div className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                              <p className="text-sm text-gray-600">Offline mode: Only cached content available</p>
                            </div>
                          )}
                          {metrics.failedImages > 0 && (
                            <div className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                              <p className="text-sm text-gray-600">Some images failed to load. Check network connection.</p>
                            </div>
                          )}
                          {metrics.averageLoadTime > 1000 && (
                            <div className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                              <p className="text-sm text-gray-600">Average load time is high. Consider optimizing image sizes.</p>
                            </div>
                          )}
                          {metrics.loadedImages === metrics.totalImages && metrics.averageLoadTime < 500 && (
                            <div className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                              <p className="text-sm text-gray-600">Excellent performance! All images loaded quickly.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LazyLoading; 