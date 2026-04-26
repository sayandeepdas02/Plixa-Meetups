import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const testimonials = [
    {
        name: 'Sarah Johnson',
        role: 'Product Manager at Linear',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        content:
            'Plixa has completely transformed how our distributed team communicates. The real-time canvas means we sketch, iterate, and ship ideas without a single Slack thread holding us back.',
    },
    {
        name: 'John Mitchell',
        role: 'Staff Engineer at Vercel',
        avatar: 'https://i.pravatar.cc/150?u=john',
        content:
            `The WebRTC architecture here is exceptional. Hundreds of live cursors, zero frame drops. I've reviewed a lot of collab tools — Plixa is the only one that actually delivers on the latency promise.`,
    },
    {
        name: 'Emily Chen',
        role: 'Lead UX Researcher at Stripe',
        avatar: 'https://i.pravatar.cc/150?u=emily',
        content:
            'We run all our live user-flow mapping sessions inside Plixa. The infinite canvas and frictionless sharing have made it the first tool our entire research org agrees on.',
    },
]

function TestimonialDemo() {
    return (
        <section id="testimonials">
            <div className="py-24">
                <div className="mx-auto w-full max-w-5xl px-6">

                    {/* Section label + heading */}
                    <div className="mb-14 flex flex-col items-center gap-4 text-center">
                        <span className="section-badge">Testimonials</span>
                        <h2 className="text-foreground text-4xl font-semibold tracking-tight lg:text-5xl">
                            Trusted by teams that ship fast
                        </h2>
                        <p className="max-w-xl text-muted-foreground text-lg leading-relaxed">
                            Engineers, designers, and product leaders across the world have made Plixa their default collaboration layer. Here's what they say.
                        </p>
                    </div>

                    {/* Grid: 1 col → 2 cols → 3 cols */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-background ring-foreground/10 rounded-2xl border border-transparent px-5 py-6 ring-1 hover:-translate-y-1 transition-transform duration-300"
                            >
                                {/* Quote mark */}
                                <span className="text-3xl leading-none text-primary/30 font-serif select-none">"</span>
                                <p className="text-foreground leading-relaxed mt-1">{testimonial.content}</p>
                                <div className="mt-6 flex items-center gap-2.5">
                                    <Avatar className="ring-foreground/10 size-8 border border-transparent shadow ring-1">
                                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="text-foreground text-sm font-medium">{testimonial.name}</div>
                                    <span aria-hidden className="bg-foreground/25 size-1 rounded-full" />
                                    <span className="text-muted-foreground text-sm truncate">{testimonial.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export { TestimonialDemo }
