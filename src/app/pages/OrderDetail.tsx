import React from 'react';
import { useParams, Link } from 'react-router';
import { AppBreadcrumb } from '../components/AppBreadcrumb';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
    ArrowLeft, 
    Printer, 
    Truck, 
    RotateCcw, 
    Download, 
    MapPin, 
    Package, 
    CreditCard,
    Calendar,
    Mail,
    Phone,
    Store,
    Clock,
    Info
} from 'lucide-react';
import { recentOrders, products } from '../data/mockData';
import { OrderTimeline } from '../components/order/OrderTimeline';
import { OrderStatusBadge } from '../components/order/OrderStatusBadge';
import { useCartStore } from '../store/cartStore';
import { toast } from 'sonner';

export function OrderDetail() {
  const { orderId } = useParams();
  const addItems = useCartStore((state) => state.addItems);
  
  // Mock data lookup
  const order = recentOrders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <Link to="/orders" className="text-emerald-600 hover:underline mt-4 inline-block">
            Go back to Orders
        </Link>
      </div>
    );
  }
  
  // Mock order items (deterministic based on order ID for demo consistency, or fallback to fixed list)
  const orderItems = [
    { product: products[0], quantity: 10 },
    { product: products[3], quantity: 5 },
    { product: products[2], quantity: 15 },
  ];

  // Logic to simulate a "Pickup" order (e.g., specific Zone 1 order or just strictly for demo, let's say odd ID numbers are pickup or just this order if manually selected)
  // For robustness, let's say Zone 1 orders are "Pickup" eligible
  const isPickup = order.zone === 1;

  // Calculate financials dynamically
  const subtotal = orderItems.reduce((sum, item) => sum + ((item.product?.price || 0) * item.quantity), 0);
  const shippingFee = isPickup ? 0 : (subtotal > 1500 ? 0 : 45.00);
  const tax = subtotal * 0.08875; // 8.875% Tax
  const total = subtotal + shippingFee + tax;

  const handleReorder = () => {
    addItems(orderItems.filter(item => item.product));
  };

  const handleDownloadInvoice = () => {
    toast.success("Invoice Downloaded", {
        description: `Invoice #${order.id}.pdf has been saved to your device.`
    });
  };

  const trackingNumber = "1Z999AA10123456784";
  const isShipped = ['Shipped', 'Delivered'].includes(order.status);
  const isReadyForPickup = ['Paid', 'Processing', 'Packed', 'Picking'].includes(order.status);

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 animate-in fade-in duration-500">
      <AppBreadcrumb />
      
      {/* Header Section */}
      <div className="mb-8 mt-4">
        <Link to="/orders" className="text-sm text-slate-500 hover:text-emerald-600 flex items-center mb-6 transition-colors group w-fit">
            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> 
            Back to Orders
        </Link>
        
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-slate-900">Order #{order.id}</h1>
                    <OrderStatusBadge status={order.status} className="text-sm px-3 py-1" />
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        Placed on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="hidden sm:inline text-slate-300">|</span>
                    <span className="flex items-center gap-1.5">
                        <Package className="w-4 h-4" />
                        {orderItems.reduce((acc, item) => acc + item.quantity, 0)} Items
                    </span>
                    <span className="hidden sm:inline text-slate-300">|</span>
                    <span className="flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4" />
                        Total: <span className="font-medium text-slate-900">${total.toFixed(2)}</span>
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                <Button onClick={handleReorder} variant="outline" className="text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 transition-colors">
                    <RotateCcw className="w-4 h-4 mr-2" /> 
                    Reorder Items
                </Button>
                <Button variant="outline" className="text-slate-600 border-slate-200 hover:bg-slate-50" onClick={handleDownloadInvoice}>
                    <Download className="w-4 h-4 mr-2" /> 
                    Invoice
                </Button>
                {!isPickup && isShipped && (
                    <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-900/10">
                        <Truck className="w-4 h-4 mr-2" /> 
                        Track Shipment
                    </Button>
                )}
            </div>
        </div>
      </div>

      <OrderTimeline order={order} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Items */}
        <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                    <CardTitle className="text-lg text-slate-800">Order Items</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                        {orderItems.map((item, index) => (
                            item.product && (
                            <div key={index} className="p-6 flex flex-col sm:flex-row items-start gap-4 hover:bg-slate-50/30 transition-colors">
                                <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-semibold text-slate-900 truncate pr-4">{item.product.name}</h4>
                                        <p className="font-bold text-slate-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-2">{item.product.brand}</p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <Badge variant="secondary" className="rounded-md font-normal bg-slate-100 text-slate-600 border-slate-200">
                                            SKU: {item.product.sku}
                                        </Badge>
                                        <div className="text-slate-600">
                                            <span className="text-slate-400 mr-2">Qty:</span>
                                            <span className="font-medium">{item.quantity}</span>
                                        </div>
                                        <div className="text-slate-600">
                                            <span className="text-slate-400 mr-2">Price:</span>
                                            <span className="font-medium">${item.product.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            )
                        ))}
                    </div>
                </CardContent>
                <div className="bg-slate-50 p-6 border-t border-slate-200">
                    <div className="flex flex-col gap-3 max-w-xs ml-auto">
                        <div className="flex justify-between text-slate-600">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>Shipping {shippingFee === 0 && <span className="text-xs text-emerald-600 font-medium ml-1">(Free)</span>}</span>
                            <span>${shippingFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>Tax (8.875%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <Separator className="my-1" />
                        <div className="flex justify-between font-bold text-lg text-slate-900">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>

        {/* Right Column: Details */}
        <div className="space-y-6">
            {/* Customer Details */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base text-slate-800">Customer Details</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                    <div className="font-semibold text-slate-900 text-lg mb-1">{order.customer}</div>
                    <div className="text-slate-500 mb-4">Customer ID: {order.id.split('-')[1]}992</div>
                    
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div className="text-slate-600">
                                123 Hemp Blvd, Suite 404<br/>
                                Portland, OR 97204<br/>
                                United States
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <a href="mailto:purchasing@wellnesscorner.com" className="text-emerald-600 hover:underline">purchasing@wellnesscorner.com</a>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">+1 (503) 555-0199</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Delivery Info */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base text-slate-800">Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Delivery Method</h4>
                        <div className={`flex items-center gap-2 p-2 rounded-md border ${isPickup ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
                            {isPickup ? <Store className="w-4 h-4 text-amber-600" /> : <Truck className="w-4 h-4 text-slate-500" />}
                            <span className={`text-sm font-medium ${isPickup ? 'text-amber-900' : 'text-slate-700'}`}>
                                {isPickup ? 'Local Warehouse Pickup' : 'FedEx Ground'}
                            </span>
                        </div>
                    </div>
                    
                    {isPickup ? (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {/* Pickup Instructions */}
                            <div className="space-y-4">
                                {isReadyForPickup && (
                                    <div className="p-3 bg-emerald-50 rounded-md border border-emerald-100 flex items-start gap-3">
                                        <Info className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-sm font-semibold text-emerald-800">Ready for Pickup</p>
                                            <p className="text-xs text-emerald-600/90 mt-1">Your order is packed and ready at the counter.</p>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pickup Location</h4>
                                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-md border border-slate-100">
                                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                                        <div className="text-sm text-slate-600">
                                            <span className="font-semibold text-slate-800 block mb-0.5">VitalLogistics Main Warehouse</span>
                                            4500 Industrial Way, Door 4<br/>
                                            Portland, OR 97210
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pickup Details</h4>
                                    <div className="text-sm text-slate-600 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-slate-400" />
                                            <span>Window: <span className="font-medium text-slate-900">3 business days</span></span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                            <span>Contact: <span className="font-medium text-slate-900">(503) 555-WARE</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Standard Shipping Info */
                        isShipped ? (
                            <div>
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tracking Information</h4>
                                <div className="p-3 bg-emerald-50 rounded-md border border-emerald-100">
                                    <p className="text-xs text-emerald-800 mb-1">Tracking Number:</p>
                                    <a href="#" className="font-mono text-emerald-700 font-semibold hover:underline flex items-center gap-1">
                                        {trackingNumber}
                                        <ArrowLeft className="w-3 h-3 rotate-180" />
                                    </a>
                                    <p className="text-xs text-emerald-600/80 mt-2">
                                        Estimated Delivery: <br/>
                                        <span className="font-medium">Tomorrow by 5:00 PM</span>
                                    </p>
                                </div>
                            </div>
                        ) : (
                             <div>
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tracking Information</h4>
                                <div className="p-3 bg-slate-50 rounded-md border border-slate-100 text-sm text-slate-500 italic">
                                    Tracking will be available once the order is shipped.
                                </div>
                            </div>
                        )
                    )}
                </CardContent>
            </Card>

            {/* Payment Info */}
             <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base text-slate-800">Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">Payment Method</span>
                        <span className="text-sm font-medium text-slate-900">ACH Transfer</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-slate-600">Payment Status</span>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Paid</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full text-xs h-8">
                        View Payment Receipt
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}