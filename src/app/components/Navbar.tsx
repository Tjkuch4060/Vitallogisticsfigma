import React, { useState, useEffect } from 'react';
import { Menu, X, User, ChevronDown, Phone, Gauge, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { Link, useLocation } from 'react-router';
import { GlobalSearch } from './GlobalSearch';
import { LicenseStatus } from './LicenseStatus';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { setIsOpen: setIsCartOpen, items } = useCart();
  const { daysRemaining, status, role, businessName, switchRole } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path ? 'text-emerald-700 font-semibold' : 'text-slate-600 hover:text-emerald-700';

  const isExpired = status === 'Expired' || status === 'Suspended';

  // Admin Navigation Links
  const adminLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/orders', label: 'Orders' },
    { path: '/delivery-zones', label: 'Zones' },
    { path: '/retailers', label: 'Retailers' },
    { path: '/catalog', label: 'Products' },
    { path: '/brands', label: 'Brands' },
    { path: '/payouts', label: 'Payouts' },
  ];

  // Retailer Navigation Links
  const retailerLinks = [
    { path: '/catalog', label: 'Browse Products' },
    { path: '/orders', label: 'My Orders' },
  ];

  const navLinks = role === 'Admin' ? adminLinks : retailerLinks;

  return (
    <div className={`w-full sticky top-0 z-50 transition-all duration-300 border-b border-emerald-100/50 ${
      scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-white'
    }`}>
      {/* Top Bar */}
      <div className="bg-emerald-950 text-emerald-50 text-xs py-1.5 px-4 md:px-8 flex justify-between items-center h-8">
        <span className="font-medium tracking-wide">
          {role === 'Admin' ? 'ADMIN PORTAL – LOW DOSE LOGISTICS MANAGEMENT' : 'B2B WHOLESALE PORTAL – LOW DOSE LOGISTICS'}
        </span>
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-emerald-400" />
          <span>Support: (651) 363-1358</span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="px-6 md:px-8 flex items-center justify-between h-[72px]">
        <div className="flex items-center h-full">
          <Link to="/" className="flex items-center gap-2 pr-4 sm:pr-8 border-r border-slate-200 h-10 group">
            <div className="w-9 h-9 bg-emerald-900 rounded-lg flex items-center justify-center text-white shrink-0 group-hover:bg-emerald-800 transition-all duration-300 shadow-sm">
              <Gauge size={18} className="group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-semibold text-base text-emerald-950 tracking-[0.15em] uppercase hidden sm:inline">Low Dose</span>
          </Link>

          <div className="pl-6 h-full flex items-center">
            {role === 'Admin' ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden xl:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer group">
                    Administration <ChevronDown size={16} className="group-hover:rotate-6 transition-transform" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {adminLinks.map(link => (
                    <DropdownMenuItem key={link.path} asChild>
                      <Link to={link.path} className={`w-full ${isActive(link.path)}`}>{link.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <nav className="hidden xl:flex items-center gap-6 text-sm font-medium">
                {retailerLinks.map(link => (
                  <Link key={link.path} to={link.path} className={isActive(link.path)}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>

        <div className="hidden md:flex flex-1 justify-center px-8 border-r border-slate-200 h-10 items-center">
            <GlobalSearch />
        </div>

        <div className="flex items-center gap-2 sm:gap-4 pl-4 h-full">
          <div className="hidden sm:block">
            <LicenseStatus />
          </div>
          
          <Button variant="ghost" size="icon" className="relative text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 group" onClick={() => setIsCartOpen(true)}>
             <ShoppingCart size={20} className="group-hover:rotate-6 transition-transform" />
             {items.length > 0 && (
                 <span className="absolute top-0 right-0 h-4 w-4 bg-emerald-600 text-white text-[10px] flex items-center justify-center rounded-full font-bold shadow-sm ring-1 ring-white">
                     {items.length}
                 </span>
             )}
          </Button>

          <div className="hidden sm:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full group">
                  <ChevronDown size={16} className="text-slate-500 group-hover:rotate-6 transition-transform" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="xl:hidden p-2 ml-2 text-slate-600 hover:text-emerald-700 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="xl:hidden border-t border-slate-100 bg-white px-4 py-4 flex flex-col gap-4 shadow-lg absolute w-full left-0 top-[104px]">
           <nav className="flex flex-col gap-4 text-sm font-medium">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} className="text-slate-600 hover:text-emerald-700">
                {link.label}
              </Link>
            ))}
           </nav>
          <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
             <Button variant="outline" className="w-full justify-start gap-2" onClick={() => { setIsCartOpen(true); setIsOpen(false); }}>
                 <ShoppingCart className="w-4 h-4" />
                 View Cart ({items.length})
             </Button>
             <div className="flex items-center justify-between">
                <div>
                    <span className="font-semibold text-slate-800 block">{businessName}</span>
                    <span className={`text-xs font-medium ${isExpired ? 'text-red-600' : daysRemaining < 30 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {isExpired ? 'License Expired' : role === 'Admin' ? 'Admin Account' : `Expires in ${daysRemaining} days`}
                    </span>
                </div>
                <Badge className={`${isExpired ? 'bg-red-600 animate-pulse' : 'bg-emerald-600'} text-white border-transparent shadow-md rounded-full px-4 py-1.5 font-bold text-[11px] uppercase tracking-wider`}>
                    {isExpired ? 'Suspended' : role === 'Admin' ? 'ADMIN' : 'Approved ✓'}
                </Badge>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}