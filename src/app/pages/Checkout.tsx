import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Check, Truck, CreditCard, ShieldCheck, ArrowLeft, ArrowRight, MapPin, Package, Store, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { deliveryZones } from '../data/mockData';
import { toast } from 'sonner';
import { checkoutSchema, CheckoutFormData } from '../schemas/checkout.schema';
import { handleError } from '../utils/errorHandler';

// Helper to calculate next delivery date based on processing time and allowed days
const getNextDeliveryDate = (processingDays: number, allowedDays: string[]) => {
    const date = new Date();
    // Add processing time
    date.setDate(date.getDate() + processingDays);
    
    // Find next valid delivery day
    // Safety break after 14 days to prevent infinite loop if data is bad
    for (let i = 0; i < 14; i++) {
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }); // "Mon", "Tue"...
        if (allowedDays.includes(dayName)) {
            return date;
        }
        date.setDate(date.getDate() + 1);
    }
    return date; // Fallback
};

const calculateZone = (zip: string, subtotal: number) => {
  const zipNum = parseInt(zip, 10);
  let zoneId = 3; // Default to regional

  if (zipNum >= 55400 && zipNum <= 55499) {
    zoneId = 1;
  } else if (zipNum >= 55300 && zipNum <= 55399) {
    zoneId = 2;
  }

  const zone = deliveryZones.find(z => z.zoneId === zoneId);

  if (!zone) {
    return {
      name: 'Service Unavailable',
      fee: 999.00,
      date: 'N/A',
      isFree: false,
      threshold: 999999
    };
  }
  
  // Calculate specific date
  const processingTime = 1; // 1 day processing
  const deliveryDate = getNextDeliveryDate(processingTime, zone.days);
  
  const datePart = deliveryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const dayPart = deliveryDate.toLocaleDateString('en-US', { weekday: 'long' });
  const finalDateString = `${datePart} (${dayPart})`;

  // Calculate fee
  const fee = subtotal >= zone.freeThreshold ? 0 : zone.baseFee;

  return { 
      name: zone.name, 
      fee: fee, 
      date: finalDateString,
      isFree: fee === 0,
      threshold: zone.freeThreshold
  };
};

const getPickupInfo = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const datePart = tomorrow.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const dayPart = tomorrow.toLocaleDateString('en-US', { weekday: 'long' });
    
    return {
        name: 'VitalLogistics Warehouse (Minneapolis, MN)',
        fee: 0.00, // Usually pickup is free or small handling
        date: `Ready ${datePart} (${dayPart})`
    }
}

const steps = [
  { id: 1, name: 'Delivery Address', icon: MapPin },
  { id: 2, name: 'Delivery Method & Review', icon: Truck },
  { id: 3, name: 'Payment & Confirmation', icon: CreditCard },
];

