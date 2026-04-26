import React from 'react';
import { Features } from '../components/ui/features-4';
import { Features10 } from '../components/ui/features-10';
import { HeroSection } from '../components/ui/hero-section-2';
import { Pricing1 } from '../components/ui/pricing-1';
import { TestimonialDemo } from '../components/testimonial-demo';
import { CinematicFooter } from '../components/ui/motion-footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/10 selection:text-primary">
      <main>
        <HeroSection />
        <Features />
        <Features10 />
        <TestimonialDemo />
        <Pricing1 />
      </main>
      <CinematicFooter />
    </div>
  );
}






