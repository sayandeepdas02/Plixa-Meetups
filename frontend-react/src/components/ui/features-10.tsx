import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
    Video,
    MessageSquare,
    PenTool,
    Shield,
    Zap,
    Users,
    LucideIcon,
} from 'lucide-react'
import { ReactNode } from 'react'

export function Features10() {
    return (
        <section id="product" className="bg-background py-16 md:py-32">
            <div className="mx-auto max-w-2xl px-6 lg:max-w-5xl">

                {/* Section label */}
                <div className="mb-10 flex flex-col items-center gap-4 text-center">
                    <span className="section-badge">Features</span>
                    <h2 className="text-balance text-4xl font-semibold tracking-tight lg:text-5xl">
                        Everything your team needs, in one view
                    </h2>
                    <p className="max-w-xl text-muted-foreground text-lg leading-relaxed">
                        HD video, infinite whiteboarding, and instant messaging — beautifully unified so you can focus on the work, not the toolstack.
                    </p>
                </div>

                <div className="mx-auto grid gap-4 lg:grid-cols-2">
                    {/* Card 1: HD Video */}
                    <FeatureCard>
                        <CardHeader className="pb-3">
                            <CardHeading
                                icon={Video}
                                title="HD Video Conferencing"
                                description="Crystal-clear WebRTC video calls with adaptive bitrate for flawless quality on any connection."
                            />
                        </CardHeader>
                        <div className="relative mb-6 border-t border-dashed border-border sm:mb-0">
                            <div className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,hsl(var(--muted)),hsl(var(--background))_125%)]"></div>
                            <div className="aspect-[76/59] p-1 px-6 flex items-center justify-center">
                                <VideoMockup />
                            </div>
                        </div>
                    </FeatureCard>

                    {/* Card 2: Real-time Whiteboard */}
                    <FeatureCard>
                        <CardHeader className="pb-3">
                            <CardHeading
                                icon={PenTool}
                                title="Real-time Whiteboarding"
                                description="Infinite canvas with live cursors—sketch ideas together without a single frame of delay."
                            />
                        </CardHeader>
                        <CardContent>
                            <div className="relative mb-6 sm:mb-0">
                                <div className="absolute -inset-6 [background:radial-gradient(50%_50%_at_75%_50%,transparent,hsl(var(--background))_100%)]"></div>
                                <div className="aspect-[76/59] border border-border/40 rounded-xl overflow-hidden bg-muted/20 flex items-center justify-center">
                                    <WhiteboardMockup />
                                </div>
                            </div>
                        </CardContent>
                    </FeatureCard>

                    {/* Card 3: Wide spanning feature card */}
                    <FeatureCard className="p-6 lg:col-span-2">
                        <p className="mx-auto my-6 max-w-lg text-balance text-center text-2xl font-semibold">
                            Instant messaging, rooms, and presence — all without leaving your flow.
                        </p>
                        <div className="flex justify-center gap-6 overflow-hidden flex-wrap">
                            <CircularUI
                                label="Connect"
                                circles={[{ pattern: 'border' }, { pattern: 'border' }]}
                            />
                            <CircularUI
                                label="Collaborate"
                                circles={[{ pattern: 'none' }, { pattern: 'primary' }]}
                            />
                            <CircularUI
                                label="Ship"
                                circles={[{ pattern: 'blue' }, { pattern: 'none' }]}
                            />
                            <CircularUI
                                label="Scale"
                                circles={[{ pattern: 'primary' }, { pattern: 'none' }]}
                                className="hidden sm:block"
                            />
                        </div>

                        {/* Feature pills row */}
                        <div className="mt-10 flex flex-wrap justify-center gap-3">
                            {[
                                { icon: MessageSquare, label: 'Live Chat' },
                                { icon: Shield, label: 'E2E Encrypted' },
                                { icon: Zap, label: 'Zero Latency' },
                                { icon: Users, label: 'Team Rooms' },
                            ].map(({ icon: Icon, label }) => (
                                <span
                                    key={label}
                                    className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-4 py-1.5 text-sm font-medium text-foreground backdrop-blur-sm"
                                >
                                    <Icon className="size-3.5 text-primary" />
                                    {label}
                                </span>
                            ))}
                        </div>
                    </FeatureCard>
                </div>
            </div>
        </section>
    )
}

/* ─── Sub-components ──────────────────────────────── */

interface FeatureCardProps {
    children: ReactNode
    className?: string
}

const FeatureCard = ({ children, className }: FeatureCardProps) => (
    <Card className={cn('group relative rounded-2xl shadow-zinc-950/5 overflow-visible', className)}>
        <CardDecorator />
        {children}
    </Card>
)

const CardDecorator = () => (
    <>
        <span className="border-primary absolute -left-px -top-px block size-2 border-l-2 border-t-2 z-10"></span>
        <span className="border-primary absolute -right-px -top-px block size-2 border-r-2 border-t-2 z-10"></span>
        <span className="border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2 z-10"></span>
        <span className="border-primary absolute -bottom-px -right-px block size-2 border-b-2 border-r-2 z-10"></span>
    </>
)

interface CardHeadingProps {
    icon: LucideIcon
    title: string
    description: string
}

const CardHeading = ({ icon: Icon, title, description }: CardHeadingProps) => (
    <div className="p-6">
        <span className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
            <Icon className="size-4 text-primary" />
            {title}
        </span>
        <p className="mt-8 text-2xl font-semibold leading-snug">{description}</p>
    </div>
)

