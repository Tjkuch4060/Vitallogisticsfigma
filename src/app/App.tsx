import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { QuickActions } from './components/QuickActions';
import { Toaster } from './components/ui/sonner';
import { X, Monitor } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LandingPage } from './pages/LandingPage';
import { Catalog } from './pages/Catalog';
import { Dashboard } from './pages/Dashboard';
import { Orders } from './pages/Orders';
import { OrderDetail } from './pages/OrderDetail';
import { CartProvider } from './context/CartContext';
import { CartSheet } from './components/cart/CartSheet';
import { Checkout } from './pages/Checkout';
import { DeliveryZones } from './pages/DeliveryZones';
import { UserProvider, useUser } from './context/UserContext';
import { LicenseAlert } from './components/LicenseAlert';
import { SuspensionScreen } from './pages/SuspensionScreen';

function Layout({ children }: { children: React.ReactNode }) {
  const [showBanner, setShowBanner] = useState(true);
  const location = useLocation();
  const { status } = useUser();

  // Hide footer on dashboard to feel more like an app
  const showFooter = location.pathname === '/';

  // Suspension Guard
  // Block critical ordering paths: Checkout
  // Note: Catalog is allowed but "Add to Cart" should be disabled (handled in component or just let them add but block checkout)
  // Let's block Checkout explicitly.
  const isBlockedPath = location.pathname === '/checkout';

  if (status === 'Suspended' && isBlockedPath) {
      return (
        <div className="min-h-screen font-sans text-slate-700 selection:bg-emerald-100 selection:text-emerald-900">
            <Navbar />
            <LicenseAlert />
            <main className="min-h-[calc(100vh-200px)]">
                <SuspensionScreen />
            </main>
            <Toaster />
            {showFooter && <Footer />}
        </div>
      )
  }

  return (
    <div className="min-h-screen font-sans text-slate-700 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      <LicenseAlert />
      <main className="min-h-[calc(100vh-200px)]">
        {children}
      </main>
      <QuickActions />
      <CartSheet />
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
           >
             <X className="w-4 h-4" />
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
        <CartProvider>
            <Router>
            <Layout>
                <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:orderId" element={<OrderDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/delivery-zones" element={<DeliveryZones />} />
                {/* Fallback routes for demo purposes */}
                <Route path="/retailers" element={<Dashboard />} />
                <Route path="/brands" element={<Dashboard />} />
                <Route path="/payouts" element={<Dashboard />} />
                </Routes>
            </Layout>
            </Router>
        </CartProvider>
      </UserProvider>
    </DndProvider>
  );
}