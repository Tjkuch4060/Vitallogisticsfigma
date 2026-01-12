import React from 'react';
import { ClipboardCheck, ShoppingCart, Truck } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export function Process() {
  const steps = [
    {
      icon: ClipboardCheck,
      title: "1. Apply & Get Verified",
      description: "Submit your LPHE-R license for verification. Our team reviews applications within 24-48 hours.",
      bg: "bg-emerald-100/50",
      iconColor: "text-emerald-700"
    },
    {
      icon: ShoppingCart,
      title: "2. Browse & Order",
      description: "Access our full catalog of hemp products from top brands. Add items to cart and checkout securely.",
      bg: "bg-emerald-100/50",
      iconColor: "text-emerald-700"
    },
    {
      icon: Truck,
      title: "3. Receive & Sell",
      description: "Choose pickup or zone-based delivery. Track your order from warehouse to your store.",
      bg: "bg-emerald-100/50",
      iconColor: "text-emerald-700"
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-slate-600">Get started with VitalLogistics in three simple steps</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="border-none shadow-none bg-transparent relative group">
              <CardContent className="p-0">
                <div className="bg-white border border-slate-100 rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-lg hover:border-emerald-100/50 relative overflow-hidden">
                  
                   {/* Top Right Decorative Circle (from screenshot) */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-50 rounded-full" />
                  
                  <div className={`w-14 h-14 rounded-xl ${step.bg} flex items-center justify-center mb-6 relative z-10`}>
                    <step.icon className={`w-7 h-7 ${step.iconColor}`} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed relative z-10 text-sm">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
