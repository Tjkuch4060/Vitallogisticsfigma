import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
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
import { ArrowRight, Download, FileText } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { AppBreadcrumb } from '../components/AppBreadcrumb';
import { exportToCSV, exportOrdersToPDF } from '../utils/exportHelpers';
import { recentOrders } from '../data/mockData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

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
    <div className="container mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-20">
      <AppBreadcrumb />
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 mt-6">
        <div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Network Status
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-xl border-slate-200 font-bold text-slate-600 h-10 px-5 gap-2">
                  <Download className="w-4 h-4" />
                  Download Reports
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => exportToCSV(recentOrders.map(order => ({
                    'Order ID': order.id,
                    'Customer': order.customer,
                    'Date': order.date,
                    'Status': order.status,
                    'Total': `$${order.total.toFixed(2)}`,
                    'Items': order.items,
                    'Zone': order.zone || 'N/A'
                  })), 'orders-report')}
                  className="gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Export Orders to CSV
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => exportOrdersToPDF(recentOrders)}
                  className="gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Export Orders to PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-5 border-none shadow-lg shadow-emerald-900/10 transition-all hover:scale-105">
                Add New Order
            </Button>
        </div>
      </div>

      {/* KPI Cards (Revenue, Orders, Fees, Margin) */}
      <div className="mb-12">
        <DashboardKPIs loading={loading} />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7 mb-12">
        {/* Chart */}
        <Card className="col-span-4 h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <CardTitle className="text-xl font-bold text-slate-900">Revenue Trends</CardTitle>
            {loading ? <Skeleton className="h-8 w-[240px]" /> : <DateRangeFilter onRangeChange={handleRangeChange} />}
          </CardHeader>
          <CardContent className="pl-4 pb-4">
            {loading ? (
                <div className="h-[350px] w-full flex items-end justify-between p-4 gap-2">
                    {[1,2,3,4,5,6,7].map(i => (
                        <Skeleton key={i} className={`w-full rounded-t-lg`} style={{ height: `${Math.random() * 80 + 20}%` }} />
                    ))}
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                        dataKey="name" 
                        stroke="#94a3b8" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        dy={10}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                        dx={-10}
                    />
                    <Tooltip 
                        cursor={{fill: '#f8fafc', radius: 4}}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`$${value}`, 'Revenue']}
                    />
                    <Bar dataKey="sales" fill="#059669" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
                </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Right Column Widgets */}
        <div className="col-span-3 space-y-8">
             {loading ? (
                 <>
                    <Skeleton className="h-[240px] w-full rounded-2xl" />
                    <Skeleton className="h-[240px] w-full rounded-2xl" />
                 </>
             ) : (
                 <>
                    <PendingOrdersWidget />
                    <LicenseApprovalQueue />
                 </>
             )}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1 mb-12">
         {/* Recent Orders - Full Width */}
         <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6 mb-6">
            <CardTitle className="text-xl font-bold text-slate-900">Recent Orders</CardTitle>
            <Link to="/orders">
                <Button variant="ghost" size="sm" className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl font-bold h-10 px-4" disabled={loading}>
                    View All Orders <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </Link>
          </CardHeader>
          <CardContent className="px-0 pb-0">
             {loading ? (
                <div className="space-y-6 px-8 pb-8">
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
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-slate-100">
                                <TableHead className="px-8 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Order ID</TableHead>
                                <TableHead className="px-4 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Customer</TableHead>
                                <TableHead className="px-4 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Status</TableHead>
                                <TableHead className="text-right px-8 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentOrders.map((order) => (
                                <TableRow key={order.id} className="hover:bg-slate-50/50 border-slate-50 transition-colors">
                                    <TableCell className="px-8 py-5 font-bold text-slate-900">{order.id}</TableCell>
                                    <TableCell className="px-4 py-5 font-medium text-slate-600">{order.customer}</TableCell>
                                    <TableCell className="px-4 py-5">
                                        <OrderStatusBadge status={order.status} />
                                    </TableCell>
                                    <TableCell className="px-8 py-5 text-right font-extrabold text-emerald-700 text-lg">${order.total.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}