import { Cpu, Fingerprint, Layers, Settings2, Users, Zap } from 'lucide-react'

export function Features() {
    return (
        <section className="py-12 md:py-20 bg-background text-foreground">
            <div className="mx-auto max-w-5xl space-y-12 px-6">
                <div className="relative z-10 mx-auto max-w-2xl text-center space-y-4">
                    <h2 className="text-balance text-4xl font-medium tracking-tight lg:text-5xl">Engineered for seamless digital collaboration</h2>
                    <p className="text-muted-foreground text-lg px-4">
                        Plixa Meetups is a high-performance WebRTC ecosystem. Effortlessly transition between HD video calls, real-time whiteboarding, and lightning-fast messaging in a single view.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="glass-card p-8 group border border-border/50 hover:border-primary/30 transition-all hover:shadow-premium bg-card flex flex-col gap-4 relative overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Zap className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold tracking-tight">Zero Latency</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Our WebRTC architecture ensures drawing, audio, and video streams instantly synchronize across all global participants.
                        </p>
                    </div>

                    <div className="glass-card p-8 group border border-border/50 hover:border-primary/30 transition-all hover:shadow-premium bg-card flex flex-col gap-4 relative overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Cpu className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold tracking-tight">Infinite Scaling</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Robust infrastructure structured to support massive networking rooms and heavy concurrent traffic flawlessly without breaking.
                        </p>
                    </div>

                    <div className="glass-card p-8 group border border-border/50 hover:border-primary/30 transition-all hover:shadow-premium bg-card flex flex-col gap-4 relative overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Fingerprint className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold tracking-tight">Enterprise Security</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            End-to-end encryption by default ensures your organizational intellectual property never sits unencrypted on random databases.
                        </p>
                    </div>

                    <div className="glass-card p-8 group border border-border/50 hover:border-primary/30 transition-all hover:shadow-premium bg-card flex flex-col gap-4 relative overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Layers className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold tracking-tight">Cross-Platform</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Interacts seamlessly inside standard modern web, tablet, or mobile browsers maintaining a completely native, cohesive UI feel.
                        </p>
                    </div>

                    <div className="glass-card p-8 group border border-border/50 hover:border-primary/30 transition-all hover:shadow-premium bg-card flex flex-col gap-4 relative overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Settings2 className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold tracking-tight">Host Control</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Granular administrative configurations granting room creators and managers comprehensive control over session security perimeters.
                        </p>
                    </div>

                    <div className="glass-card p-8 group border border-border/50 hover:border-primary/30 transition-all hover:shadow-premium bg-card flex flex-col gap-4 relative overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Users className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold tracking-tight">Built for Teams</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Intelligently structured purely focusing on elevating multi-user collaborative experiences rather than isolated standalone work.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
