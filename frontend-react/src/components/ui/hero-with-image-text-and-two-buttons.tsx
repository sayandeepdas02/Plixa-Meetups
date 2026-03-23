import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionWrapper } from "../layout/SectionWrapper";
import { Container } from "../layout/Container";
import { Link } from "react-router-dom";

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
            <div className="absolute top-10 inset-x-0 bottom-0 bg-[radial-gradient(#ffffff22_1px,transparent_0)] bg-[size:24px_24px] flex items-center justify-center">
               <div className="text-slate-500 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center backdrop-blur-md">
                     <svg className="w-8 h-8 text-blue-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                  </div>
                  <span className="text-sm font-medium tracking-widest uppercase opacity-50">Interactive Canvas</span>
               </div>
               {/* Decorative floating elements */}
               <div className="absolute top-1/4 left-1/4 w-32 h-24 bg-blue-500/5 border border-blue-500/10 rounded-xl backdrop-blur-md shadow-2xl rotate-[-6deg]"></div>
               <div className="absolute bottom-1/4 right-1/4 w-40 h-32 bg-blue-500/5 border border-blue-500/10 rounded-xl backdrop-blur-md shadow-2xl rotate-[12deg]"></div>
            </div>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}

export { Hero };
