import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Phone, Leaf, ShoppingCart, Scale } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { Link, useLocation } from 'react-router-dom';
import { GlobalSearch } from './GlobalSearch';
import { LicenseStatus as LicenseStatusWidget } from './LicenseStatus';
import { useCartStore } from '../store/cartStore';
import { LicenseStatus, UserRole } from '../types';
import { useCompareStore } from '../store/compareStore';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const setIsCartOpen = useCartStore((state) => state.setIsOpen);
  const items = useCartStore((state) => state.items);
  const compareList = useCompareStore((state) => state.compareList);
  const { daysRemaining, status } = useUser();
  const { isAuthenticated, user, logout, role } = useAuth();
  const isAdmin = role === UserRole.Admin;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path ? 'text-emerald-700 font-semibold' : 'text-slate-600 hover:text-emerald-700';

  const isExpired = status === LicenseStatus.Expired || status === LicenseStatus.Suspended;

  return (
    <nav 
      aria-label="Main navigation"
      className={`w-full sticky top-0 z-50 transition-all duration-300 border-b border-emerald-100/50 ${
        scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-white'
      }`}
    >
      {/* Top Bar */}
      <div className="bg-emerald-950 text-emerald-50 text-xs py-1.5 px-4 md:px-8 flex justify-between items-center h-8">
        <span className="font-medium tracking-wide">ADMIN PORTAL – VITALOGISTICS MANAGEMENT</span>
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-emerald-400" />
          <span>Support: (651) 363-1358</span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="px-6 md:px-8 flex items-center justify-between h-[72px]">
        <div className="flex items-center h-full">
          <Link to="/" className="flex items-center gap-2 pr-4 sm:pr-8 border-r border-slate-200 h-10 group">
            <div className="w-9 h-9 bg-emerald-900 rounded-lg flex items-center justify-center text-white shrink-0 group-hover:bg-emerald-800 transition-colors">
              <Leaf size={20} className="group-hover:rotate-6 transition-transform" />
            </div>
            <span className="font-bold text-xl text-emerald-950 tracking-tight hidden sm:inline">VitalLogistics</span>
          </Link>

          <div className="pl-6 h-full flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden xl:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer group">
                  Administration <ChevronDown size={16} className="group-hover:rotate-6 transition-transform" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" id="dashboard-link" className={`w-full ${isActive('/dashboard')}`}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders" className={`w-full ${isActive('/orders')}`}>Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/delivery-zones" className={`w-full ${isActive('/delivery-zones')}`}>Zones</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/retailers" className={`w-full ${isActive('/retailers')}`}>Retailers</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/brands" className={`w-full ${isActive('/brands')}`}>Brands</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/payouts" className={`w-full ${isActive('/payouts')}`}>Payouts</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/catalog" id="catalog-link" className={`w-full ${isActive('/catalog')}`}>Products</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="hidden md:flex flex-1 justify-center px-8 border-r border-slate-200 h-10 items-center">
            <GlobalSearch />
        </div>

        <div className="flex items-center gap-2 sm:gap-4 pl-4 h-full">
          <div className="hidden sm:block">
            <LicenseStatusWidget />
          </div>
          
          {compareList.length > 0 && (
            <Link to="/compare" id="compare-button">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 group"
                aria-label="Compare products"
              >
                <Scale size={20} className="group-hover:rotate-6 transition-transform" aria-hidden="true" />
                <span className="absolute top-0 right-0 h-4 w-4 bg-blue-600 text-white text-[10px] flex items-center justify-center rounded-full font-bold shadow-sm ring-1 ring-white">
                  {compareList.length}
                </span>
                <span className="sr-only">{compareList.length} products in comparison</span>
              </Button>
            </Link>
          )}

          <Button 
            id="cart-button"
            variant="ghost" 
            size="icon" 
            className="relative text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 group" 
            onClick={() => setIsCartOpen(true)}
            aria-label="View shopping cart"
          >
             <ShoppingCart size={20} className="group-hover:rotate-6 transition-transform" aria-hidden="true" />
             {items.length > 0 && (
                 <>
                   <span className="absolute top-0 right-0 h-4 w-4 bg-emerald-600 text-white text-[10px] flex items-center justify-center rounded-full font-bold shadow-sm ring-1 ring-white">
                     {items.length}
                   </span>
                   <span className="sr-only">{items.length} items in cart</span>
                 </>
             )}
          </Button>

          <div className="hidden sm:block">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full group">
                    <ChevronDown size={16} className="text-slate-500 group-hover:rotate-6 transition-transform" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-800 text-sm truncate max-w-[180px]">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate max-w-[180px]">{user.email}</p>
                  </div>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => logout()}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to={ROUTES.LOGIN}>
                <Button variant="outline" size="sm" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                  Log in
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="xl:hidden p-2 ml-2 text-slate-600 hover:text-emerald-700 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="xl:hidden border-t border-slate-100 bg-white px-4 py-4 flex flex-col gap-4 shadow-lg absolute w-full left-0 top-[104px]">
           <nav className="flex flex-col gap-4 text-sm font-medium" aria-label="Mobile navigation">
            <Link to="/dashboard" className="text-slate-600 hover:text-emerald-700">Dashboard</Link>
            <Link to="/orders" className="text-slate-600 hover:text-emerald-700">Orders</Link>
            <Link to="/delivery-zones" className="text-slate-600 hover:text-emerald-700">Zones</Link>
            {isAdmin && (
              <>
                <Link to="/retailers" className="text-slate-600 hover:text-emerald-700">Retailers</Link>
                <Link to="/brands" className="text-slate-600 hover:text-emerald-700">Brands</Link>
                <Link to="/payouts" className="text-slate-600 hover:text-emerald-700">Payouts</Link>
              </>
            )}
            <Link to="/catalog" className="text-slate-600 hover:text-emerald-700">Products</Link>
           </nav>
          <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
             <Button variant="outline" className="w-full justify-start gap-2" onClick={() => { setIsCartOpen(true); setIsOpen(false); }}>
                 <ShoppingCart className="w-4 h-4" />
                 View Cart ({items.length})
             </Button>
             {isAuthenticated && user ? (
               <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div>
                        <span className="font-semibold text-slate-800 block">{user.name}</span>
                        <span className={`text-xs font-medium ${isExpired ? 'text-red-600' : daysRemaining < 30 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {isExpired ? 'License Expired' : `Expires in ${daysRemaining} days`}
                        </span>
                    </div>
                    <Badge className={`${isExpired ? 'bg-red-600 animate-pulse' : 'bg-emerald-600'} text-white border-transparent shadow-md rounded-full px-4 py-1.5 font-bold text-[11px] uppercase tracking-wider`}>
                        {isExpired ? 'Suspended' : 'Approved ✓'}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600 w-full justify-start" onClick={() => { logout(); setIsOpen(false); }}>
                    Logout
                  </Button>
               </div>
             ) : (
               <Link to={ROUTES.LOGIN} onClick={() => setIsOpen(false)}>
                 <Button variant="outline" className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                   Log in
                 </Button>
               </Link>
             )}
          </div>
        </div>
      )}
    </nav>
  );
}