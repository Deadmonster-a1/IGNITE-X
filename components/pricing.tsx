"use client"

import { Check, Zap, Crown, Rocket, ArrowRight } from "lucide-react"
import { useState } from "react"

const plans = [
  {
    name: "Explorer",
    priceMonthly: "Free",
    priceYearly: "Free",
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
    href: "/signup",
    highlight: false,
    savingsBadge: null,
  },
  {
    name: "Architect",
    priceMonthly: "₹4,999",
    priceYearly: "₹3,999",
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
    href: "/pricing",
    highlight: true,
    savingsBadge: "Save 20%",
  },
  {
    name: "Enterprise",
    priceMonthly: "Custom",
    priceYearly: "Custom",
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
    href: "mailto:sales@asci.dev",
    highlight: false,
    savingsBadge: null,
  },
]

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section id="pricing" className="relative border-t border-accent/10 bg-secondary/20 py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-grid-cyber opacity-20" aria-hidden="true" />
      <div className="aurora-orb aurora-orb-accent pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2 h-96 w-96 opacity-30" aria-hidden="true" />

      {/* Cyberpunk corners */}
      <div className="pointer-events-none absolute left-4 top-4 h-12 w-12 border-l-2 border-t-2 border-accent/15" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-4 right-4 h-12 w-12 border-b-2 border-r-2 border-accent/15" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-accent">
            <Crown className="h-4 w-4" />
            <span className="font-mono text-sm font-semibold uppercase tracking-wider">Pricing</span>
          </div>
          <h2 className="cyber-glitch text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Choose Your Protocol
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
            Transparent pricing. No hidden fees. Cancel anytime.
          </p>

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 border border-border bg-secondary/50 p-1">
            <button
              onClick={() => setIsYearly(false)}
              suppressHydrationWarning
              className={`relative px-5 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-200 ${!isYearly ? "text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {!isYearly && <span className="absolute inset-0 bg-accent" />}
              <span className="relative z-10">Monthly</span>
            </button>
            <button
              onClick={() => setIsYearly(true)}
              suppressHydrationWarning
              className={`relative flex items-center gap-2 px-5 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-200 ${isYearly ? "text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {isYearly && <span className="absolute inset-0 bg-accent" />}
              <span className="relative z-10">Yearly</span>
              <span className="relative z-10 border border-success/40 bg-success/10 px-1.5 py-0.5 font-mono text-[9px] text-success">
                -20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const price = isYearly ? plan.priceYearly : plan.priceMonthly
            return (
              <div
                key={plan.name}
                className={`cyber-corner group relative flex flex-col border transition-all duration-300 ${plan.highlight
                    ? "border-accent/50 bg-accent/5 shadow-[0_0_40px_rgba(242,103,34,0.1)]"
                    : "border-border bg-card hover:border-accent/30 hover:shadow-[0_0_20px_rgba(242,103,34,0.05)]"
                  }`}
              >
                {/* Animated top bar for highlight plan */}
                {plan.highlight && (
                  <div className="absolute -top-px left-0 right-0 h-[2px] overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-transparent via-accent to-transparent animate-shimmer" />
                  </div>
                )}

                {/* Yearly savings badge */}
                {isYearly && plan.savingsBadge && (
                  <div className="absolute -top-3 right-6 border border-success/40 bg-success/15 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-success">
                    {plan.savingsBadge}
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6 lg:p-8">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center border transition-all duration-300 ${plan.highlight
                        ? "border-accent/50 bg-accent/15 group-hover:shadow-[0_0_16px_rgba(242,103,34,0.3)]"
                        : "border-accent/20 bg-accent/10 group-hover:border-accent/40"
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
                    <span className={`text-3xl font-black ${plan.highlight ? "text-gradient-accent" : "text-foreground"}`}>
                      {price}
                    </span>
                    {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{plan.description}</p>

                  {/* Divider */}
                  <div className="my-6 h-px bg-border" />

                  {/* Features */}
                  <ul className="flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Check className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlight ? "text-accent" : "text-accent/70"}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href={plan.href}
                    suppressHydrationWarning
                    className={`mt-8 flex items-center justify-center gap-2 py-3 text-sm font-black uppercase tracking-widest transition-all duration-300 ${plan.highlight
                        ? "animate-shimmer bg-accent text-[#050505] hover:shadow-[0_0_20px_rgba(242,103,34,0.4)]"
                        : "border border-border bg-secondary text-foreground hover:border-accent/40 hover:text-accent hover:bg-accent/5"
                      }`}
                    style={plan.highlight ? { clipPath: "polygon(0 0, 100% 0, 100% 70%, 92% 100%, 0 100%)" } : undefined}
                  >
                    {plan.cta}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
