import { Cpu, Fingerprint, Layers, Settings2, Users, Zap } from 'lucide-react'

const reasons = [
    {
        icon: Zap,
        title: 'Sub-50ms Latency',
        description:
            'Our peer-to-peer WebRTC mesh delivers drawing strokes, audio, and video frames in real time — every collaborator stays perfectly in sync, globally.',
    },
    {
        icon: Cpu,
        title: 'Infinitely Scalable',
        description:
            'From a 2-person standup to a 500-person all-hands — our infrastructure expands on demand without configuration, downtime, or dropped connections.',
    },
    {
        icon: Fingerprint,
        title: 'Enterprise-Grade Security',
        description:
            'End-to-end encryption is on by default. Your intellectual property never touches an unencrypted database, and never will.',
    },
    {
        icon: Layers,
        title: 'Works Everywhere',
        description:
            'No downloads. No plugins. Plixa runs natively in any modern browser — on desktop, tablet, or mobile — with a pixel-perfect, cohesive UI across all of them.',
    },
    {
        icon: Settings2,
        title: 'Granular Host Controls',
        description:
            'Room creators get fine-grained control: mute participants, lock sessions, restrict drawing access, and manage permissions — all from a single panel.',
    },
    {
        icon: Users,
        title: 'Built for Teams First',
        description:
            'Presence indicators, live cursors, named annotations, and role-based access — every feature is designed around the way real teams actually collaborate.',
    },
]

export function Features() {
    return (
        <section id="features" className="py-20 md:py-28 bg-background text-foreground">
            <div className="mx-auto max-w-5xl space-y-14 px-6">

                {/* Section label + heading */}
                <div className="relative z-10 mx-auto max-w-2xl text-center space-y-5">
                    <span className="section-badge">Why Plixa Meetups</span>
                    <h2 className="text-balance text-4xl font-semibold tracking-tight lg:text-5xl">
                        The collaboration layer your team has been missing
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        Plixa Meetups is the only platform that unifies HD video, infinite whiteboarding, and real-time chat — engineered from the ground up for zero-friction remote work.
                    </p>
                </div>

                {/* 6-box grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {reasons.map(({ icon: Icon, title, description }) => (
                        <div
                            key={title}
                            className="surface-card group relative flex flex-col gap-4 p-8 overflow-hidden"
                        >
                            {/* subtle corner glow on hover */}
                            <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-primary/5 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/15 transition-all duration-300">
                                <Icon className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-semibold tracking-tight">{title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
