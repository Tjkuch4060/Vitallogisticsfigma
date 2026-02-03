import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Truck, MapPin } from 'lucide-react';
import { Badge } from '../ui/badge';

interface DeliveryInfo {
  zoneName: string;
  fee: number;
  scheduledDay: string;
}

interface DeliveryCalculatorProps {
  onCalculate: (info: DeliveryInfo | null) => void;
}

export function DeliveryCalculator({ onCalculate }: DeliveryCalculatorProps) {
  const [zipCode, setZipCode] = useState('');
  const [info, setInfo] = useState<DeliveryInfo | null>(null);

  useEffect(() => {
    if (zipCode.length === 5) {
      const zip = parseInt(zipCode, 10);
      let result: DeliveryInfo | null = null;
      
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const dayAfter = new Date(today);
      dayAfter.setDate(today.getDate() + 2);
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 5);

      const options = { weekday: 'long' as const, month: 'short' as const, day: 'numeric' as const };

      // Mock Logic
      if (zip >= 55400 && zip <= 55499) {
        // Minneapolis / Downtown - Zone A
        result = {
          zoneName: 'Zone A (Metro Core)',
          fee: 15.00,
          scheduledDay: 'Today by 5pm'
        };
      } else if (zip >= 55300 && zip <= 55399) {
         // Suburbs - Zone B
         result = {
          zoneName: 'Zone B (Suburbs)',
          fee: 25.00,
          scheduledDay: tomorrow.toLocaleDateString('en-US', options)
         };
      } else if (zip >= 10000 && zip <= 99999) {
        // Regional - Zone C
        result = {
          zoneName: 'Zone C (Regional)',
          fee: 45.00,
          scheduledDay: nextWeek.toLocaleDateString('en-US', options)
        };
      }

      setInfo(result);
      onCalculate(result);
    } else {
      setInfo(null);
      onCalculate(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- onCalculate from parent; only recalc when zipCode changes
  }, [zipCode]);

  return (
    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Truck className="w-4 h-4 text-slate-500" />
        <h4 className="text-sm font-semibold text-slate-900">Delivery Estimator</h4>
      </div>
      
      <div className="space-y-3">
        <div>
           <div className="relative">
             <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
             <Input 
                placeholder="Enter Zip Code" 
                value={zipCode} 
                onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 5);
                    setZipCode(val);
                }}
                className="pl-9 bg-white"
             />
           </div>
        </div>

        {info && (
          <div className="text-sm space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
             <div className="flex justify-between items-start">
                <span className="text-slate-500">Zone:</span>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    {info.zoneName}
                </Badge>
             </div>
             <div className="flex justify-between">
                <span className="text-slate-500">Schedule:</span>
                <span className="font-medium text-slate-900">{info.scheduledDay}</span>
             </div>
             <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                <span className="font-medium text-slate-700">Delivery Fee:</span>
                <span className="font-bold text-slate-900">${info.fee.toFixed(2)}</span>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
