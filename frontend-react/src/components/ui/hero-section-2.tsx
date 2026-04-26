import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { Header } from '@/components/ui/header-2'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export function HeroSection() {
    return (
        <>
            <Header />
            <main className="overflow-hidden">
                <section>
                    <div className="relative pt-24">
                        <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"></div>
                        <div className="mx-auto max-w-5xl px-6">
                            <div className="sm:mx-auto lg:mr-auto">
                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                >
                                    <h1
                                        className="mt-8 max-w-2xl text-balance text-5xl font-medium tracking-tight md:text-6xl lg:mt-16">
                                        Map out your ideas in real-time with Plixa
                                    </h1>
                                    <p
                                        className="mt-8 max-w-2xl text-pretty text-lg text-muted-foreground">
                                        Infinite scalable whiteboards, zero-latency collaboration, and enterprise grade security. Engineered perfectly for remote teams and deep architectural planning.
                                    </p>
                                    <div className="mt-12 flex items-center gap-3">
                                        <Button
                                            asChild
                                            size="xl"
                                            className="shadow-blue-glow">
                                            <Link to="/board">
                                                Start Whiteboarding
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            size="xl"
                                            variant="outline">
                                            <Link to="/auth">
                                                Get Started Free
                                            </Link>
                                        </Button>
                                    </div>
                                </AnimatedGroup>
                            </div>
                        </div>
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}>
                            <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                                <div
                                    aria-hidden
                                    className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                                />
                                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border p-4 shadow-lg shadow-zinc-950/15 ring-1 ring-border/50">
                                    <img
                                        className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block w-full object-cover"
                                        src="https://images.unsplash.com/photo-1542626991-cbc4e32524cc?q=80&w=2669&auto=format&fit=crop"
                                        alt="Whiteboard UI"
                                        width="2700"
                                        height="1440"
                                    />
                                    <img
                                        className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden w-full object-cover"
                                        src="https://images.unsplash.com/photo-1542626991-cbc4e32524cc?q=80&w=2669&auto=format&fit=crop"
                                        alt="Whiteboard UI"
                                        width="2700"
                                        height="1440"
                                    />
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>

            </main>
        </>
    )
}

