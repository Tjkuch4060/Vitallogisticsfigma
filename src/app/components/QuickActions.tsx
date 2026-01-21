import React from 'react';
import { 
  Plus, 
  ShoppingCart, 
  Headphones, 
  FileText, 
  PackagePlus,
  MessageCircle
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

export function QuickActions() {
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
