import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import heroImage from '../assets/hero-gantt-chart.png';
import { FeatureDemo } from '../components/feature-demo';
import { HeroDemo } from '../components/hero-demo';
import { Pricing as NewPricing } from '../components/ui/pricing-cards';
import { TestimonialDemo } from '../components/testimonial-demo';
import { Button } from '@/components/ui/button';
import { SectionWrapper } from '../components/layout/SectionWrapper';
import { Container } from '../components/layout/Container';
import { HeadingBlock } from '../components/layout/HeadingBlock';
import { ThemeToggle } from '../components/theme-toggle';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/10 selection:text-primary">
      <Navbar />
      <main>
        <HeroDemo />
        <FeatureDemo />
        <HowItWorks />
        <UseCases />
        <TestimonialDemo />
        <NewPricing />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
}


function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <img src={logo} alt="Plixa Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold tracking-tight text-foreground">Plixa</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#use-cases" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Use Cases</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/auth" className="hidden sm:block text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
            Sign In
          </Link>
          <Link to="/board">
            <Button>
              Start Whiteboarding
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}





function HowItWorks() {
  return (
    <SectionWrapper variant="default" id="how-it-works">
      <Container>
        <HeadingBlock 
          title="Set up in seconds"
          subtitle="No complex configurations or onboarding. Just instantly collaborative whiteboards mapped to immutable links."
          align="center"
        />
        <div className="grid md:grid-cols-3 gap-12 relative mt-24">
          <Step
            number="01"
            title="Create a Board"
            description="One click is all it takes to initialize a secure, high-speed drawing canvas."
          />
          <Step
            number="02"
            title="Share the Link"
            description="Copy the board link and send it to your team. No logins required for guests."
          />
          <Step
            number="03"
            title="Collaborate Instantly"
            description="Watch as everyone's cursors appear. Brainstorm and iterate together in real-time."
          />
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px border-t-2 border-dashed border-border -z-10"></div>
        </div>
      </Container>
    </SectionWrapper>
  );
}

function UseCases() {
  return (
    <SectionWrapper variant="muted" id="use-cases">
      <Container>
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <HeadingBlock 
              title="Built for the future of work"
              subtitle="Whether you're teaching a class or architecting a software system, Plixa provides the perfect medium."
              align="left"
            />
            <div className="mt-12 space-y-8">
              {[
                { title: 'Remote Teams', text: 'Run retrospectives and plan sprints with ease using visual spatial layouts.' },
                { title: 'Educators & Tutors', text: 'Bridge the distance gap with interactive, infinite-canvas lessons.' },
                { title: 'System Design', text: 'Architect complex systems for technical interviews in real-time.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6 group cursor-default">
                  <div className="flex-none w-10 h-10 rounded-xl bg-primary/5 dark:bg-primary/10 shadow-sm border border-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg tracking-tight mb-1">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-400/20 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-card border border-border/60 rounded-[2rem] p-4 shadow-2xl overflow-hidden aspect-[4/3]">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-blue-50 dark:from-primary/5 dark:to-blue-950/30 flex items-center justify-center">
                 <div className="w-3/4 h-3/4 rounded-xl border border-border bg-card shadow-sm flex flex-col overflow-hidden">
                    <div className="h-8 border-b border-border/50 bg-muted/50 flex items-center px-3 gap-2">
                       <div className="w-2.5 h-2.5 rounded-full bg-primary/30"></div><div className="w-2.5 h-2.5 rounded-full bg-border"></div>
                    </div>
                    <div className="flex-1 p-6 relative">
                       <div className="w-32 h-20 bg-primary/5 rounded-lg absolute top-6 left-6 border border-primary/10"></div>
                       <div className="w-24 h-24 bg-primary/5 rounded-full absolute top-12 right-12 border border-primary/10"></div>
                       <svg className="absolute inset-0 w-full h-full text-primary/20 stroke-2" fill="none"><path d="M152 70 Q 200 70 240 100" stroke="currentColor"/></svg>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}

function BottomCTA() {
  return (
    <SectionWrapper variant="dark" className="bg-[#0b0f19] p-0 lg:p-0">
      <div className="py-20 lg:py-32">
        <Container>
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/50 p-12 md:p-20 text-center shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#3b82f620_0%,transparent_60%)]"></div>
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <h2 className="text-4xl md:text-6xl tracking-tighter text-slate-50 font-medium mb-6">
                Ready to start collaborating?
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed mb-10 balance-text">
                Join thousands of creators who bring their ideas to life with Plixa. No credit card required.
              </p>
              <Link to="/board">
                 <Button size="lg" className="h-14 px-8 text-lg shadow-[0_4px_16px_rgba(37,99,235,0.4)]">
                   Start Whiteboarding Free
                 </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </SectionWrapper>
  );
}

function Footer() {
  return (
    <footer className="bg-background border-t border-border py-16">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-24 mb-16">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 transition-opacity hover:opacity-80">
              <img src={logo} alt="Plixa Logo" className="h-8 w-auto" />
              <span className="text-xl font-medium tracking-tight text-foreground">Plixa</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Professional real-time collaboration for the modern web. Built for speed, performance, and ultimate security.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
              <li><a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Plixa Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="/board/global" target="_blank" rel="noopener noreferrer" aria-label="Twitter Profile">
              <IconTwitter className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            </a>
            <a href="https://github.com/sayandeepdas02/Plixa-Meetups" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
              <IconGithub className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="p-8 rounded-2xl bg-white border border-border hover:border-primary/20 hover:shadow-premium transition-all group">
      <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-navy mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
    </div>
  );
}

function Step({ number, title, description }) {
  return (
    <div className="relative group flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/5 dark:bg-primary/10 shadow-md border border-primary/10 flex items-center justify-center text-primary font-semibold text-xl mb-8 group-hover:-translate-y-1 transition-all duration-300">
        {number}
      </div>
      <h3 className="text-xl font-medium tracking-tight mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-base max-w-sm">{description}</p>
    </div>
  );
}




function IconCursor(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 13l6 6" />
    </svg>
  );
}

function IconShapes(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM9 19H5a1 1 0 01-1-1v-4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1zM19 19h-4a1 1 0 01-1-1v-4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1z" />
    </svg>
  );
}

function IconZap(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function IconShield(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function IconCheck(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function IconStar(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function IconTwitter(props) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.48.75 2.78 1.89 3.55-.7-.03-1.35-.22-1.92-.53v.05c0 2.05 1.46 3.75 3.39 4.14-.36.1-.73.15-1.1.15-.27 0-.53-.02-.79-.08.54 1.68 2.1 2.9 3.95 2.93-1.45 1.13-3.27 1.81-5.25 1.81-.34 0-.67-.02-1-.06 1.88 1.21 4.11 1.91 6.5 1.91 7.8 0 12.07-6.46 12.07-12.07 0-.18 0-.36-.01-.54.83-.59 1.55-1.33 2.12-2.17z" />
    </svg>
  );
}

function IconGithub(props) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}
