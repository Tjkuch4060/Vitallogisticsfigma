import { ClipboardCheck, ShoppingCart, Truck } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export function Process() {
  const steps = [
    {
      icon: ClipboardCheck,
      title: "Apply & Get Verified",
      description: "Submit your LPHE-R license for verification. Our team reviews applications within 24-48 hours.",
      bg: "bg-emerald-100/50",
      iconColor: "text-emerald-700"
    },
    {
      icon: ShoppingCart,
      title: "Browse & Order",
      description: "Access our full catalog of hemp products from top brands. Add items to cart and checkout securely.",
      bg: "bg-emerald-100/50",
      iconColor: "text-emerald-700"
    },
    {
      icon: Truck,
      title: "Receive & Sell",
      description: "Choose pickup or zone-based delivery. Track your order from warehouse to your store.",
      bg: "bg-emerald-100/50",
      iconColor: "text-emerald-700"
    }
  ];

  return (
    <section className="py-16 md:py-32 bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.05] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#059669_2px,transparent_2px)] [background-size:40px_40px]" />
      </div>

      <div className="container mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-600 sm:bg-gradient-to-r sm:from-emerald-600 sm:to-teal-600 text-white text-[11px] font-bold uppercase tracking-[0.2em] mb-6 shadow-md ring-2 ring-emerald-500/30">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                Simplified Onboarding
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">How It Works</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
                We've streamlined the verification and ordering process to get your store stocked with premium hemp products in record time.
            </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-emerald-300 z-0" />

          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                {/* Numbered Circle */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center text-3xl font-black shadow-xl mb-12 transform group-hover:scale-110 transition-transform duration-500 ring-8 ring-slate-50 relative z-10">
                  {index + 1}
                </div>

                <Card className="border-none shadow-sm bg-white rounded-[32px] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 w-full">
                  <CardContent className="p-10 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-8 group-hover:bg-emerald-100 transition-colors">
                      <step.icon size={48} className="text-emerald-600 group-hover:rotate-6 transition-all" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                        {step.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-base">
                      {step.description}
                    </p>

                    <div className="mt-8 pt-8 border-t border-slate-50 w-full flex justify-center">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                                    <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                                        <div className="w-4 h-4 bg-emerald-200 rounded-full animate-pulse" />
                                    </div>
                                </div>
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-emerald-600 flex items-center justify-center text-[10px] font-bold text-white">
                                +12
                            </div>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
