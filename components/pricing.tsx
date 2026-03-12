"use client"

import { Check, Zap, Crown, Rocket } from "lucide-react"

const plans = [
    {
        name: "Explorer",
        price: "Free",
        period: "",
        description: "Get started with core fundamentals and community access.",
        icon: Zap,
        features: [
            "Access to 3 starter courses",
            "Community Discord access",
            "Weekly group study sessions",
            "Basic DSA problem set (50+)",
            "Certificate of completion",
        ],
        cta: "Start Free",
        highlight: false,
    },
    {
        name: "Architect",
        price: "₹4,999",
        period: "/month",
        description: "Full curriculum, mentorship, and career acceleration.",
        icon: Crown,
        features: [
            "All courses & learning paths",
            "1-on-1 weekly mentorship",
            "200+ DSA problems with solutions",
            "Live coding sessions (5x/week)",
            "Resume & portfolio review",
            "Mock interviews with FAANG engineers",
            "Priority community support",
        ],
        cta: "Initialize",
        highlight: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "",
        description: "For teams and organizations building engineering culture.",
        icon: Rocket,
        features: [
            "Everything in Architect",
            "Dedicated team mentor",
            "Custom curriculum tracks",
            "Admin dashboard & analytics",
            "Bulk enrollment discounts",
            "SLA & priority support",
        ],
        cta: "Contact Sales",
        highlight: false,
    },
]

export function Pricing() {
    return (
        <section id="pricing" className="relative border-t border-accent/10 bg-secondary/20 py-20 lg:py-28">
            <div className="absolute inset-0 bg-grid-cyber opacity-20" aria-hidden="true" />

            <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
                <div className="mb-12 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 text-accent">
                        <Crown className="h-4 w-4" />
                        <span className="font-mono text-sm font-semibold uppercase tracking-wider">Pricing</span>
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                        Choose Your Protocol
                    </h2>
                    <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
                        Transparent pricing. No hidden fees. Cancel anytime.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`cyber-corner group relative flex flex-col border transition-all duration-300 ${plan.highlight
                                    ? "border-accent/50 bg-accent/5"
                                    : "border-border bg-card hover:border-accent/30"
                                }`}
                        >
                            {plan.highlight && (
                                <div
                                    className="absolute -top-px left-6 right-6 h-[2px] bg-accent"
                                    aria-hidden="true"
                                />
                            )}

                            <div className="flex flex-1 flex-col p-6 lg:p-8">
                                {/* Header */}
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-10 w-10 items-center justify-center border ${plan.highlight ? "border-accent/40 bg-accent/15" : "border-accent/20 bg-accent/10"
                                        }`}>
                                        <plan.icon className="h-5 w-5 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground">{plan.name}</h3>
                                        {plan.highlight && (
                                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent">
                                                Most Popular
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="mt-6 flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-foreground">{plan.price}</span>
                                    {plan.period && (
                                        <span className="text-sm text-muted-foreground">{plan.period}</span>
                                    )}
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">{plan.description}</p>

                                {/* Divider */}
                                <div className="my-6 h-px bg-border" />

                                {/* Features */}
                                <ul className="flex-1 space-y-3">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                <button
                                    suppressHydrationWarning
                                    className={`mt-8 w-full py-3 text-sm font-black uppercase tracking-widest transition-all ${plan.highlight
                                            ? "bg-accent text-[#050505] hover:bg-accent/90"
                                            : "border border-border bg-secondary text-foreground hover:border-accent/40 hover:text-accent"
                                        }`}
                                    style={plan.highlight ? { clipPath: "polygon(0 0, 100% 0, 100% 70%, 92% 100%, 0 100%)" } : undefined}
                                >
                                    {plan.cta}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
