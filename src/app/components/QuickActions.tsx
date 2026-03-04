import React from 'react';
import { 
  Plus, 
  ShoppingCart, 
  Headphones, 
  FileText, 
  PackagePlus,
  MessageCircle,
  User,
  ShieldCheck
} from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { useUser } from '../context/UserContext';

export function QuickActions() {
  const { role, switchRole } = useUser();

  const handleDownloadInvoice = () => {
    toast.success("Invoice downloading...", {
      description: "Your latest invoice has been queued for download."
    });
  };

  const handleContactSupport = () => {
     // In a real app this might open a chat widget
     toast.info("Support Request", {
        description: "Connecting you to a support agent..."
     });
  };

  const handleRoleSwitch = (newRole: 'Admin' | 'Retailer') => {
    switchRole(newRole);
    toast.success(`Switched to ${newRole} view`, {
      description: `You are now viewing the portal as a ${newRole}.`
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            size="icon" 
            className="h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-900/20 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Plus className="h-8 w-8" />
            <span className="sr-only">Quick Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" className="w-56 mb-2">
          <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild>
            <Link to="/catalog" className="cursor-pointer flex items-center gap-2 group">
              <PackagePlus size={16} className="text-emerald-600 group-hover:text-emerald-700 group-hover:rotate-6 transition-all" />
              <span>Create New Order</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/catalog" className="cursor-pointer flex items-center gap-2 group">
              <ShoppingCart size={16} className="text-emerald-600 group-hover:text-emerald-700 group-hover:rotate-6 transition-all" />
              <span>View Cart</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleContactSupport} className="cursor-pointer flex items-center gap-2 group">
            <Headphones size={16} className="text-emerald-600 group-hover:text-emerald-700 group-hover:rotate-6 transition-all" />
            <span>Contact Support</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleDownloadInvoice} className="cursor-pointer flex items-center gap-2 group">
            <FileText size={16} className="text-emerald-600 group-hover:text-emerald-700 group-hover:rotate-6 transition-all" />
            <span>Download Invoice</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs text-slate-500">Demo Options</DropdownMenuLabel>
          
          <DropdownMenuItem 
            onClick={() => handleRoleSwitch('Admin')} 
            className="cursor-pointer flex items-center gap-2 group"
            disabled={role === 'Admin'}
          >
            <ShieldCheck size={16} className={`${role === 'Admin' ? 'text-slate-400' : 'text-emerald-600 group-hover:text-emerald-700'}`} />
            <span className={role === 'Admin' ? 'font-bold' : ''}>Switch to Admin</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => handleRoleSwitch('Retailer')} 
            className="cursor-pointer flex items-center gap-2 group"
            disabled={role === 'Retailer'}
          >
            <User size={16} className={`${role === 'Retailer' ? 'text-slate-400' : 'text-emerald-600 group-hover:text-emerald-700'}`} />
            <span className={role === 'Retailer' ? 'font-bold' : ''}>Switch to Retailer</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}