import React from 'react';
import { Box, FileCheck, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Box,
      title: "Consignment Model",
      description: "We handle inventory and fulfillment. You focus on selling. 70% goes to brands, 30% to VitalLogistics."
    },
    {
      icon: FileCheck,
      title: "Full Compliance",
      description: "All products include lab test results (CoA). License verification ensures only authorized retailers."
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      description: "Stripe-powered payments with PCI compliance. Automatic brand payouts and transparent pricing."
    },
    {
      icon: MapPin,
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
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Features List */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12">Why Choose VitalLogistics?</h2>
            
            <div className="space-y-10">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-100/50 flex items-center justify-center text-emerald-800">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card - Ready to Get Started */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100 sticky top-24">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Ready to Get Started?</h3>
            
            <div className="space-y-6 mb-8">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                     <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-slate-700 font-medium">{req}</span>
                </div>
              ))}
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <p className="text-sm text-slate-500 mb-0">
                    Join hundreds of retailers growing their business with VitalLogistics.
                </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
