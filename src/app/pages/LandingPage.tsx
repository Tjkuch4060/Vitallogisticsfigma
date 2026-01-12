import React from 'react';
import { Hero } from '../components/Hero';
import { Process } from '../components/Process';
import { Features } from '../components/Features';
import { CTA } from '../components/CTA';

export function LandingPage() {
  return (
    <>
      <Hero />
      <Process />
      <Features />
      <CTA />
    </>
  );
}
