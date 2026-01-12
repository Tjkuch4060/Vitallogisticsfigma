import React, { useState } from 'react';
import { Menu, X, User, ChevronDown, Phone, Leaf, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { Link, useLocation } from 'react-router-dom';
import { GlobalSearch } from './GlobalSearch';
import { LicenseStatus } from './LicenseStatus';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { setIsOpen: setIsCartOpen, items } = useCart();
  const { daysRemaining, status } = useUser();

  const isActive = (path: string) => location.pathname === path ? 'text-emerald-700 font-semibold' : 'text-slate-600 hover:text-emerald-700';

  const isExpired = status === 'Expired' || status === 'Suspended';

  return (
    <div className="w-full bg-white border-b border-emerald-100/50 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-emerald-950 text-emerald-50 text-xs py-1.5 px-4 md:px-8 flex justify-between items-center">
        <span className="font-medium tracking-wide">ADMIN PORTAL – VITALOGISTICS MANAGEMENT</span>
        <div className="flex items-center gap-2">
          <Phone className="w-3 h-3" />
          <span>Support: (651) 363-1358</span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-900 rounded-lg flex items-center justify-center text-white">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-emerald-950 tracking-tight">VitalLogistics</span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hidden xl:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer">
                Administration <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className={`w-full ${isActive('/dashboard')}`}>Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/orders" className={`w-full ${isActive('/orders')}`}>Orders</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/delivery-zones" className={`w-full ${isActive('/delivery-zones')}`}>Zones</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/retailers" className={`w-full ${isActive('/retailers')}`}>Retailers</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/catalog" className={`w-full ${isActive('/catalog')}`}>Products</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/brands" className={`w-full ${isActive('/brands')}`}>Brands</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/payouts" className={`w-full ${isActive('/payouts')}`}>Payouts</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="hidden md:flex flex-1 justify-center px-8">
            <GlobalSearch />
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <LicenseStatus />
          
          <Button variant="ghost" size="icon" className="relative text-slate-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={() => setIsCartOpen(true)}>
             <ShoppingCart className="w-5 h-5" />
             {items.length > 0 && (
                 <span className="absolute top-0 right-0 h-4 w-4 bg-emerald-600 text-white text-[10px] flex items-center justify-center rounded-full font-bold shadow-sm ring-1 ring-white">
                     {items.length}
                 </span>
             )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="xl:hidden p-2 text-slate-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="xl:hidden border-t border-slate-100 bg-white px-4 py-4 flex flex-col gap-4 shadow-lg absolute w-full left-0 top-[100px]">
           <nav className="flex flex-col gap-4 text-sm font-medium">
            <Link to="/dashboard" className="text-slate-600 hover:text-emerald-700">Dashboard</Link>
            <Link to="/orders" className="text-slate-600 hover:text-emerald-700">Orders</Link>
            <Link to="/delivery-zones" className="text-slate-600 hover:text-emerald-700">Zones</Link>
            <Link to="/retailers" className="text-slate-600 hover:text-emerald-700">Retailers</Link>
            <Link to="/catalog" className="text-slate-600 hover:text-emerald-700">Products</Link>
            <Link to="/brands" className="text-slate-600 hover:text-emerald-700">Brands</Link>
            <Link to="/payouts" className="text-slate-600 hover:text-emerald-700">Payouts</Link>
           </nav>
          <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
             <Button variant="outline" className="w-full justify-start gap-2" onClick={() => { setIsCartOpen(true); setIsOpen(false); }}>
                 <ShoppingCart className="w-4 h-4" />
                 View Cart ({items.length})
             </Button>
             <div className="flex items-center justify-between">
                <div>
                    <span className="font-semibold text-slate-800 block">Test Hemp Dispensary</span>
                    <span className={`text-xs font-medium ${isExpired ? 'text-red-600' : daysRemaining < 30 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {isExpired ? 'License Expired' : `Expires in ${daysRemaining} days`}
                    </span>
                </div>
                <Badge className={`${isExpired ? 'bg-red-600' : 'bg-emerald-600'} text-white border-transparent shadow-sm px-2.5 py-1`}>
                    {isExpired ? 'Suspended' : 'Approved ✓'}
                </Badge>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}