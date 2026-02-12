import React, { useState, useCallback } from 'react';
import { DollarSign, Package, TrendingUp, Users, SlidersHorizontal, Eye, EyeOff, Truck, Percent } from 'lucide-react';
import { DraggableKPICard, KPIItem } from './DraggableKPICard';
import { KPICardSkeleton } from './KPICardSkeleton';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../ui/dialog';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

// Mock values based on requested metrics
const revenue = 45231.89;
const margin = revenue * 0.30;
const deliveryFees = 3250.00;
const totalOrders = 124;

const initialKPIs: KPIItem[] = [
  {
    id: 'kpi-1',
    title: 'Total Revenue',
    value: revenue,
    prefix: '$',
    change: '+20.1% from last month',
    icon: DollarSign,
    visible: true,
    trend: [35000, 37000, 36000, 40000, 42000, 45231],
  },
  {
    id: 'kpi-2',
    title: 'Total Orders',
    value: totalOrders,
    prefix: '',
    change: '+12 today',
    icon: Package,
    visible: true,
    trend: [80, 90, 85, 100, 110, 124],
  },
  {
    id: 'kpi-3',
    title: 'Delivery Fees',
    value: deliveryFees,
    prefix: '$',
    change: 'Collected this month',
    icon: Truck,
    visible: true,
    trend: [2500, 2600, 2800, 3000, 3100, 3250],
  },
  {
    id: 'kpi-4',
    title: 'Net Margin (30%)',
    value: margin,
    prefix: '$',
    change: 'VitaLogistics Share',
    icon: Percent,
    visible: true,
    trend: [10000, 11000, 10500, 12000, 12500, 13569],
  },
  {
    id: 'kpi-5',
    title: 'Avg. Order Value',
    value: revenue / totalOrders,
    prefix: '$',
    change: '+5% from last month',
    icon: DollarSign,
    visible: false, // Hidden by default
    trend: [350, 355, 360, 362, 364, 365],
  },
  {
    id: 'kpi-6',
    title: 'New Retailers',
    value: 12,
    prefix: '+',
    change: '+2 from yesterday',
    icon: Users,
    visible: false, // Hidden by default
    trend: [5, 7, 6, 8, 10, 12],
  }
];

interface DashboardKPIsProps {
    loading?: boolean;
}

export function DashboardKPIs({ loading = false }: DashboardKPIsProps) {
  const [items, setItems] = useState<KPIItem[]>(initialKPIs);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setItems((prevCards) => {
      const visibleItems = prevCards.filter(c => c.visible);
      const hiddenItems = prevCards.filter(c => !c.visible);
      
      const newVisibleItems = [...visibleItems];
      const [movedItem] = newVisibleItems.splice(dragIndex, 1);
      newVisibleItems.splice(hoverIndex, 0, movedItem);
      
      return [...newVisibleItems, ...hiddenItems];
    });
  }, []);

  const toggleVisibility = (id: string) => {
    setItems(prev => prev.map(item => 
        item.id === id ? { ...item, visible: !item.visible } : item
    ));
  };

  const visibleItems = items.filter(i => i.visible);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Revenue Overview</h2>
        <Dialog open={isCustomizeOpen} onOpenChange={setIsCustomizeOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 text-slate-600" disabled={loading}>
                    <SlidersHorizontal className="w-4 h-4" />
                    Customize Metrics
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Customize Dashboard Metrics</DialogTitle>
                    <DialogDescription>
                        Select which metrics to display on your dashboard. You can drag and drop cards on the dashboard to rearrange them.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`show-${item.id}`} 
                                checked={item.visible}
                                onCheckedChange={() => toggleVisibility(item.id)}
                            />
                            <Label htmlFor={`show-${item.id}`} className="flex-1 flex items-center justify-between cursor-pointer">
                                <span>{item.title}</span>
                                <span className="text-xs text-slate-500">{item.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}</span>
                            </Label>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                     <Button onClick={() => setIsCustomizeOpen(false)}>Done</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
            // Show Skeletons
            [1, 2, 3, 4].map((i) => <KPICardSkeleton key={i} />)
        ) : (
            <>
                {visibleItems.map((item, index) => (
                <DraggableKPICard
                    key={item.id}
                    index={index}
                    id={item.id}
                    item={item}
                    moveCard={moveCard}
                />
                ))}
                {visibleItems.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-lg text-slate-500">
                        No metrics selected. Click "Customize Metrics" to add.
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
}