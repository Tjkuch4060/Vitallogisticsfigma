import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { X, Monitor } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Eager-loaded components (needed immediately)
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { QuickActions } from './components/QuickActions';
import { Toaster } from './components/ui/sonner';
import { useCartStore } from './store/cartStore';
import { LicenseStatus } from './types';
import { CartSheet } from './components/cart/CartSheet';
import { UserProvider, useUser } from './context/UserContext';
import { AuthProvider } from './context/AuthContext';
import { LicenseAlert } from './components/LicenseAlert';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OnboardingTour } from './components/OnboardingTour';
import { PageLoadingSpinner } from './components/ui/PageLoadingSpinner';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserRole } from './types';

// Lazy-loaded pages (loaded on demand)
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const Catalog = lazy(() => import('./pages/Catalog').then(m => ({ default: m.Catalog })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Orders = lazy(() => import('./pages/Orders').then(m => ({ default: m.Orders })));
const OrderDetail = lazy(() => import('./pages/OrderDetail').then(m => ({ default: m.OrderDetail })));
const Checkout = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const DeliveryZones = lazy(() => import('./pages/DeliveryZones').then(m => ({ default: m.DeliveryZones })));
const CompareProducts = lazy(() => import('./pages/CompareProducts').then(m => ({ default: m.CompareProducts })));
const SuspensionScreen = lazy(() => import('./pages/SuspensionScreen').then(m => ({ default: m.SuspensionScreen })));

function LayoutContent() {
  const [showBanner, setShowBanner] = useState(true);
  const location = useLocation();
  const { status } = useUser();
  const setIsCartOpen = useCartStore((state) => state.setIsOpen);

  // Hide footer on dashboard to feel more like an app
  const showFooter = location.pathname === '/';

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close modals
      if (e.key === 'Escape') {
        setIsCartOpen(false);
        // Note: ProductQuickView close is handled within its component
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsCartOpen]);

  // Suspension Guard
  // Block critical ordering paths: Checkout
  // Note: Catalog is allowed but "Add to Cart" should be disabled (handled in component or just let them add but block checkout)
  // Let's block Checkout explicitly.
  const isBlockedPath = location.pathname === '/checkout';

  if (status === LicenseStatus.Suspended && isBlockedPath) {
      return (
        <div className="min-h-screen font-sans text-slate-700 selection:bg-emerald-100 selection:text-emerald-900">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-emerald-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Skip to main content
            </a>
            <Navbar />
            <LicenseAlert />
            <main id="main-content" role="main" aria-label="Main content" className="min-h-[calc(100vh-200px)]">
                <SuspensionScreen />
            </main>
            <Toaster />
            {showFooter && <Footer />}
        </div>
      )
  }

  return (
    <div className="min-h-screen font-sans text-slate-700 selection:bg-emerald-100 selection:text-emerald-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-emerald-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <Navbar />
      <LicenseAlert />
      <main id="main-content" role="main" aria-label="Main content" className="min-h-[calc(100vh-200px)]">
        <Outlet />
      </main>
      <QuickActions />
      <CartSheet />
      <OnboardingTour />
      <Toaster />
      {showFooter && <Footer />}

      {/* Preview Mode Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 w-full bg-orange-50 border-t border-orange-100 p-3 z-50 flex items-center justify-center gap-4 shadow-lg-up">
           <div className="flex items-center gap-2 text-sm text-orange-900/80">
              <span className="bg-orange-200/50 px-2 py-0.5 rounded text-orange-800 font-semibold flex items-center gap-1.5 border border-orange-200">
                <Monitor className="w-3.5 h-3.5" />
                Preview mode
              </span>
              <span className="hidden sm:inline">This page is not live and cannot be shared directly. Please publish to get a public link.</span>
              <span className="sm:hidden">Preview Mode Only</span>
           </div>
           <button 
             onClick={() => setShowBanner(false)}
             className="text-orange-800/60 hover:text-orange-900 transition-colors"
             aria-label="Close preview mode banner"
           >
             <X className="w-4 h-4" aria-hidden="true" />
           </button>
        </div>
      )}
    </div>
  );
}

const sharedRoles = [UserRole.Admin, UserRole.Customer];
const adminOnlyRoles = [UserRole.Admin];

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AuthProvider>
        <UserProvider>
          <Router>
            <Suspense fallback={<PageLoadingSpinner />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<LayoutContent />}>
                  <Route index element={<ErrorBoundary><LandingPage /></ErrorBoundary>} />
                  <Route path="catalog" element={<ErrorBoundary><ProtectedRoute allowedRoles={sharedRoles}><Catalog /></ProtectedRoute></ErrorBoundary>} />
                  <Route path="dashboard" element={<ErrorBoundary><ProtectedRoute allowedRoles={sharedRoles}><Dashboard /></ProtectedRoute></ErrorBoundary>} />
                  <Route path="orders" element={<ErrorBoundary><ProtectedRoute allowedRoles={sharedRoles}><Orders /></ProtectedRoute></ErrorBoundary>} />
                  <Route path="orders/:orderId" element={<ErrorBoundary><ProtectedRoute allowedRoles={sharedRoles}><OrderDetail /></ProtectedRoute></ErrorBoundary>} />
                  <Route path="checkout" element={<ErrorBoundary><ProtectedRoute allowedRoles={sharedRoles}><Checkout /></ProtectedRoute></ErrorBoundary>} />
                  <Route path="delivery-zones" element={<ErrorBoundary><ProtectedRoute allowedRoles={sharedRoles}><DeliveryZones /></ProtectedRoute></ErrorBoundary>} />
                  <Route path="compare" element={<ErrorBoundary><ProtectedRoute allowedRoles={sharedRoles}><CompareProducts /></ProtectedRoute></ErrorBoundary>} />
                  <Route path="retailers" element={<ErrorBoundary><ProtectedRoute allowedRoles={adminOnlyRoles}><Dashboard /></ProtectedRoute></ErrorBoundary>} />
                  <Route path="brands" element={<ErrorBoundary><ProtectedRoute allowedRoles={adminOnlyRoles}><Dashboard /></ProtectedRoute></ErrorBoundary>} />
                  <Route path="payouts" element={<ErrorBoundary><ProtectedRoute allowedRoles={adminOnlyRoles}><Dashboard /></ProtectedRoute></ErrorBoundary>} />
                </Route>
              </Routes>
            </Suspense>
          </Router>
        </UserProvider>
      </AuthProvider>
    </DndProvider>
  );
}