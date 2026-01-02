import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Settings,
  Download,
  RefreshCw,
  BarChart3,
  Clock,
  Zap,
  Monitor,
  Smartphone,
  Tablet,
  FileImage,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface ImageConfig {
  id: string;
  title: string;
  description: string;
  originalSrc: string;
  formats: {
    webp: string;
    jpeg: string;
    png?: string;
  };
  sizes: {
    mobile: { width: number; height: number; quality: number };
    tablet: { width: number; height: number; quality: number };
    desktop: { width: number; height: number; quality: number };
  };
  alt: string;
  category: 'landscape' | 'portrait' | 'square' | 'banner';
}

interface OptimizationSettings {
  enableWebP: boolean;
  enableProgressiveJPEG: boolean;
  enableResponsive: boolean;
  enableLazyLoading: boolean;
  compressionQuality: number;
  enablePlaceholder: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  viewMode: 'grid' | 'list' | 'comparison';
  showMetrics: boolean;
}

interface ImageMetrics {
  originalSize: number;
  optimizedSize: number;
  loadTime: number;
  format: string;
  compression: number;
  isWebPSupported: boolean;
}

interface LoadingState {
  [key: string]: {
    isLoading: boolean;
    isLoaded: boolean;
    hasError: boolean;
    loadTime: number;
    format: string;
  };
}

// Progressive Image Component
const ProgressiveImage: React.FC<{
  config: ImageConfig;
  settings: OptimizationSettings;
  onMetrics: (id: string, metrics: Partial<ImageMetrics>) => void;
}> = ({ config, settings, onMetrics }) => {
  const [loadingState, setLoadingState] = useState({
    placeholder: true,
    lowQuality: false,
    highQuality: false
  });
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const startTime = useRef<number>(0);

  // Check WebP support
  const isWebPSupported = useCallback(() => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    } catch (error) {
      console.warn('WebP detection failed:', error);
      return false;
    }
  }, []);

  // Determine optimal source based on settings
  const getOptimalSrc = useCallback(() => {
    const deviceConfig = config.sizes[settings.deviceType];
    const format = settings.enableWebP && isWebPSupported() ? 'webp' : 'jpeg';
    const quality = settings.compressionQuality;
    
    let src = config.formats[format];
    
    // Add size and quality parameters
    const params = new URLSearchParams({
      w: deviceConfig.width.toString(),
      h: deviceConfig.height.toString(),
      q: quality.toString(),
      f: format
    });
    
    return `${src}?${params.toString()}`;
  }, [config, settings, isWebPSupported]);

  // Progressive loading effect
  useEffect(() => {
    if (!settings.enableProgressiveJPEG) {
      setCurrentSrc(getOptimalSrc());
      return;
    }

    const loadSequence = async () => {
      startTime.current = performance.now();
      
      // Step 1: Show placeholder
      if (settings.enablePlaceholder) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setLoadingState(prev => ({ ...prev, placeholder: false, lowQuality: true }));
      }
      
      // Step 2: Load low quality
      const lowQualitySrc = getOptimalSrc().replace(`q=${settings.compressionQuality}`, 'q=10');
      setCurrentSrc(lowQualitySrc);
      
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.src = lowQualitySrc;
      });
      
      // Step 3: Load high quality
      await new Promise(resolve => setTimeout(resolve, 200));
      setLoadingState(prev => ({ ...prev, lowQuality: false, highQuality: true }));
      setCurrentSrc(getOptimalSrc());
      
      const endTime = performance.now();
      onMetrics(config.id, {
        loadTime: endTime - startTime.current,
        format: settings.enableWebP && isWebPSupported() ? 'webp' : 'jpeg'
      });
    };

    loadSequence();
  }, [config.id, settings, getOptimalSrc, onMetrics, isWebPSupported]);

  const deviceConfig = config.sizes[settings.deviceType];

  return (
    <div className="relative group overflow-hidden rounded-lg bg-gray-100">
      {/* Placeholder */}
      {settings.enablePlaceholder && loadingState.placeholder && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center"
          style={{ aspectRatio: `${deviceConfig.width}/${deviceConfig.height}` }}
        >
          <div className="text-center">
            <FileImage className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <div className="text-sm text-gray-500">Loading...</div>
          </div>
        </div>
      )}

      {/* Low quality blur */}
      {settings.enableProgressiveJPEG && loadingState.lowQuality && (
        <div className="absolute inset-0">
          <img
            src={currentSrc}
            alt={config.alt}
            className="w-full h-full object-cover filter blur-sm opacity-50 transition-opacity duration-300"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-white" />
          </div>
        </div>
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={config.alt}
        loading={settings.enableLazyLoading ? 'lazy' : 'eager'}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loadingState.highQuality || !settings.enableProgressiveJPEG ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ aspectRatio: `${deviceConfig.width}/${deviceConfig.height}` }}
        onLoad={() => {
          if (!settings.enableProgressiveJPEG) {
            const endTime = performance.now();
            onMetrics(config.id, {
              loadTime: endTime - startTime.current,
              format: settings.enableWebP && isWebPSupported() ? 'webp' : 'jpeg'
            });
          }
        }}
      />

      {/* Overlay info */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {deviceConfig.width}×{deviceConfig.height}
        </div>
      </div>

      {/* Format badge */}
      <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className={`px-2 py-1 text-xs rounded font-medium ${
          settings.enableWebP && isWebPSupported() 
            ? 'bg-green-500 text-white' 
            : 'bg-blue-500 text-white'
        }`}>
          {settings.enableWebP && isWebPSupported() ? 'WebP' : 'JPEG'}
        </div>
      </div>
    </div>
  );
};

