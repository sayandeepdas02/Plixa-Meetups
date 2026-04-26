import { Check } from "lucide-react";
import React from "react";

const pricingPlans = [
    {
        title: "Hobby",
        popular: false,
        description: "Perfect for students, freelancers, and solo explorers mapping ideas on their own terms.",
        price: "$0",
        period: "forever free",
        cta: "Get Started Free",
        features: [
            "Up to 3 active whiteboards",
            "Max 5 concurrent editors",
            "720p video sync",
            "7-day canvas history",
            "Community support",
        ],
    },
    {
        title: "Pro Team",
        popular: true,
        description: "Built for agile teams that need unlimited space, premium quality, and speed.",
        price: "$12",
        period: "per seat / month",
        cta: "Start Free Trial",
        features: [
            "Unlimited whiteboards",
            "Up to 100 concurrent editors",
            "1080p HD video sync",
            "Unlimited canvas history",
            "Export to SVG & PDF",
            "Priority support",
            "Cancel anytime",
        ],
    },
    {
        title: "Enterprise",
        popular: false,
        description: "For large-scale orgs that demand custom security, compliance, and dedicated infrastructure.",
        price: "Custom",
        period: "tailored to your scale",
        cta: "Talk to Sales",
        features: [
            "Unlimited everything",
            "SSO & Custom SAML",
            "Custom E2E encryption",
            "Dedicated infrastructure",
            "SLA guarantees",
            "24/7 dedicated support",
            "Onboarding & training",
        ],
    },
];

const Pricing1 = () => {
    return (
        <section id="pricing" className="py-20 md:py-28 bg-background text-foreground">
            <div className="mx-auto max-w-5xl px-6">

                {/* Section label + heading */}
                <div className="mb-16 flex flex-col items-center gap-4 text-center">
                    <span className="section-badge">Pricing</span>
                    <h2 className="text-balance text-4xl font-semibold tracking-tight lg:text-5xl">
                        Simple pricing. No surprises.
                    </h2>
                    <p className="max-w-xl text-muted-foreground text-lg leading-relaxed">
                        Start free, scale as you grow. Every plan includes end-to-end encryption and unlimited meeting time — no credit card required to get started.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {pricingPlans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${
                                plan.popular
                                    ? "border-primary bg-primary text-primary-foreground shadow-2xl scale-[1.02]"
                                    : "border-border/60 bg-card hover:border-primary/30 hover:-translate-y-1 hover:shadow-lg"
                            }`}
                        >
                            {/* Popular badge */}
                            {plan.popular && (
                                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-4 py-1 text-xs font-semibold uppercase tracking-widest text-background">
                                    Most Popular
                                </span>
                            )}

                            {/* Plan name */}
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold">{plan.title}</h3>
                                <p className={`mt-2 text-sm leading-relaxed ${plan.popular ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
                                    {plan.description}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="mb-6 border-t border-current/10 pt-6">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                <span className={`ml-2 text-sm ${plan.popular ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                                    {plan.period}
                                </span>
                            </div>

                            {/* Features */}
                            <ul className="mb-8 flex-1 space-y-3">
                                {plan.features.map((feature, fi) => (
                                    <li key={fi} className="flex items-start gap-2.5 text-sm">
                                        <Check className={`mt-0.5 size-4 shrink-0 ${plan.popular ? "text-primary-foreground" : "text-primary"}`} />
                                        <span className={plan.popular ? "text-primary-foreground/90" : "text-foreground/80"}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <button
                                className={`w-full ${
                                    plan.popular
                                        ? "btn-primary bg-background text-foreground hover:bg-background/90 shadow-none"
                                        : "btn-outline"
                                }`}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Footer note */}
                <p className="mt-10 text-center text-sm text-muted-foreground">
                    All plans include unlimited meeting time and end-to-end encryption. Need help choosing?{" "}
                    <a href="mailto:hello@plixa.io" className="underline underline-offset-4 hover:text-foreground transition-colors">
                        Talk to us.
                    </a>
                </p>
            </div>
        </section>
    );
};

export { Pricing1 };
