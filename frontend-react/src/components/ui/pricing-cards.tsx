import { Check } from "lucide-react";
import { SectionWrapper } from "../layout/SectionWrapper";
import { Container } from "../layout/Container";
import { HeadingBlock } from "../layout/HeadingBlock";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function Pricing() {
  return (
    <SectionWrapper variant="muted" id="pricing">
      <Container>
        <HeadingBlock 
          badge="Pricing"
          title="Simple, transparent pricing."
          subtitle="Everything you need, nothing you don't. Start for free and scale as your team grows."
          align="center"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16 items-center">
          {/* Startup */}
          <Card className="p-8 flex flex-col gap-8 bg-background shadow-sm border border-border">
            <div>
              <h3 className="text-2xl font-medium tracking-tight mb-2">Startup</h3>
              <p className="text-muted-foreground">Perfect for small teams and independent creators getting started.</p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-medium tracking-tighter text-foreground">$12</span>
              <span className="text-muted-foreground">/mo</span>
            </div>
            <div className="flex flex-col gap-4 mt-4">
              {['Unlimited boards', 'Up to 10 team members', '7-day version history'].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="bg-primary/5 dark:bg-primary/10 p-1 rounded-full text-primary/70"><Check className="w-3 h-3" /></div>
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 h-12">Start for free</Button>
          </Card>

          {/* Growth - Highlighted */}
          <div className="relative z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
              <Badge className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold tracking-widest uppercase rounded-full shadow-md border-0">Most Popular</Badge>
            </div>
            <Card className="p-10 flex flex-col gap-8 bg-primary/[0.02] dark:bg-primary/[0.05] shadow-2xl border-2 border-primary ring-1 ring-primary/20 scale-105 rounded-[1.5rem]">
              <div>
                <h3 className="text-2xl font-medium tracking-tight mb-2">Growth</h3>
                <p className="text-muted-foreground">For scaling organizations that need robust access controls and history.</p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-medium tracking-tighter text-foreground">$49</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <div className="flex flex-col gap-4 mt-4">
                {['Everything in Startup', 'Unlimited team members', 'Unlimited version history', 'SSO Authentication'].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="bg-primary/10 p-1.5 rounded-full text-primary"><Check className="w-3 h-3" /></div>
                    <span className="text-sm text-foreground font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 h-12 shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]">Sign up today</Button>
            </Card>
          </div>

          {/* Enterprise */}
          <Card className="p-8 flex flex-col gap-8 bg-background shadow-sm border border-border">
            <div>
              <h3 className="text-2xl font-medium tracking-tight mb-2">Enterprise</h3>
              <p className="text-muted-foreground">Custom deployments, advanced compliance, and priority support.</p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-medium tracking-tighter text-foreground">Custom</span>
            </div>
            <div className="flex flex-col gap-4 mt-4">
              {['Dedicated VPC deployment', 'SLA guarantees', 'Advanced audit logs', 'Dedicated success manager'].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="bg-primary/5 dark:bg-primary/10 p-1 rounded-full text-primary/70"><Check className="w-3 h-3" /></div>
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 h-12">Contact Sales</Button>
          </Card>

        </div>
      </Container>
    </SectionWrapper>
  );
}

export { Pricing };
