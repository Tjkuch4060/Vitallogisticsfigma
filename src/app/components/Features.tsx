import React from 'react';
import { Box, ShieldCheck, CreditCard, Truck, CheckCircle2 } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Box,
      title: "Consignment Model",
      description: "We handle inventory and fulfillment. You focus on selling. 70% goes to brands, 30% to VitalLogistics."
    },
    {
      icon: ShieldCheck,
      title: "Full Compliance",
      description: "All products include lab test results (CoA). License verification ensures only authorized retailers."
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Stripe-powered payments with PCI compliance. Automatic brand payouts and transparent pricing."
    },
    {
      icon: Truck,
      title: "Zone-Based Delivery",
      description: "Scheduled deliveries by zone or pickup from our warehouse. Transparent pricing with no surprises."
    }
  ];

  const requirements = [
    "Valid LPHE-R license required",
    "Minnesota-based retailers welcome",
    "No minimum order requirements",
    "24-48 hour approval process"
  ];

  return (
    <section className="py-16 md:py-32 bg-slate-50 relative overflow-hidden">
      {/* Decorative Topography Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm66 3c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-46-45c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm26 18c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm16-34c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM21 45c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm19 24c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z' fill='%23059669' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>

      <div className="container mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-start">
          
          {/* Features List */}
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-12 md:mb-16 tracking-tight">Why Choose VitalLogistics?</h2>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex gap-8 group p-8 bg-white border-l-4 border-emerald-500 rounded-r-2xl transition-all duration-300 hover:bg-emerald-50 hover:shadow-md"
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-200 transition-colors">
                    <feature.icon size={40} className="group-hover:text-emerald-700 group-hover:rotate-6 transition-all" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card - Ready to Get Started */}
          <div className="bg-white rounded-[32px] p-10 md:p-14 shadow-xl shadow-emerald-900/5 border border-slate-100 sticky top-32">
            <h3 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">Ready to Get Started?</h3>
            
            <div className="space-y-8 mb-12">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-4 group">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 flex-shrink-0 border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                     <CheckCircle2 size={16} className="group-hover:rotate-6 transition-transform" />
                  </div>
                  <span className="text-slate-700 font-bold text-lg">{req}</span>
                </div>
              ))}
            </div>

            <div className="p-6 bg-emerald-100/30 rounded-xl border border-emerald-100 text-center">
                <p className="text-sm text-slate-700 mb-0 leading-[1.7]">
                    Join hundreds of retailers growing their business with VitalLogistics.
                </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
