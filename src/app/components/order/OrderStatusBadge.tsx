import { Badge } from '../ui/badge';
import { Check, Box, Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Paid':
        return {
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
          icon: Check
        };
      case 'Picking':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100',
          icon: Box
        };
      case 'Packed':
        return {
          color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100',
          icon: Package
        };
      case 'Shipped':
        return {
          color: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100',
          icon: Truck
        };
      case 'Delivered':
        return {
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
          icon: CheckCircle
        };
      case 'Pending':
        return {
            color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100',
            icon: Clock
        };
      case 'Processing':
        return {
            color: 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50',
            icon: Clock
        };
      default:
        return {
          color: 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-100',
          icon: AlertCircle
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.color} gap-1.5 ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </Badge>
  );
}
