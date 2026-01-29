import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { QuickActions } from './components/QuickActions';
import { Toaster } from './components/ui/sonner';
import { X, Monitor } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Catalog } from './pages/Catalog';
import { Dashboard } from './pages/Dashboard';
import { Orders } from './pages/Orders';
import { OrderDetail } from './pages/OrderDetail';
import { useCartStore } from './store/cartStore';
import { CartSheet } from './components/cart/CartSheet';
import { Checkout } from './pages/Checkout';
import { DeliveryZones } from './pages/DeliveryZones';
import { CompareProducts } from './pages/CompareProducts';
import { UserProvider, useUser } from './context/UserContext';
import { LicenseAlert } from './components/LicenseAlert';
import { SuspensionScreen } from './pages/SuspensionScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OnboardingTour } from './components/OnboardingTour';

function LayoutContent({ children }: { children: React.ReactNode }) {
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

  if (status === 'Suspended' && isBlockedPath) {
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
        {children}
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

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <UserProvider>
        <Router>
          <LayoutContent>
            <Routes>
              <Route path="/" element={<ErrorBoundary><LandingPage /></ErrorBoundary>} />
              <Route path="/login" element={<ErrorBoundary><Login /></ErrorBoundary>} />
              <Route path="/catalog" element={<ErrorBoundary><Catalog /></ErrorBoundary>} />
              <Route path="/dashboard" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
              <Route path="/orders" element={<ErrorBoundary><Orders /></ErrorBoundary>} />
              <Route path="/orders/:orderId" element={<ErrorBoundary><OrderDetail /></ErrorBoundary>} />
              <Route path="/checkout" element={<ErrorBoundary><Checkout /></ErrorBoundary>} />
              <Route path="/delivery-zones" element={<ErrorBoundary><DeliveryZones /></ErrorBoundary>} />
              <Route path="/compare" element={<ErrorBoundary><CompareProducts /></ErrorBoundary>} />
              {/* Fallback routes for demo purposes */}
              <Route path="/retailers" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
              <Route path="/brands" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
              <Route path="/payouts" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
            </Routes>
          </LayoutContent>
        </Router>
      </UserProvider>
    </DndProvider>
  );
}