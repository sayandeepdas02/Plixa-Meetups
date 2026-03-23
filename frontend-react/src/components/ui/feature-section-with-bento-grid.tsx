import { Monitor, Zap, Shield, Users } from "lucide-react";
import { SectionWrapper } from "../layout/SectionWrapper";
import { Container } from "../layout/Container";
import { HeadingBlock } from "../layout/HeadingBlock";
import { Card } from "./card";

function Feature() {
  return (
    <SectionWrapper variant="muted">
      <Container>
        <HeadingBlock 
          badge="Platform"
          title="Everything you need to scale perfectly."
          subtitle="Built-in tools for teams of all sizes. Stop worrying about latency and start focusing on shipping."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <Card className="p-8 flex flex-col gap-6 bg-background">
            <div className="w-12 h-12 rounded-xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-medium tracking-tight mb-2">Zero Latency</h3>
              <p className="text-muted-foreground leading-relaxed">Our WebRTC architecture ensures drawing is instantly synchronized across all global participants.</p>
            </div>
          </Card>

          <Card className="p-8 flex flex-col gap-6 bg-background">
            <div className="w-12 h-12 rounded-xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-medium tracking-tight mb-2">Enterprise Security</h3>
              <p className="text-muted-foreground leading-relaxed">End-to-end encryption by default. Your intellectual property never sits exposed on our servers.</p>
            </div>
          </Card>

          <Card className="p-8 flex flex-col gap-6 bg-background">
            <div className="w-12 h-12 rounded-xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-medium tracking-tight mb-2">Infinite Scaling</h3>
              <p className="text-muted-foreground leading-relaxed">Support for thousands of concurrent viewers and dozens of active editors per session.</p>
            </div>
          </Card>

          <Card className="p-8 flex flex-col gap-6 bg-background">
            <div className="w-12 h-12 rounded-xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
              <Monitor className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-medium tracking-tight mb-2">Cross-Platform</h3>
              <p className="text-muted-foreground leading-relaxed">Works identically on web, tablet, and mobile browsers with native-feeling interaction.</p>
            </div>
          </Card>
        </div>
      </Container>
    </SectionWrapper>
  );
}

export { Feature };