const ImageOptimization: React.FC = () => {
  const [settings, setSettings] = useState<OptimizationSettings>({
    enableWebP: true,
    enableProgressiveJPEG: true,
    enableResponsive: true,
    enableLazyLoading: true,
    compressionQuality: 80,
    enablePlaceholder: true,
    deviceType: 'desktop',
    viewMode: 'grid',
    showMetrics: true
  });

  const [metrics, setMetrics] = useState<{ [key: string]: ImageMetrics }>({});

  // Sample image configurations
  const imageConfigs: ImageConfig[] = useMemo(() => [
    {
      id: 'landscape-1',
      title: 'Mountain Landscape',
      description: 'Beautiful mountain scenery with dynamic lighting',
      originalSrc: 'https://picsum.photos/id/1/1200/800',
      formats: {
        webp: 'https://picsum.photos/id/1/1200/800',
        jpeg: 'https://picsum.photos/id/1/1200/800'
      },
      sizes: {
        mobile: { width: 320, height: 240, quality: 60 },
        tablet: { width: 768, height: 512, quality: 70 },
        desktop: { width: 1200, height: 800, quality: 80 }
      },
      alt: 'Mountain landscape with snow-capped peaks',
      category: 'landscape'
    },
    {
      id: 'portrait-1',
      title: 'Urban Portrait',
      description: 'Professional headshot with urban background',
      originalSrc: 'https://picsum.photos/id/91/600/800',
      formats: {
        webp: 'https://picsum.photos/id/91/600/800',
        jpeg: 'https://picsum.photos/id/91/600/800'
      },
      sizes: {
        mobile: { width: 240, height: 320, quality: 65 },
        tablet: { width: 450, height: 600, quality: 75 },
        desktop: { width: 600, height: 800, quality: 85 }
      },
      alt: 'Professional portrait in urban setting',
      category: 'portrait'
    },
    {
      id: 'square-1',
      title: 'Architectural Detail',
      description: 'Modern building facade with geometric patterns',
      originalSrc: 'https://picsum.photos/id/28/600/600',
      formats: {
        webp: 'https://picsum.photos/id/28/600/600',
        jpeg: 'https://picsum.photos/id/28/600/600'
      },
      sizes: {
        mobile: { width: 280, height: 280, quality: 60 },
        tablet: { width: 400, height: 400, quality: 70 },
        desktop: { width: 600, height: 600, quality: 80 }
      },
      alt: 'Modern architectural detail',
      category: 'square'
    },
    {
      id: 'banner-1',
      title: 'Ocean Panorama',
      description: 'Wide ocean view with dramatic sky',
      originalSrc: 'https://picsum.photos/id/75/1400/400',
      formats: {
        webp: 'https://picsum.photos/id/75/1400/400',
        jpeg: 'https://picsum.photos/id/75/1400/400'
      },
      sizes: {
        mobile: { width: 360, height: 120, quality: 60 },
        tablet: { width: 800, height: 240, quality: 70 },
        desktop: { width: 1400, height: 400, quality: 80 }
      },
      alt: 'Ocean panorama with dramatic sky',
      category: 'banner'
    },
    {
      id: 'landscape-2',
      title: 'Forest Path',
      description: 'Serene forest trail with filtered sunlight',
      originalSrc: 'https://picsum.photos/id/18/1200/800',
      formats: {
        webp: 'https://picsum.photos/id/18/1200/800',
        jpeg: 'https://picsum.photos/id/18/1200/800'
      },
      sizes: {
        mobile: { width: 320, height: 240, quality: 60 },
        tablet: { width: 768, height: 512, quality: 70 },
        desktop: { width: 1200, height: 800, quality: 80 }
      },
      alt: 'Forest path with filtered sunlight',
      category: 'landscape'
    },
    {
      id: 'portrait-2',
      title: 'Creative Portrait',
      description: 'Artistic portrait with dramatic lighting',
      originalSrc: 'https://picsum.photos/id/177/600/800',
      formats: {
        webp: 'https://picsum.photos/id/177/600/800',
        jpeg: 'https://picsum.photos/id/177/600/800'
      },
      sizes: {
        mobile: { width: 240, height: 320, quality: 65 },
        tablet: { width: 450, height: 600, quality: 75 },
        desktop: { width: 600, height: 800, quality: 85 }
      },
      alt: 'Creative portrait with dramatic lighting',
      category: 'portrait'
    }
  ], []);

  // Handle metrics update
  const handleMetricsUpdate = useCallback((id: string, newMetrics: Partial<ImageMetrics>) => {
    try {
      setMetrics(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          ...newMetrics,
          originalSize: 250000, // Simulated
          optimizedSize: Math.round(250000 * (settings.compressionQuality / 100)),
          compression: 100 - settings.compressionQuality,
          isWebPSupported: typeof window !== 'undefined' && 'createImageBitmap' in window
        }
      }));
    } catch (error) {
      console.error('Error updating metrics:', error);
    }
  }, [settings.compressionQuality]);

  // Calculate total metrics
  const totalMetrics = useMemo(() => {
    const allMetrics = Object.values(metrics);
    return {
      totalImages: imageConfigs.length,
      loadedImages: allMetrics.length,
      averageLoadTime: allMetrics.length > 0 
        ? allMetrics.reduce((sum, m) => sum + (m.loadTime || 0), 0) / allMetrics.length 
        : 0,
      totalSavings: allMetrics.reduce((sum, m) => sum + (m.originalSize - m.optimizedSize), 0),
      webpUsage: allMetrics.filter(m => m.format === 'webp').length
    };
  }, [metrics, imageConfigs.length]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FileImage className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Image Optimization</h1>
                <p className="text-gray-600">Advanced image optimization with responsive formats and progressive loading</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSettings(prev => ({ ...prev, showMetrics: !prev.showMetrics }))}
                className={`p-2 rounded-lg transition-colors ${
                  settings.showMetrics ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                }`}
                title="Toggle metrics"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => window.location.reload()}
                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                title="Reload images"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Device Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Device Type</label>
              <div className="flex space-x-1">
                {[
                  { value: 'mobile', icon: Smartphone, label: 'Mobile' },
                  { value: 'tablet', icon: Tablet, label: 'Tablet' },
                  { value: 'desktop', icon: Monitor, label: 'Desktop' }
                ].map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => setSettings(prev => ({ ...prev, deviceType: value as any }))}
                    className={`flex-1 p-2 rounded-lg border transition-colors ${
                      settings.deviceType === value
                        ? 'border-purple-500 bg-purple-50 text-purple-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    title={label}
                  >
                    <Icon className="w-4 h-4 mx-auto" />
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
              <select
                value={settings.viewMode}
                onChange={(e) => setSettings(prev => ({ ...prev, viewMode: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="grid">Grid View</option>
                <option value="list">List View</option>
                <option value="comparison">Comparison View</option>
              </select>
            </div>

            {/* Quality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quality: {settings.compressionQuality}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={settings.compressionQuality}
                onChange={(e) => setSettings(prev => ({ ...prev, compressionQuality: Number(e.target.value) }))}
                className="w-full"
              />
            </div>

            {/* Options */}
            <div className="space-y-2">
              {[
                { key: 'enableWebP', label: 'WebP Format' },
                { key: 'enableProgressiveJPEG', label: 'Progressive Loading' },
                { key: 'enableLazyLoading', label: 'Lazy Loading' },
                { key: 'enablePlaceholder', label: 'Placeholders' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={settings[key as keyof OptimizationSettings] as boolean}
                    onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="mr-2"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Metrics Panel */}
          {settings.showMetrics && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Optimization Metrics
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileImage className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-600">Images Loaded</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {totalMetrics.loadedImages}/{totalMetrics.totalImages}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-600">Avg Load Time</span>
                    </div>
                    <span className="font-semibold text-gray-900">{totalMetrics.averageLoadTime.toFixed(0)}ms</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">WebP Usage</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {totalMetrics.totalImages > 0 ? Math.round((totalMetrics.webpUsage / totalMetrics.totalImages) * 100) : 0}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Download className="w-4 h-4 text-purple-500 mr-2" />
                      <span className="text-sm text-gray-600">Data Saved</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {Math.round(totalMetrics.totalSavings / 1024)}KB
                    </span>
                  </div>
                </div>

                {/* Optimization status */}
                <div className="mt-6 pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">WebP Support</span>
                      {typeof window !== 'undefined' && 'createImageBitmap' in window ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Lazy Loading</span>
                      {settings.enableLazyLoading ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Responsive Images</span>
                      {settings.enableResponsive ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Current Settings
                </h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Device</span>
                    <span className="font-medium capitalize">{settings.deviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quality</span>
                    <span className="font-medium">{settings.compressionQuality}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Format</span>
                    <span className="font-medium">{settings.enableWebP ? 'WebP/JPEG' : 'JPEG'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loading</span>
                    <span className="font-medium">{settings.enableLazyLoading ? 'Lazy' : 'Eager'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Images Gallery */}
          <div className={settings.showMetrics ? "lg:col-span-3" : "lg:col-span-4"}>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Optimized Image Gallery</h3>
                <div className="text-sm text-gray-500">
                  {settings.deviceType} • {settings.compressionQuality}% quality
                </div>
              </div>

              {/* Grid View */}
              {settings.viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {imageConfigs.map((config) => (
                    <div key={config.id} className="group">
                      <ProgressiveImage
                        config={config}
                        settings={settings}
                        onMetrics={handleMetricsUpdate}
                      />
                      <div className="mt-3">
                        <h4 className="font-semibold text-gray-900">{config.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{config.description}</p>
                        {metrics[config.id] && (
                          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                            <span>{metrics[config.id].loadTime?.toFixed(0)}ms</span>
                            <span>{Math.round(metrics[config.id].optimizedSize / 1024)}KB</span>
                            <span className="capitalize">{metrics[config.id].format}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* List View */}
              {settings.viewMode === 'list' && (
                <div className="space-y-4">
                  {imageConfigs.map((config) => (
                    <div key={config.id} className="flex space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex-shrink-0 w-32">
                        <ProgressiveImage
                          config={config}
                          settings={settings}
                          onMetrics={handleMetricsUpdate}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{config.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{config.description}</p>
                        {metrics[config.id] && (
                          <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Load Time:</span>
                              <span className="ml-2 font-medium">{metrics[config.id].loadTime?.toFixed(0)}ms</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Size:</span>
                              <span className="ml-2 font-medium">{Math.round(metrics[config.id].optimizedSize / 1024)}KB</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Format:</span>
                              <span className="ml-2 font-medium capitalize">{metrics[config.id].format}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Compression:</span>
                              <span className="ml-2 font-medium">{metrics[config.id].compression}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comparison View */}
              {settings.viewMode === 'comparison' && (
                <div className="space-y-8">
                  {imageConfigs.slice(0, 2).map((config) => (
                    <div key={config.id} className="border border-gray-200 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">{config.title}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Original */}
                        <div>
                          <div className="mb-3">
                            <h5 className="font-medium text-gray-700">Original</h5>
                            <p className="text-sm text-gray-500">Full quality JPEG</p>
                          </div>
                          <img
                            src={config.originalSrc}
                            alt={config.alt}
                            className="w-full rounded-lg"
                            style={{ aspectRatio: `${config.sizes.desktop.width}/${config.sizes.desktop.height}` }}
                          />
                          <div className="mt-2 text-sm text-gray-600">
                            ~250KB • 100% quality
                          </div>
                        </div>

                        {/* Optimized */}
                        <div>
                          <div className="mb-3">
                            <h5 className="font-medium text-gray-700">Optimized</h5>
                            <p className="text-sm text-gray-500">
                              {settings.enableWebP ? 'WebP' : 'JPEG'} • {settings.compressionQuality}% quality
                            </p>
                          </div>
                          <ProgressiveImage
                            config={config}
                            settings={settings}
                            onMetrics={handleMetricsUpdate}
                          />
                          {metrics[config.id] && (
                            <div className="mt-2 text-sm text-gray-600">
                              ~{Math.round(metrics[config.id].optimizedSize / 1024)}KB • 
                              {Math.round(((metrics[config.id].originalSize - metrics[config.id].optimizedSize) / metrics[config.id].originalSize) * 100)}% smaller
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageOptimization; 