/* ─── Visual Mockups ──────────────────────────────── */

const VideoMockup = () => (
    <div className="w-full max-w-xs mx-auto rounded-xl overflow-hidden border border-border/40 bg-muted/30 shadow-lg">
        {/* Title bar */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-card border-b border-border/30">
            <span className="size-2 rounded-full bg-red-400/80" />
            <span className="size-2 rounded-full bg-yellow-400/80" />
            <span className="size-2 rounded-full bg-green-400/80" />
            <span className="ml-2 text-xs text-muted-foreground">Plixa · Room #42</span>
        </div>
        {/* Video tiles */}
        <div className="grid grid-cols-2 gap-1.5 p-3">
            {[
                { initials: 'AK', color: 'from-violet-500 to-indigo-600' },
                { initials: 'SR', color: 'from-rose-500 to-pink-600' },
                { initials: 'TM', color: 'from-emerald-500 to-teal-600' },
                { initials: 'JD', color: 'from-amber-500 to-orange-600' },
            ].map(({ initials, color }) => (
                <div
                    key={initials}
                    className={`aspect-video rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}
                >
                    <span className="text-white font-bold text-sm">{initials}</span>
                </div>
            ))}
        </div>
        {/* Controls bar */}
        <div className="flex justify-center gap-3 py-2 pb-3">
            {['bg-primary/80', 'bg-primary/80', 'bg-destructive/80'].map((cls, i) => (
                <div key={i} className={`size-6 rounded-full ${cls} flex items-center justify-center`}>
                    <span className="size-2 rounded-sm bg-white/90" />
                </div>
            ))}
        </div>
    </div>
)

const WhiteboardMockup = () => (
    <div className="w-full h-full p-4 relative">
        {/* Fake whiteboard strokes */}
        <svg viewBox="0 0 300 180" className="w-full h-full opacity-60 text-foreground">
            {/* Box 1 */}
            <rect x="20" y="20" width="80" height="50" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" className="text-primary" />
            <text x="60" y="50" textAnchor="middle" fontSize="9" fill="currentColor" className="text-primary font-medium">Auth Service</text>
            {/* Box 2 */}
            <rect x="120" y="20" width="80" height="50" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" className="text-blue-400" />
            <text x="160" y="50" textAnchor="middle" fontSize="9" fill="currentColor" className="text-blue-400">API Gateway</text>
            {/* Box 3 */}
            <rect x="220" y="20" width="65" height="50" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" className="text-emerald-400" />
            <text x="252" y="50" textAnchor="middle" fontSize="9" fill="currentColor" className="text-emerald-400">WebRTC</text>
            {/* Arrows */}
            <line x1="100" y1="45" x2="120" y2="45" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow)" className="text-muted-foreground" />
            <line x1="200" y1="45" x2="220" y2="45" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow)" className="text-muted-foreground" />
            {/* Lower boxes */}
            <rect x="60" y="110" width="80" height="45" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" className="text-rose-400" />
            <text x="100" y="137" textAnchor="middle" fontSize="9" fill="currentColor" className="text-rose-400">Database</text>
            <rect x="170" y="110" width="80" height="45" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" className="text-violet-400" />
            <text x="210" y="137" textAnchor="middle" fontSize="9" fill="currentColor" className="text-violet-400">Message Q</text>
            {/* Vertical lines */}
            <line x1="100" y1="70" x2="100" y2="110" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" className="text-muted-foreground" />
            <line x1="210" y1="70" x2="210" y2="110" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" className="text-muted-foreground" />
            {/* Cursor dots */}
            <circle cx="85" cy="38" r="3" fill="#a78bfa" opacity="0.9" />
            <circle cx="195" cy="128" r="3" fill="#34d399" opacity="0.9" />
            <defs>
                <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 z" fill="currentColor" className="text-muted-foreground" />
                </marker>
            </defs>
        </svg>
    </div>
)

/* ─── CircularUI (Venn-style indicator) ──────────── */

interface CircleConfig {
    pattern: 'none' | 'border' | 'primary' | 'blue'
}

interface CircularUIProps {
    label: string
    circles: CircleConfig[]
    className?: string
}

const CircularUI = ({ label, circles, className }: CircularUIProps) => (
    <div className={className}>
        <div className="bg-gradient-to-b from-border size-fit rounded-2xl to-transparent p-px">
            <div className="bg-gradient-to-b from-background to-muted/25 relative flex aspect-square w-fit items-center -space-x-4 rounded-[15px] p-4">
                {circles.map((circle, i) => (
                    <div
                        key={i}
                        className={cn('size-7 rounded-full border sm:size-8', {
                            'border-primary': circle.pattern === 'none',
                            'border-primary bg-[repeating-linear-gradient(-45deg,hsl(var(--border)),hsl(var(--border))_1px,transparent_1px,transparent_4px)]':
                                circle.pattern === 'border',
                            'border-primary bg-background bg-[repeating-linear-gradient(-45deg,hsl(var(--primary)),hsl(var(--primary))_1px,transparent_1px,transparent_4px)]':
                                circle.pattern === 'primary',
                            'bg-background z-1 border-blue-500 bg-[repeating-linear-gradient(-45deg,theme(colors.blue.500),theme(colors.blue.500)_1px,transparent_1px,transparent_4px)]':
                                circle.pattern === 'blue',
                        })}
                    ></div>
                ))}
            </div>
        </div>
        <span className="text-muted-foreground mt-1.5 block text-center text-sm">{label}</span>
    </div>
)
