import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import heroImage from '../assets/hero-gantt-chart.png';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans text-text-main selection:bg-primary/10 selection:text-primary">
      <Navbar />
      <main>
        <Hero />
        <ValueProps />
        <HowItWorks />
        <UseCases />
        <Testimonials />
        <Pricing />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
}


function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <img src={logo} alt="Plixa Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold tracking-tight text-navy">Plixa</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-text-muted hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-text-muted hover:text-primary transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm font-medium text-text-muted hover:text-primary transition-colors">Pricing</a>
            <a href="#use-cases" className="text-sm font-medium text-text-muted hover:text-primary transition-colors">Use Cases</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/auth" className="hidden sm:block text-sm font-semibold text-text-main hover:text-primary transition-colors">
            Sign In
          </Link>
          <Link to="/board" className="btn-primary py-2 px-5 text-sm">
            Start Whiteboarding
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden text-center lg:text-left">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now with WebRTC Low-Latency
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-navy sm:text-6xl md:text-7xl leading-[1.1]">
              Real-Time Collaborative <br />
              <span className="text-primary italic">Whiteboard</span>
            </h1>
            <p className="mt-8 text-xl text-text-muted leading-relaxed max-w-xl mx-auto lg:mx-0">
              Instant collaboration for remote teams and educators. Zero lag, no downloads, and crystal clear precision—built with WebRTC.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/board" className="btn-primary text-base px-8 py-4">
                Create a Board Free
              </Link>
              <a href="#how-it-works" className="btn-secondary text-base px-8 py-4">
                See How It Works
              </a>
            </div>
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm text-text-muted">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/100?u=${i}`}
                    className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-border"
                    alt="User"
                  />
                ))}
              </div>
              <span>Trusted by 5,000+ teams</span>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10 glass-card p-2 lg:p-4 rotate-1 lg:rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src={heroImage}
                alt="Social Media Strategy Development Gantt Chart"
                className="rounded-xl shadow-inner bg-white w-full aspect-[16/10] object-contain"
              />
            </div>
            {/* Geometric accents */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-navy/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ValueProps() {
  return (
    <section id="features" className="py-24 bg-bg-light">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Everything you need, nothing you don't.
          </h2>
          <p className="mt-4 text-lg text-text-muted leading-relaxed">
            We stripped away the complexity to give you the most fluid whiteboarding experience on the web.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<IconCursor className="w-8 h-8" />}
            title="Real-time Sync"
            description="See cursors and strokes update in milliseconds with our WebRTC mesh network."
          />
          <FeatureCard
            icon={<IconShapes className="w-8 h-8" />}
            title="Pro Tools"
            description="Complete set of shapes, arrows, and text tools for professional-grade diagrams."
          />
          <FeatureCard
            icon={<IconShield className="w-8 h-8" />}
            title="Encrypted"
            description="Your boards are private and encrypted. No data is stored on our servers unless you save it."
          />
          <FeatureCard
            icon={<IconZap className="w-8 h-8" />}
            title="Browser Based"
            description="No apps to download. Share a link and your team is in the board instantly."
          />
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl mb-16">Set up in seconds</h2>
        <div className="grid md:grid-cols-3 gap-12 relative">
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
          <div className="hidden lg:block absolute top-12 left-[15%] right-[15%] h-px border-t border-dashed border-border -z-10"></div>
        </div>
      </div>
    </section>
  );
}

