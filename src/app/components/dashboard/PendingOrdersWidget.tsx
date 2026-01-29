import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { pendingFulfillmentOrders } from '../../data/mockData';
import { Clock } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { OrderStatusBadge } from '../order/OrderStatusBadge';

export function PendingOrdersWidget() {
  
  const getDeliveryEstimate = (dateStr: string, zone: number = 1) => {
    const orderDate = new Date(dateStr);
    // Zone 1: +1-2 days
    // Zone 2: +2-3 days
    // Zone 3: +3-5 days
    let daysToAdd = 1;
    if (zone === 2) daysToAdd = 3;
    if (zone === 3) daysToAdd = 5;
    
    return format(addDays(orderDate, daysToAdd), 'MMM dd, yyyy');
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <div className="p-2 bg-emerald-50 rounded-lg">
                    <Clock className="w-5 h-5 text-emerald-600" />
                </div>
                Pending Fulfillment
            </CardTitle>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 rounded-lg px-2.5 py-1 text-xs font-bold">
                {pendingFulfillmentOrders.length} Orders
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 border-y border-slate-100">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[120px] px-8 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Order ID</TableHead>
                  <TableHead className="px-4 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Customer</TableHead>
                  <TableHead className="px-4 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Status</TableHead>
                  <TableHead className="text-right px-8 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Est. Delivery</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingFulfillmentOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-slate-50/80 transition-colors border-slate-50">
                    <TableCell className="font-mono text-xs font-bold text-slate-500 px-8 py-4">
                        {order.id}
                    </TableCell>
                    <TableCell className="font-bold text-slate-900 text-sm px-4 py-4">
                        {order.customer}
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5">Delivery Zone {order.zone}</div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                        <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right text-sm text-slate-600 font-bold px-8 py-4">
                        {getDeliveryEstimate(order.date, order.zone)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
