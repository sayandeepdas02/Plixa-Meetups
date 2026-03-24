import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionWrapper } from "../layout/SectionWrapper";
import { Container } from "../layout/Container";
import { Link } from "react-router-dom";
import heroImage from "../../assets/hero-space.png";

function Hero() {
  return (
    <SectionWrapper className="relative flex items-center justify-center pt-32 pb-40 overflow-hidden bg-background">
      {/* Premium subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      {/* Blue radial glow — brand accent */}
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[400px] w-[400px] rounded-full bg-blue-500/10 opacity-60 blur-[120px]"></div>
      <div className="absolute right-1/4 top-1/3 -z-10 h-[200px] w-[200px] rounded-full bg-blue-400/8 opacity-40 blur-[80px]"></div>

      <Container className="relative z-10 flex flex-col items-center text-center">
        <Badge variant="outline" className="mb-8 px-4 py-1.5 text-sm rounded-full border-primary/20 bg-primary-light/50 dark:bg-primary/10 backdrop-blur-md text-primary shadow-sm">
          Plixa 2.0 is live
        </Badge>
        
        <h1 className="max-w-4xl text-5xl md:text-7xl lg:text-[5rem] tracking-tighter font-medium text-foreground leading-[1.1] mb-8">
          The collaborative canvas for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">modern teams.</span>
        </h1>
        
        <p className="max-w-2xl text-xl md:text-2xl text-muted-foreground leading-relaxed balance-text mb-12">
          Experience low-latency whiteboarding with extreme precision. 
          Built for system designers, educators, and product teams to move faster, together.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-24 w-full sm:w-auto">
          <Link to="/board" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base">
              Start Whiteboarding <MoveRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <a href="#how-it-works" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base">
              See how it works
            </Button>
          </a>
        </div>

        {/* Polished Product Mockup */}
        <div className="w-full max-w-5xl rounded-2xl md:rounded-[2rem] border border-border/50 bg-background/40 dark:bg-card/30 p-2 md:p-4 backdrop-blur-3xl shadow-xl">
          <div className="relative aspect-video w-full rounded-xl md:rounded-2xl border border-border/50 bg-[#0b0f19] overflow-hidden shadow-2xl">
            {/* macOS window controls mock */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-[#111827] border-b border-white/10 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            {/* Canvas mockup body */}
            <div className="absolute top-10 inset-x-0 bottom-0 bg-black flex items-center justify-center overflow-hidden">
               <img src={heroImage} alt="Plixa Canvas Interface" className="w-full h-full object-cover object-top opacity-90 hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}

export { Hero };
