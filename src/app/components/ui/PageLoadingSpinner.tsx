import { Loader2 } from 'lucide-react';

/**
 * Page Loading Spinner
 * Shown while lazy-loaded routes are loading
 */
export function PageLoadingSpinner() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
        <p className="text-slate-600 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}

/**
 * Compact Loading Spinner
 * For smaller loading states (modals, sections)
 */
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className={`${sizeClasses[size]} text-emerald-600 animate-spin`} />
    </div>
  );
}

/**
 * Full Screen Loading Overlay
 * For blocking operations
 */
export function LoadingOverlay({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
        {message && <p className="text-slate-700 font-medium">{message}</p>}
      </div>
    </div>
  );
}
