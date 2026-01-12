import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { recentOrders } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { DashboardKPIs } from '../components/dashboard/DashboardKPIs';
import { DateRangeFilter } from '../components/dashboard/DateRangeFilter';
import { PendingOrdersWidget } from '../components/dashboard/PendingOrdersWidget';
import { LicenseApprovalQueue } from '../components/dashboard/LicenseApprovalQueue';
import { OrderStatusBadge } from '../components/order/OrderStatusBadge';
import { toast } from 'sonner';
import { subDays, format, eachDayOfInterval } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { AppBreadcrumb } from '../components/AppBreadcrumb';

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  
  // Generate initial data for the last 7 days to match default filter
  const generateInitialData = () => {
    const end = new Date();
    const start = subDays(end, 6);
    return eachDayOfInterval({ start, end }).map(date => ({
      name: format(date, 'MMM dd'),
      sales: Math.floor(Math.random() * 5000) + 2000
    }));
  };

  const [chartData, setChartData] = useState(generateInitialData());

  useEffect(() => {
      // Simulate loading
      const timer = setTimeout(() => {
          setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
  }, []);

  const handleRangeChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      // Generate mock data for the selected range
      const days = eachDayOfInterval({ start: range.from, end: range.to });
      const newChartData = days.map(day => ({
        name: format(day, 'MMM dd'),
        sales: Math.floor(Math.random() * 6000) + 1500 // Randomize sales
      }));
      
      setChartData(newChartData);
      
      toast.info("Date range updated", {
        description: `Showing data from ${format(range.from, 'MMM dd')} to ${format(range.to, 'MMM dd')}`
      });
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <AppBreadcrumb />
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Admin Dashboard</h1>

      {/* KPI Cards (Revenue, Orders, Fees, Margin) */}
      <DashboardKPIs loading={loading} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-8">
        {/* Chart */}
        <Card className="col-span-4 h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Revenue Trends</CardTitle>
            {loading ? <Skeleton className="h-8 w-[240px]" /> : <DateRangeFilter onRangeChange={handleRangeChange} />}
          </CardHeader>
          <CardContent className="pl-2">
            {loading ? (
                <div className="h-[350px] w-full flex items-end justify-between p-4 gap-2">
                    {[1,2,3,4,5,6,7].map(i => (
                        <Skeleton key={i} className={`w-full rounded-t-md`} style={{ height: `${Math.random() * 80 + 20}%` }} />
                    ))}
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`$${value}`, 'Revenue']}
                    />
                    <Bar dataKey="sales" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Right Column Widgets */}
        <div className="col-span-3 space-y-4">
             {loading ? (
                 <>
                    <Skeleton className="h-[200px] w-full rounded-xl" />
                    <Skeleton className="h-[200px] w-full rounded-xl" />
                 </>
             ) : (
                 <>
                    <PendingOrdersWidget />
                    <LicenseApprovalQueue />
                 </>
             )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1 mb-8">
         {/* Recent Orders - Full Width */}
         <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link to="/orders">
                <Button variant="ghost" size="sm" className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50" disabled={loading}>
                    View All Orders <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </Link>
          </CardHeader>
          <CardContent>
             {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-4 w-20 ml-auto" />
                        </div>
                    ))}
                </div>
             ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.id}</TableCell>
                                <TableCell>{order.customer}</TableCell>
                                <TableCell>
                                    <OrderStatusBadge status={order.status} />
                                </TableCell>
                                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}