export function Checkout() {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => 
    state.items.reduce((sum, item) => sum + (item.lockedPrice * item.quantity), 0)
  );
  const clearCart = useCartStore((state) => state.clearCart);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Form with React Hook Form + Zod
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryMethod: 'delivery',
      paymentMethod: 'card',
      state: 'MN',
      phone: ''
    },
    mode: 'onBlur'
  });

  const watchedZip = watch('zip');
  const watchedDeliveryMethod = watch('deliveryMethod');
  const formData = watch();

  const [deliveryInfo, setDeliveryInfo] = useState<{name: string, fee: number, date: string, isFree?: boolean, threshold?: number} | null>(null);

  // Calculate delivery when moving to step 2 or changing zip
  useEffect(() => {
    if (watchedDeliveryMethod === 'delivery') {
        if (watchedZip && watchedZip.length === 5) {
            setDeliveryInfo(calculateZone(watchedZip, total));
        }
    } else {
        setDeliveryInfo(getPickupInfo());
    }
  }, [watchedZip, watchedDeliveryMethod, total]);

  const handleNext = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      handleSubmit(
        () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setCurrentStep((prev) => Math.min(prev + 1, 3));
        },
        (errors) => {
          // Scroll to first error
          const firstError = Object.keys(errors)[0];
          const element = document.querySelector(`[name="${firstError}"]`);
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      )();
      return;
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setLoading(true);
      // Form is validated!
      console.log('Valid data:', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoading(false);
      setCompleted(true);
      clearCart();
      toast.success('Order placed successfully!');
    } catch (error) {
      setLoading(false);
      handleError(error, 'Checkout');
    }
  };

  const handleDownloadInvoice = () => {
      // Simulate PDF download
      const link = document.createElement('a');
      link.href = '#';
      link.download = `invoice_ORD-${Math.floor(Math.random() * 100000)}.pdf`;
      toast.success("Invoice Downloaded", {
          description: `Invoice for your order has been saved.`
      });
  };

  if (items.length === 0 && !completed) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Package className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Browse our catalog to find premium hemp products.</p>
        <Link to="/catalog">
          <Button className="bg-emerald-700 hover:bg-emerald-800">Browse Catalog</Button>
        </Link>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center max-w-lg">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
          <ShieldCheck className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h2>
        <p className="text-slate-500 mb-8">Thank you for your order. We've sent a confirmation email to {formData.email}. Your order ID is #ORD-{Math.floor(Math.random() * 100000)}.</p>
        
        <div className="bg-slate-50 p-6 rounded-lg w-full mb-8 border border-slate-200 text-left">
           <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
             <Truck className="w-4 h-4" />
             Delivery Details
           </h3>
           <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Expected Delivery:</span>
                <span className="font-medium text-emerald-700">{deliveryInfo?.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Address:</span>
                <span className="font-medium text-right">{formData.address}, {formData.city}</span>
              </div>
           </div>
        </div>

        <div className="flex gap-4">
           <Link to="/dashboard">
             <Button variant="outline">Return to Dashboard</Button>
           </Link>
           <Button 
             variant="outline"
             onClick={handleDownloadInvoice}
             className="border-slate-300"
           >
             <FileText className="w-4 h-4 mr-2" /> Download Invoice
           </Button>
           <Link to="/catalog">
             <Button className="bg-emerald-700 hover:bg-emerald-800">Continue Shopping</Button>
           </Link>
        </div>
      </div>
    );
  }

  const subtotal = total;
  const shipping = deliveryInfo?.fee || 0;
  const orderTotal = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
       {/* Progress Bar */}
       <div className="mb-12">
          <div className="relative flex justify-between items-center max-w-3xl mx-auto">
             {/* Line Background */}
             <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 rounded-full" />
             
             {/* Active Line */}
             <motion.div 
               className="absolute top-1/2 left-0 h-1 bg-emerald-600 -z-10 rounded-full" 
               initial={{ width: '0%' }}
               animate={{ width: `${((currentStep - 1) / 2) * 100}%` }}
               transition={{ duration: 0.5, ease: "easeInOut" }}
             />

             {steps.map((step) => {
               const isActive = step.id === currentStep;
               const isCompleted = step.id < currentStep;
               
               return (
                 <div key={step.id} className="flex flex-col items-center gap-2 bg-slate-50 px-2">
                    <div 
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                        ${isActive ? 'border-emerald-600 bg-emerald-600 text-white scale-110 shadow-lg shadow-emerald-200' : ''}
                        ${isCompleted ? 'border-emerald-600 bg-emerald-600 text-white' : ''}
                        ${!isActive && !isCompleted ? 'border-slate-300 bg-white text-slate-400' : ''}
                      `}
                    >
                       {isCompleted ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs font-semibold ${isActive ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {step.name}
                    </span>
                 </div>
               );
             })}
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <motion.div
               key={currentStep}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Address</CardTitle>
                    <CardDescription>Enter the destination for your wholesale order.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="Jane Doe" 
                        {...register('name')}
                        aria-invalid={errors.name ? 'true' : 'false'}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input 
                        id="company" 
                        placeholder="ABC Dispensary" 
                        {...register('company')}
                        aria-invalid={errors.company ? 'true' : 'false'}
                      />
                      {errors.company && (
                        <p className="text-sm text-red-600 mt-1">{errors.company.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="jane@dispensary.com" 
                        {...register('email')}
                        aria-invalid={errors.email ? 'true' : 'false'}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="6125551234" 
                        {...register('phone')}
                        aria-invalid={errors.phone ? 'true' : 'false'}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setValue('phone', value, { shouldValidate: true });
                        }}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input 
                        id="address" 
                        placeholder="123 Hemp Way" 
                        {...register('address')}
                        aria-invalid={errors.address ? 'true' : 'false'}
                      />
                      {errors.address && (
                        <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                      <Input 
                        id="addressLine2" 
                        placeholder="Suite, Unit, etc." 
                        {...register('addressLine2')}
                      />
                    </div>

                    <div className="grid grid-cols-6 gap-4">
                      <div className="col-span-3 space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input 
                          id="city" 
                          placeholder="Minneapolis" 
                          {...register('city')}
                          aria-invalid={errors.city ? 'true' : 'false'}
                        />
                        {errors.city && (
                          <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
                        )}
                      </div>
                      <div className="col-span-1 space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" value="MN" disabled {...register('state')} />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="zip">Zip Code</Label>
                        <Input 
                          id="zip" 
                          placeholder="55401" 
                          {...register('zip')}
                          aria-invalid={errors.zip ? 'true' : 'false'}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                            setValue('zip', value, { shouldValidate: true });
                          }}
                        />
                        {errors.zip && (
                          <p className="text-sm text-red-600 mt-1">{errors.zip.message}</p>
                        )}
                        <p className="text-[10px] text-slate-400">Try 55401 (Zone 1) or 55305 (Zone 2)</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button 
                      className="bg-emerald-700 hover:bg-emerald-800"
                      onClick={handleNext}
                      disabled={isSubmitting}
                    >
                       Continue to Delivery Method <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {currentStep === 2 && (
                 <Card>
                   <CardHeader>
                     <CardTitle>Delivery Method & Review</CardTitle>
                     <CardDescription>Confirm your items and shipping method.</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-6">
                      
                      <div className="space-y-4">
                        <Label className="text-base font-semibold">Select Delivery Method</Label>
                        <RadioGroup 
                            defaultValue="delivery" 
                            value={watchedDeliveryMethod} 
                            onValueChange={(val) => setValue('deliveryMethod', val as 'delivery' | 'pickup')}
                            className="grid grid-cols-1 gap-4"
                        >
                            <div>
                                <RadioGroupItem value="delivery" id="delivery" className="peer sr-only" />
                                <Label
                                    htmlFor="delivery"
                                    className="flex items-start gap-4 rounded-lg border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-emerald-600 peer-data-[state=checked]:bg-emerald-50 cursor-pointer transition-all"
                                >
                                    <div className="p-2 bg-white rounded-md border border-slate-100 shadow-sm shrink-0">
                                        <Truck className={`w-5 h-5 ${watchedDeliveryMethod === 'delivery' ? 'text-emerald-600' : 'text-slate-400'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-semibold text-slate-900">Delivery to my location</span>
                                            {watchedDeliveryMethod === 'delivery' && deliveryInfo && (
                                                <div className="flex flex-col items-end">
                                                    <span className={`font-bold ${deliveryInfo.fee === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                                                        {deliveryInfo.fee === 0 ? 'Free' : `$${deliveryInfo.fee.toFixed(2)}`}
                                                    </span>
                                                    {deliveryInfo.fee > 0 && deliveryInfo.threshold && (
                                                        <span className="text-[10px] text-slate-500 font-normal">
                                                            Free over ${deliveryInfo.threshold}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-500 mb-2">Calculated based on your zone.</p>
                                        
                                        {watchedDeliveryMethod === 'delivery' && deliveryInfo && (
                                            <div className="text-xs bg-emerald-100/50 text-emerald-800 p-2 rounded border border-emerald-100 inline-block font-medium">
                                                Estimated delivery: {deliveryInfo.date}
                                            </div>
                                        )}
                                    </div>
                                </Label>
                            </div>

                            <div>
                                <RadioGroupItem value="pickup" id="pickup" className="peer sr-only" />
                                <Label
                                    htmlFor="pickup"
                                    className="flex items-start gap-4 rounded-lg border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-emerald-600 peer-data-[state=checked]:bg-emerald-50 cursor-pointer transition-all"
                                >
                                    <div className="p-2 bg-white rounded-md border border-slate-100 shadow-sm shrink-0">
                                        <Store className={`w-5 h-5 ${watchedDeliveryMethod === 'pickup' ? 'text-emerald-600' : 'text-slate-400'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-semibold text-slate-900">Pickup from Warehouse</span>
                                            <span className="font-bold text-slate-900 text-emerald-600">Free</span>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-2">Pick up your order directly from us.</p>
                                        
                                        {watchedDeliveryMethod === 'pickup' && (
                                            <div className="text-xs bg-emerald-100/50 text-emerald-800 p-2 rounded border border-emerald-100 inline-block font-medium">
                                                Location: Minneapolis, MN • Ready: Tomorrow
                                            </div>
                                        )}
                                    </div>
                                </Label>
                            </div>
                        </RadioGroup>
                      </div>

                      <Separator />

                      {/* Items Review */}
                      <div>
                         <h3 className="font-medium text-slate-900 mb-3">Order Items ({items.length})</h3>
                         <div className="space-y-3">
                           {items.map((item) => (
                              <div key={item.product.id} className="flex gap-4 items-center bg-white border border-slate-100 p-3 rounded-lg">
                                 <div className="w-12 h-12 bg-slate-100 rounded-md overflow-hidden shrink-0">
                                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm text-slate-900 truncate">{item.product.name}</h4>
                                    <p className="text-xs text-slate-500">{item.quantity} x ${item.lockedPrice.toFixed(2)}</p>
                                 </div>
                                 <div className="font-semibold text-sm text-slate-900">
                                    ${(item.quantity * item.lockedPrice).toFixed(2)}
                                 </div>
                              </div>
                           ))}
                         </div>
                      </div>
                   </CardContent>
                   <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={handleBack}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                      </Button>
                      <Button 
                        className="bg-emerald-700 hover:bg-emerald-800"
                        onClick={handleNext}
                      >
                         Continue to Payment <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                   </CardFooter>
                 </Card>
              )}

              {currentStep === 3 && (
                 <Card>
                   <CardHeader>
                     <CardTitle>Payment & Confirmation</CardTitle>
                     <CardDescription>Securely complete your purchase.</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-6">
                      <div className="p-4 border border-emerald-100 bg-emerald-50/50 rounded-lg flex items-start gap-3">
                         <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5" />
                         <div>
                            <h4 className="text-sm font-semibold text-emerald-900">Secure 256-bit SSL Encryption</h4>
                            <p className="text-xs text-emerald-800/80">Your payment information is encrypted and processed securely. We do not store your credit card details.</p>
                         </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Payment Method</Label>
                          <RadioGroup 
                            defaultValue="card" 
                            value={formData.paymentMethod} 
                            onValueChange={(val) => setValue('paymentMethod', val as 'card' | 'invoice' | 'net30')}
                            className="grid grid-cols-1 gap-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="card" id="card" />
                              <Label htmlFor="card" className="font-normal cursor-pointer">Credit Card</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="invoice" id="invoice" />
                              <Label htmlFor="invoice" className="font-normal cursor-pointer">Invoice</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="net30" id="net30" />
                              <Label htmlFor="net30" className="font-normal cursor-pointer">Net 30</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {formData.paymentMethod === 'card' && (
                          <>
                            <div className="space-y-2">
                              <Label>Cardholder Name</Label>
                              <Input placeholder="Name on card" />
                            </div>
                            <div className="space-y-2">
                              <Label>Card Number</Label>
                              <div className="relative">
                                <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input className="pl-9" placeholder="0000 0000 0000 0000" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Expiration</Label>
                                <Input placeholder="MM/YY" />
                              </div>
                              <div className="space-y-2">
                                <Label>CVC</Label>
                                <Input placeholder="123" />
                              </div>
                            </div>
                          </>
                        )}

                        {formData.paymentMethod !== 'card' && (
                          <div className="p-4 border border-slate-200 bg-slate-50 rounded-lg">
                            <p className="text-sm text-slate-600">
                              {formData.paymentMethod === 'invoice' 
                                ? 'An invoice will be sent to your email address for payment.'
                                : 'Net 30 terms apply. Payment due within 30 days of delivery.'}
                            </p>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="deliveryInstructions">Delivery Instructions (Optional)</Label>
                          <textarea
                            id="deliveryInstructions"
                            className="w-full min-h-[80px] rounded-md border border-slate-200 px-3 py-2 text-sm resize-none"
                            placeholder="Special delivery instructions, gate codes, etc."
                            {...register('deliveryInstructions')}
                          />
                        </div>
                      </div>
                   </CardContent>
                   <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={handleBack} disabled={loading || isSubmitting}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                      </Button>
                      <Button 
                        className="bg-emerald-700 hover:bg-emerald-800 min-w-[150px]"
                        onClick={handleSubmit(onSubmit)}
                        disabled={loading || isSubmitting}
                      >
                         {loading || isSubmitting ? 'Processing...' : `Pay $${orderTotal.toFixed(2)}`}
                      </Button>
                   </CardFooter>
                 </Card>
              )}
            </motion.div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4">
             <div className="sticky top-24">
                <Card className="bg-slate-50 border-slate-200">
                   <CardHeader>
                      <CardTitle className="text-lg">Order Summary</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                         <span className="text-slate-500">Subtotal</span>
                         <span className="font-medium">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                         <span className="text-slate-500">Shipping {watchedDeliveryMethod === 'pickup' ? '(Handling)' : '(Zone based)'}</span>
                         <span className={`font-medium ${shipping === 0 ? 'text-emerald-600' : ''}`}>
                            {shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}
                         </span>
                      </div>
                      <div className="flex justify-between text-sm">
                         <span className="text-slate-500">Taxes (Estimated)</span>
                         <span className="font-medium">$0.00</span>
                      </div>
                      <Separator className="bg-slate-200" />
                      <div className="flex justify-between text-base font-bold text-slate-900">
                         <span>Total</span>
                         <span>${orderTotal.toFixed(2)}</span>
                      </div>
                   </CardContent>
                   <CardFooter className="bg-slate-100/50 p-4 border-t border-slate-200 rounded-b-lg">
                      <p className="text-xs text-slate-500 text-center w-full">
                         By placing this order, you agree to VitalLogistics Terms of Service and Wholesale Agreement.
                      </p>
                   </CardFooter>
                </Card>
             </div>
          </div>
       </div>
    </div>
  );
}