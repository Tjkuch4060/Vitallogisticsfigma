import { Hero } from '../components/Hero';
import { Process } from '../components/Process';
import { Features } from '../components/Features';
import { CTA } from '../components/CTA';

export function LandingPage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <div className="h-px bg-emerald-100 mx-auto max-w-7xl w-full" />
      <Process />
      <div className="h-px bg-emerald-100 mx-auto max-w-7xl w-full" />
      <Features />
      <CTA />
    </div>
  );
}
