import { useEffect } from 'react';

/**
 * Prefetch routes on link hover
 * Improves perceived performance by loading routes before navigation
 */

type RouteModule = () => Promise<any>;

const routeModules: Record<string, RouteModule> = {
  '/catalog': () => import('../pages/Catalog'),
  '/dashboard': () => import('../pages/Dashboard'),
  '/orders': () => import('../pages/Orders'),
  '/checkout': () => import('../pages/Checkout'),
  '/delivery-zones': () => import('../pages/DeliveryZones'),
};

/**
 * Prefetch a route when user hovers over a link
 * Usage: Add onMouseEnter={prefetchRoute('/catalog')} to links
 */
export function prefetchRoute(path: string) {
  return () => {
    const moduleLoader = routeModules[path];
    if (moduleLoader) {
      moduleLoader();
    }
  };
}

/**
 * Hook to automatically prefetch high-priority routes on idle
 * Prefetches catalog and dashboard after initial page load
 */
export function usePrefetchCriticalRoutes() {
  useEffect(() => {
    // Wait for page to be idle before prefetching
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Prefetch high-traffic routes
        import('../pages/Catalog');
        import('../pages/Dashboard');
      }, { timeout: 2000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        import('../pages/Catalog');
        import('../pages/Dashboard');
      }, 2000);
    }
  }, []);
}

/**
 * Preload images on hover
 */
export function preloadImage(src: string) {
  return () => {
    const img = new Image();
    img.src = src;
  };
}
