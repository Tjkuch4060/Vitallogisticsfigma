import { Order } from '../../data/mockData';
import { ClipboardList, CreditCard, PackageSearch, Box, Truck, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface OrderTimelineProps {
  order: Order;
}

const STEPS = [
  { id: 'Pending', label: 'Order Placed', icon: ClipboardList, description: 'Order received successfully' },
  { id: 'Paid', label: 'Payment Confirmed', icon: CreditCard, description: 'Payment processed' },
  { id: 'Picking', label: 'Picking', icon: PackageSearch, description: 'Items being gathered' },
  { id: 'Packed', label: 'Packed', icon: Box, description: 'Order packed & labeled' },
  { id: 'Shipped', label: 'Shipped', icon: Truck, description: 'In transit to destination' },
  { id: 'Delivered', label: 'Delivered', icon: CheckCircle, description: 'Package delivered' },
];

// Helper to map status to index
const getStatusIndex = (status: string) => {
  const statusMap: Record<string, number> = {
    'Pending': 0,
    'Processing': 1, // Treat Processing as equivalent to Paid/Processing start
    'Paid': 1,
    'Picking': 2,
    'Packed': 3,
    'Shipped': 4,
    'Delivered': 5
  };
  return statusMap[status] || 0;
};

// Helper to generate mock timestamps based on order date and step
const getStepTimestamp = (orderDate: string, stepIndex: number, currentStatusIndex: number) => {
  if (stepIndex > currentStatusIndex) return null;

  const date = new Date(orderDate);
  const timestamps = [
    { add: 0, time: '9:41 AM' },           // Placed
    { add: 0, time: '10:15 AM' },          // Paid
    { add: 0, time: '1:30 PM' },           // Picking
    { add: 0, time: '4:45 PM' },           // Packed
    { add: 1, time: '9:00 AM' },           // Shipped (Next Day)
    { add: 3, time: '2:20 PM' },           // Delivered (3 Days later)
  ];

  const conf = timestamps[stepIndex];
  if (!conf) {
    return null;
  }
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + conf.add);
  
  return {
    date: newDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    time: conf.time
  };
};

export function OrderTimeline({ order }: OrderTimelineProps) {
  const currentStepIndex = getStatusIndex(order.status);

  return (
    <Card className="mb-8">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-500" />
                Order Status Timeline
            </CardTitle>
            <Badge variant="outline" className="text-xs font-normal text-slate-500 bg-slate-50">
                Synced with Extensiv
            </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Progress Bar Background (Desktop) */}
          <div className="hidden md:block absolute top-5 left-0 w-full h-1 bg-slate-100 rounded-full" />
          
          {/* Active Progress Bar (Desktop) */}
          <motion.div 
            className="hidden md:block absolute top-5 left-0 h-1 bg-emerald-600 rounded-full z-0"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Steps */}
          <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-0">
            {STEPS.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const timestamp = getStepTimestamp(order.date, index, currentStepIndex);

              return (
                <div key={step.id} className="flex md:flex-col items-center md:items-center gap-4 md:gap-2 flex-1 md:text-center min-w-0">
                  {/* Icon Circle */}
                  <div 
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 shrink-0
                      ${isCompleted ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-300'}
                      ${isCurrent ? 'ring-4 ring-emerald-100' : ''}
                    `}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 md:w-full">
                    <h4 className={`text-sm font-semibold ${isCompleted ? 'text-emerald-900' : 'text-slate-400'}`}>
                      {step.label}
                    </h4>
                    {timestamp ? (
                       <div className="flex flex-col md:items-center">
                           <span className="text-xs font-medium text-slate-600">{timestamp.date}</span>
                           <span className="text-[10px] text-slate-400">{timestamp.time}</span>
                       </div>
                    ) : (
                       <span className="text-xs text-slate-300 italic">Pending</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
