import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router';
import { AppBreadcrumb } from '../components/AppBreadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { recentOrders, pendingFulfillmentOrders, Order } from '../data/mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { FileDown, Search, X, Download, PackageOpen } from 'lucide-react';
import { OrderStatusBadge } from '../components/order/OrderStatusBadge';
import { toast } from 'sonner';
import { Skeleton } from '../components/ui/skeleton';

// Combine all orders for the full history view
const allOrders = [...pendingFulfillmentOrders, ...recentOrders].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
);

// Extract unique retailers for filter
const uniqueRetailers = Array.from(new Set(allOrders.map(o => o.customer))).sort();

export function Orders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [retailerFilter, setRetailerFilter] = useState('All');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredOrders = useMemo(() => {
    return allOrders.filter(order => {
      // 1. Search Filter (Order ID)
      if (searchQuery && !order.id.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // 2. Status Filter
      if (statusFilter !== 'All' && order.status !== statusFilter) {
        return false;
      }

      // 3. Retailer Filter
      if (retailerFilter !== 'All' && order.customer !== retailerFilter) {
        return false;
      }

      // 4. Date Range Filter
      if (dateStart) {
        const orderDate = new Date(order.date);
        const startDate = new Date(dateStart);
        if (orderDate < startDate) return false;
      }

      if (dateEnd) {
        const orderDate = new Date(order.date);
        const endDate = new Date(dateEnd);
        // Set end date to end of day to include orders on that day
        endDate.setHours(23, 59, 59, 999);
        if (orderDate > endDate) return false;
      }

      return true;
    });
  }, [searchQuery, statusFilter, retailerFilter, dateStart, dateEnd]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setRetailerFilter('All');
    setDateStart('');
    setDateEnd('');
  };

  const handleDownloadInvoice = (e: React.MouseEvent, orderId: string) => {
    e.preventDefault(); // Prevent row click or navigation if wrapped
    toast.success("Invoice Downloaded", {
        description: `Invoice #${orderId}.pdf has been saved to your device.`
    });
  };

  const handleExportCSV = () => {
      // Simulate CSV generation
      const csvContent = "data:text/csv;charset=utf-8," 
          + "Order ID,Customer,Date,Status,Items,Total\n"
          + filteredOrders.map(o => `${o.id},${o.customer},${o.date},${o.status},${o.items},${o.total}`).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "orders_export.csv");
      document.body.appendChild(link); // Required for FF
      
      // Since it's a data URI, it might not work in all sandboxes, but the logic is sound.
      // For this demo environment, a toast is safer if download fails visually.
      link.click(); 
      document.body.removeChild(link);

      toast.success("Export Complete", {
          description: `Successfully exported ${filteredOrders.length} orders to CSV.`
      });
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'All' || retailerFilter !== 'All' || dateStart || dateEnd;

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 animate-in fade-in duration-500">
      <AppBreadcrumb />
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
          <p className="text-slate-500">Manage your wholesale orders and shipments.</p>
        </div>
        <Button 
            variant="outline" 
            className="text-slate-600 border-slate-200"
            onClick={handleExportCSV}
            disabled={loading}
        >
            <FileDown className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
            <div className="flex flex-col xl:flex-row gap-4 flex-wrap">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                        placeholder="Search Order #" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Filters Group */}
                <div className="flex flex-wrap gap-4">
                    {/* Retailer Filter */}
                    <div className="w-[200px]">
                        <Select value={retailerFilter} onValueChange={setRetailerFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Retailer" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Retailers</SelectItem>
                                {uniqueRetailers.map(r => (
                                    <SelectItem key={r} value={r}>{r}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status Filter */}
                    <div className="w-[180px]">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Statuses</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Paid">Paid</SelectItem>
                                <SelectItem value="Picking">Picking</SelectItem>
                                <SelectItem value="Packed">Packed</SelectItem>
                                <SelectItem value="Shipped">Shipped</SelectItem>
                                <SelectItem value="Delivered">Delivered</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date Range */}
                    <div className="flex gap-2 items-center">
                        <Input 
                            type="date" 
                            value={dateStart} 
                            onChange={(e) => setDateStart(e.target.value)}
                            className="w-[140px]"
                            placeholder="Start"
                        />
                        <span className="text-slate-400">-</span>
                        <Input 
                            type="date" 
                            value={dateEnd} 
                            onChange={(e) => setDateEnd(e.target.value)}
                            className="w-[140px]"
                            placeholder="End"
                        />
                    </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <Button 
                        variant="ghost" 
                        onClick={clearFilters}
                        className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                    >
                        <X className="w-4 h-4 mr-2" /> Clear
                    </Button>
                )}
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Order History</CardTitle>
          <div className="text-sm text-slate-500">
             {loading ? <Skeleton className="h-4 w-32" /> : `Showing ${filteredOrders.length} of ${allOrders.length} orders`}
          </div>
        </CardHeader>
        <CardContent>
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-100 last:border-0">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-8 w-24 ml-auto" />
                        </div>
                    ))}
                </div>
            ) : filteredOrders.length > 0 ? (
                <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Retailer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead className="text-right">Total Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium text-emerald-800">{order.id}</TableCell>
                            <TableCell className="font-medium text-slate-700">{order.customer}</TableCell>
                            <TableCell className="text-slate-500">
                                {new Date(order.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <OrderStatusBadge status={order.status} />
                            </TableCell>
                            <TableCell>{order.items}</TableCell>
                            <TableCell className="text-right font-medium">${order.total.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-3">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-slate-400 hover:text-slate-600"
                                        title="Download Invoice"
                                        onClick={(e) => handleDownloadInvoice(e, order.id)}
                                    >
                                        <Download className="w-4 h-4" />
                                    </Button>
                                    <Link to={`/orders/${order.id}`}>
                                        <Button variant="link" className="text-emerald-700 hover:text-emerald-900 h-auto p-0">View Details</Button>
                                    </Link>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                        <PackageOpen className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">No orders found</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-6">We couldn't find any orders matching your filters. Try adjusting your search criteria.</p>
                    <Button 
                        variant="outline" 
                        onClick={clearFilters}
                        className="border-slate-300"
                    >
                        Clear Filters
                    </Button>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}