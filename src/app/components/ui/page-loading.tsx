import { Card, CardContent, CardFooter, CardHeader } from './card';
import { Skeleton } from './skeleton';

export function PageLoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center" role="status" aria-live="polite">
      <div className="text-center">
        <div 
          className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"
          aria-hidden="true"
        />
        <p className="text-slate-600">Loading...</p>
        <span className="sr-only">Loading content, please wait</span>
      </div>
    </div>
  );
}

// Better skeleton for cards
export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden" aria-label="Loading product card">
      <Skeleton className="aspect-square" />
      <CardHeader className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
