import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { pendingFulfillmentOrders } from '../../data/mockData';
import { Truck, Package, CheckCircle2, Clock } from 'lucide-react';
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
    <Card className="h-full border-emerald-100/50 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                Pending Fulfillment
            </CardTitle>
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                {pendingFulfillmentOrders.length} Orders
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Est. Delivery</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingFulfillmentOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-mono text-xs font-medium text-slate-600">
                    {order.id}
                </TableCell>
                <TableCell className="font-medium text-slate-900 text-sm">
                    {order.customer}
                    <div className="text-[10px] text-slate-400">Zone {order.zone}</div>
                </TableCell>
                <TableCell>
                    <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-right text-sm text-slate-600">
                    {getDeliveryEstimate(order.date, order.zone)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
