"use client"

import { useState } from "react"
import { ShieldCheck, Check, Loader2, Zap } from "lucide-react"

export default function PricingPage() {
    const [loading, setLoading] = useState(false)

    const handleUpgrade = async () => {
        setLoading(true)
        try {
            // 1. Create Subscription
            const res = await fetch("/api/razorpay/create-subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan_id: "plan_placeholder_replace_me" }),
            })

            const data = await res.json()
            if (!data.subscriptionId) {
                throw new Error("Failed to create subscription.")
            }

            // 2. Open Razorpay Checkout Modal
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use Razorpay Key ID
                subscription_id: data.subscriptionId,
                name: "ASCI LMS",
                description: "Architect Premium Subscription",
                image: "/logo.png", // Optional: Add your logo path here
                handler: function (response: any) {
                    // Payment succeeded! Razorpay will also fire our webhook securely.
                    console.log("Payment successful:", response.razorpay_payment_id)
                    // Redirect to profile or course page
                    window.location.href = "/profile"
                },
                prefill: {
                    name: "Architect Learner", // You can pass actual user details if fetched
                    email: "",
                    contact: ""
                },
                theme: {
                    color: "#a855f7" // Matches your cyberpunk accent purple
                }
            }

            const rzp = new (window as any).Razorpay(options)
            rzp.on('payment.failed', function (response: any) {
                console.error("Payment failed:", response.error.description)
                setLoading(false)
            });
            rzp.open()

        } catch (error) {
            console.error("Failed to checkout", error)
            setLoading(false)
        }
    }

    return (
        <div className="flex-1 flex flex-col min-h-screen bg-[#050505] p-6 lg:p-12 relative overflow-hidden items-center pt-24">
            {/* Background elements */}
            <div className="absolute inset-0 bg-grid-cyber opacity-[0.03] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="text-center mb-16 relative z-10">
                <h1 className="text-4xl lg:text-6xl font-black text-foreground uppercase tracking-tighter mb-4">
                    Upgrade to <span className="text-accent">Architect</span>
                </h1>
                <p className="text-muted-foreground font-mono max-w-xl mx-auto">
                    Unlock premium systems-building curriculum, interactive challenges, and advanced Python architectures.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full relative z-10">
                {/* Free Tier */}
                <div className="p-8 border border-border/30 bg-[#0a0a0a] rounded-xl flex flex-col">
                    <h3 className="text-xl font-bold mb-2">Initiate (Free)</h3>
                    <div className="text-3xl font-black mb-6">$0<span className="text-sm text-muted-foreground font-normal">/month</span></div>

                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Check className="h-4 w-4 text-success" /> Access to basic syntax lessons
                        </li>
                        <li className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Check className="h-4 w-4 text-success" /> Public community forums
                        </li>
                        <li className="flex items-center gap-3 text-sm text-muted-foreground opacity-40">
                            <ShieldCheck className="h-4 w-4" /> No interactive environments
                        </li>
                        <li className="flex items-center gap-3 text-sm text-muted-foreground opacity-40">
                            <ShieldCheck className="h-4 w-4" /> No advanced architecture modules
                        </li>
                    </ul>

                    <button
                        disabled
                        className="w-full py-3 rounded-md bg-white/5 text-muted-foreground font-mono text-sm tracking-widest uppercase cursor-not-allowed border border-white/10"
                    >
                        Current Plan
                    </button>
                </div>

                {/* Premium Tier */}
                <div className="p-8 border border-accent/40 bg-accent/5 rounded-xl flex flex-col relative overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.1)]">
                    <div className="absolute top-0 inset-x-0 h-1 bg-accent" />
                    <div className="absolute top-4 right-4 bg-accent/20 text-accent text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-sm border border-accent/20 flex items-center gap-1">
                        <Zap className="h-3 w-3" /> Recommended
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-accent">Architect (Premium)</h3>
                    <div className="text-3xl font-black mb-6 text-white">$15<span className="text-sm text-muted-foreground font-normal">/month</span></div>

                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3 text-sm text-foreground">
                            <Check className="h-4 w-4 text-accent" /> Everything in Initiate
                        </li>
                        <li className="flex items-center gap-3 text-sm text-foreground">
                            <Check className="h-4 w-4 text-accent" /> Premium Video Courses & Curriculum
                        </li>
                        <li className="flex items-center gap-3 text-sm text-foreground">
                            <Check className="h-4 w-4 text-accent" /> Interactive WebAssembly Code Editor
                        </li>
                        <li className="flex items-center gap-3 text-sm text-foreground">
                            <Check className="h-4 w-4 text-accent" /> Advanced Systems Architecture Modules
                        </li>
                    </ul>

                    <button
                        onClick={handleUpgrade}
                        disabled={loading}
                        className="w-full py-3 rounded-md bg-accent hover:bg-accent/90 text-white font-mono text-sm tracking-widest font-bold uppercase transition-all flex justify-center items-center h-12"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Upgrade Now"}
                    </button>
                </div>
            </div>
        </div>
    )
}
