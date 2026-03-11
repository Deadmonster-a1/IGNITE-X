"use client"

import { Terminal as TerminalIcon, ShieldCheck, Activity, Cpu } from "lucide-react"

interface TerminalHudProps {
    status: "idle" | "running" | "success" | "error" | "info"
    title?: string
}

export function TerminalHud({ status, title = "System Terminal" }: TerminalHudProps) {
    const getStatusColor = () => {
        switch (status) {
            case "success": return "text-success border-success/30"
            case "error": return "text-error border-error/30"
            case "running": return "text-info border-info/30"
            default: return "text-accent border-accent/20"
        }
    }

    return (
        <div className="flex items-center justify-between border-b px-4 py-3 bg-black/40 backdrop-blur-md relative overflow-hidden group">
            {/* Background glow based on status */}
            <div className={`absolute inset-0 opacity-5 transition-opacity duration-500 ${status === "success" ? "bg-success" :
                    status === "error" ? "bg-error" :
                        status === "running" ? "bg-info" : "bg-accent"
                }`} />

            <div className="flex items-center gap-3 relative z-10">
                <div className={`flex h-6 w-6 items-center justify-center rounded-sm border ${getStatusColor()} bg-secondary/20`}>
                    <TerminalIcon className="h-3.5 w-3.5" />
                </div>
                <div className="flex flex-col">
                    <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 leading-tight">
                        Node: ARCH-01
                    </span>
                    <span className={`font-mono text-xs font-black uppercase tracking-widest leading-tight ${getStatusColor()} glow-text`}>
                        [ {title} ]
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-6 relative z-10">
                <div className="hidden sm:flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="font-mono text-[9px] uppercase text-muted-foreground/40">CPU Load</span>
                        <div className="flex gap-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className={`h-2.5 w-1 rounded-full ${i <= 3 ? (status === 'running' ? 'bg-info animate-pulse' : 'bg-muted-foreground/20') : 'bg-muted-foreground/10'}`} />
                            ))}
                        </div>
                    </div>
                    <div className="h-8 w-[1px] bg-border/30" />
                    <div className="flex flex-col items-end">
                        <span className="font-mono text-[9px] uppercase text-muted-foreground/40">Encryption</span>
                        <ShieldCheck className={`h-3.5 w-3.5 mt-0.5 ${status === 'success' ? 'text-success' : 'text-muted-foreground/30'}`} />
                    </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-black/40 border border-border/50">
                    <Activity className={`h-3 w-3 ${status === 'running' ? 'animate-pulse text-info' : 'text-muted-foreground/50'}`} />
                    <span className="font-mono text-[10px] font-bold uppercase text-muted-foreground/70">
                        {status === 'running' ? 'Processing...' : 'Standby'}
                    </span>
                </div>
            </div>

            {/* Top line accent */}
            <div className={`absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-30 ${getStatusColor()}`} />
        </div>
    )
}
