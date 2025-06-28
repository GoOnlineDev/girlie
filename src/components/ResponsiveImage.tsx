import { useState, useRef, useEffect, useCallback } from 'react';

interface ResponsiveImageProps {
  src: string | null;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'wide' | 'tall' | 'auto';
  sizes?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  onError?: () => void;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  hover?: boolean;
  overlayEffect?: 'none' | 'fade' | 'scale' | 'both';
}

const aspectRatioClasses = {
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  wide: 'aspect-[16/9]',
  tall: 'aspect-[2/3]',
  auto: ''
};

const sizeClasses = {
  xs: 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16',
  sm: 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24',
  md: 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32',
  lg: 'w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48',
  xl: 'w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64',
  full: 'w-full h-full'
};

const hoverEffects = {
  none: '',
  fade: 'group-hover:opacity-90',
  scale: 'group-hover:scale-105',
  both: 'group-hover:opacity-90 group-hover:scale-105'
};

export function ResponsiveImage({
  src,
  alt,
  className = '',
  aspectRatio = 'square',
  sizes = 'full',
  priority = false,
  placeholder = 'blur',
  onLoad,
  onError,
  objectFit = 'cover',
  hover = false,
  overlayEffect = 'none'
}: ResponsiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Enhanced Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '100px 0px', // Start loading when image is 100px away
        threshold: 0.1
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setImageLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  // Generate responsive sizes attribute based on component size
  const generateSizes = () => {
    if (sizes === 'full') {
      return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw';
    }
    
    const sizeMap = {
      xs: '(max-width: 640px) 64px, (max-width: 768px) 80px, 96px',
      sm: '(max-width: 640px) 80px, (max-width: 768px) 96px, 112px',
      md: '(max-width: 640px) 96px, (max-width: 768px) 112px, (max-width: 1024px) 128px, 144px',
      lg: '(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 192px, 224px',
      xl: '(max-width: 640px) 160px, (max-width: 768px) 224px, (max-width: 1024px) 256px, 288px'
    };
    
    return sizeMap[sizes];
  };

  const containerClasses = `
    ${aspectRatio !== 'auto' ? aspectRatioClasses[aspectRatio] : ''}
    ${sizes !== 'full' ? sizeClasses[sizes] : ''}
    ${className}
    relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200
    ${hover ? 'group cursor-pointer' : ''}
  `.trim().replace(/\s+/g, ' ');

  const imageClasses = `
    w-full h-full object-${objectFit}
    transition-all duration-500 ease-out
    ${isLoading ? 'scale-110 blur-sm opacity-0' : 'scale-100 blur-0 opacity-100'}
    ${hasError ? 'opacity-0' : ''}
    ${imageLoaded ? hoverEffects[overlayEffect] : ''}
  `.trim().replace(/\s+/g, ' ');

  const PlaceholderIcon = () => (
    <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="text-center space-y-2">
        <svg 
          className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 mx-auto opacity-50" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
            clipRule="evenodd" 
          />
        </svg>
        {hasError && (
          <p className="text-xs text-gray-500 px-2">
            Failed to load
          </p>
        )}
      </div>
    </div>
  );

  const LoadingSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="relative">
        <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border-3 border-transparent border-t-pink-400 rounded-full animate-spin animation-delay-150"></div>
      </div>
    </div>
  );

  const BlurPlaceholder = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/10"></div>
    </div>
  );

  return (
    <div ref={containerRef} className={containerClasses}>
      {/* Loading state */}
      {isLoading && !hasError && (
        <>
          {placeholder === 'blur' ? <BlurPlaceholder /> : null}
          <LoadingSpinner />
        </>
      )}
      
      {/* Error state */}
      {hasError && <PlaceholderIcon />}
      
      {/* Image */}
      {src && isInView && !hasError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={imageClasses}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          sizes={generateSizes()}
        />
      )}
      
      {/* Placeholder when no src */}
      {!src && <PlaceholderIcon />}
      
      {/* Hover overlay effects */}
      {hover && imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
      
      {/* Shimmer effect during loading */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>
      )}
    </div>
  );
}

// Enhanced hook for responsive image dimensions with device pixel ratio consideration
export function useResponsiveImageSize() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const dpr = window.devicePixelRatio || 1;
      
      let baseWidth, baseHeight;
      
      // Mobile (1 column)
      if (width < 640) {
        baseWidth = width - 32; // Account for padding
        baseHeight = baseWidth;
      }
      // Tablet (2-3 columns)
      else if (width < 1024) {
        baseWidth = (width - 64) / 2; // 2 columns with gap
        baseHeight = baseWidth;
      }
      // Desktop (3-4 columns)
      else if (width < 1280) {
        baseWidth = (width - 96) / 3; // 3 columns with gap
        baseHeight = baseWidth;
      }
      // Large desktop (4+ columns)
      else {
        baseWidth = (width - 128) / 4; // 4 columns with gap
        baseHeight = baseWidth;
      }
      
      // Apply device pixel ratio for high-DPI displays
      setDimensions({ 
        width: Math.round(baseWidth * dpr), 
        height: Math.round(baseHeight * dpr) 
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return dimensions;
}

// Utility function for generating responsive image URLs (if using a CDN)
export function generateResponsiveImageUrl(baseUrl: string, width: number, height: number): string {
  // This would be customized based on your image CDN
  // Example for services like Cloudinary, ImageKit, etc.
  if (!baseUrl) return '';
  
  // Simple example - you'd adapt this to your image service
  const hasParams = baseUrl.includes('?');
  const separator = hasParams ? '&' : '?';
  
  return `${baseUrl}${separator}w=${width}&h=${height}&fit=cover&auto=format,compress&q=85`;
} 