function UseCases() {
  return (
    <section id="use-cases" className="py-24 bg-bg-light border-y border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">Built for the future of work</h2>
            <p className="mt-6 text-lg text-text-muted leading-relaxed">
              Whether you're teaching a class or architecting a software system, Plixa provides the perfect medium for visual communication.
            </p>
            <div className="mt-10 space-y-6">
              {[
                { title: 'Remote Teams', text: 'Run retrospectives and plan sprints with ease.' },
                { title: 'Educators & Tutors', text: 'Bridge the distance gap with interactive lessons.' },
                { title: 'System Design', text: 'Architect complex systems for technical interviews.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-none w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <IconCheck className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy">{item.title}</h3>
                    <p className="text-text-muted">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
              alt="Use Case"
              className="w-full h-96 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-navy text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center text-white">
        <div className="mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">Loved by innovators</h2>
          <div className="flex justify-center gap-1 text-primary">
            {[1, 2, 3, 4, 5].map(i => <IconStar key={i} className="w-6 h-6 fill-current" />)}
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <TestimonialCard
            quote="The lowest latency I've ever seen. It actually feels like we're drawing on the same physical board."
            author="Alex Rivers"
            role="Design Lead at Meta"
          />
          <TestimonialCard
            quote="Plixa has completely transformed how I teach system design. My students can participate actively."
            author="Dr. Sarah Jenkins"
            role="CS Professor"
          />
          <TestimonialCard
            quote="Clean, minimal, and insanely fast. It's the only tool my team uses for our weekly syncs."
            author="James Carter"
            role="CTO, StartupX"
          />
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">Simple, honest pricing</h2>
          <p className="mt-4 text-lg text-text-muted">Start for free, upgrade as you grow.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="p-10 rounded-3xl border border-border bg-white flex flex-col items-center">
            <h3 className="text-lg font-bold text-navy">Personal</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight text-navy">$0</span>
              <span className="text-sm font-semibold text-text-muted">/forever</span>
            </div>
            <p className="mt-6 text-text-muted text-center">Perfect for students and occasional collaborators.</p>
            <ul className="mt-8 space-y-4 text-sm text-text-muted w-full">
              <li className="flex gap-3"><IconCheck className="w-5 h-5 text-primary" /> Infinite Canvas</li>
              <li className="flex gap-3"><IconCheck className="w-5 h-5 text-primary" /> Up to 3 Participants</li>
              <li className="flex gap-3"><IconCheck className="w-5 h-5 text-primary" /> Real-time Chat</li>
            </ul>
            <Link to="/auth" className="btn-secondary w-full mt-10">Get Started</Link>
          </div>
          <div className="p-10 rounded-3xl border-2 border-primary bg-white shadow-premium relative flex flex-col items-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider">Most Popular</div>
            <h3 className="text-lg font-bold text-navy">Pro Team</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight text-navy">$12</span>
              <span className="text-sm font-semibold text-text-muted">/month</span>
            </div>
            <p className="mt-6 text-text-muted text-center">Everything in personal, plus advanced team features.</p>
            <ul className="mt-8 space-y-4 text-sm text-text-muted w-full">
              <li className="flex gap-3"><IconCheck className="w-5 h-5 text-primary" /> Unlimited Participants</li>
              <li className="flex gap-3"><IconCheck className="w-5 h-5 text-primary" /> Cloud Persistence</li>
              <li className="flex gap-3"><IconCheck className="w-5 h-5 text-primary" /> Priority Support</li>
            </ul>
            <Link to="/auth" className="btn-primary w-full mt-10">Start 14-day Trial</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function BottomCTA() {
  return (
    <section className="py-24 bg-bg-light">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 lg:flex lg:items-center lg:justify-between glass-card p-12 overflow-hidden relative">
        <div className="relative z-10 lg:max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">Ready to start collaborating?</h2>
          <p className="mt-4 text-lg text-text-muted">Join thousands of creators who bring their ideas to life with Plixa.</p>
        </div>
        <div className="mt-10 lg:mt-0 lg:flex-shrink-0 relative z-10">
          <Link to="/board" className="btn-primary text-lg px-10 py-4">Start Whiteboarding Free</Link>
        </div>
        {/* Decorative circle */}
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2 -z-0"></div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-border py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-24 mb-16">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img src={logo} alt="Plixa Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold tracking-tight text-navy">Plixa</span>
            </Link>
            <p className="text-text-muted text-sm max-w-xs leading-relaxed">
              Professional real-time collaboration for the modern web. Built with WebRTC for ultimate performance and security.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-navy h-8 flex items-center mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-text-muted">
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#testimonials" className="hover:text-primary transition-colors">Testimonials</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-navy h-8 flex items-center mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-text-muted">
              <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Plixa. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="/board/global" target="_blank" rel="noopener noreferrer" aria-label="Twitter Profile">
              <IconTwitter className="w-5 h-5 text-text-muted hover:text-primary cursor-pointer transition-colors" />
            </a>
            <a href="https://github.com/sayandeepdas02/Plixa-Meetups" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
              <IconGithub className="w-5 h-5 text-text-muted hover:text-primary cursor-pointer transition-colors" />
            </a>
          </div>
        </div>
      </div>
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
      <p className="text-text-muted leading-relaxed text-sm">{description}</p>
    </div>
  );
}

function Step({ number, title, description }) {
  return (
    <div className="relative group">
      <div className="w-16 h-16 rounded-2xl bg-white shadow-soft border border-border flex items-center justify-center text-primary font-bold text-xl mx-auto mb-8 group-hover:bg-primary group-hover:text-white transition-colors">
        {number}
      </div>
      <h3 className="text-xl font-bold text-navy mb-4">{title}</h3>
      <p className="text-text-muted leading-relaxed text-sm max-w-xs mx-auto">{description}</p>
    </div>
  );
}

function TestimonialCard({ quote, author, role }) {
  return (
    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-left">
      <div className="text-primary text-4xl mb-6 font-serif opacity-50">“</div>
      <p className="text-lg italic text-slate-300 mb-8 leading-relaxed">{quote}</p>
      <div>
        <div className="font-bold text-white">{author}</div>
        <div className="text-sm text-slate-400">{role}</div>
      </div>
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
