"use client"

import { GitBranch, GitCommit, ChevronDown, ArrowRight } from "lucide-react"

interface CodeNode {
    id: string
    label: string
    type: "start" | "condition" | "action" | "end"
    children?: string[]
}

interface CodeFlowProps {
    nodes: CodeNode[]
    activeNodeId?: string
}

export function CodeFlow({ nodes, activeNodeId }: CodeFlowProps) {
    return (
        <div className="my-10 p-6 rounded-lg border border-border bg-card/30 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

            <div className="flex items-center gap-3 mb-8">
                <GitBranch className="h-4 w-4 text-accent" />
                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-accent/70">Logic Architecture Map</span>
            </div>

            <div className="flex flex-col items-center gap-4">
                {nodes.map((node, i) => (
                    <div key={node.id} className="flex flex-col items-center w-full">
                        <div
                            className={`relative px-6 py-3 rounded-sm border transition-all duration-500 ${activeNodeId === node.id
                                    ? "bg-accent/10 border-accent text-white shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                                    : "bg-secondary/10 border-border text-muted-foreground"
                                } ${node.type === 'condition' ? 'max-w-[200px] text-center rotate-45 aspect-square flex items-center justify-center p-2' : ''}`}
                            style={node.type === 'condition' ? { transform: 'rotate(45deg)' } : undefined}
                        >
                            <div className={node.type === 'condition' ? '-rotate-45' : ''}>
                                <span className="font-mono text-xs font-bold uppercase tracking-tight">
                                    {node.label}
                                </span>
                            </div>

                            {activeNodeId === node.id && (
                                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-0.5 h-1/2 bg-accent shadow-[0_0_10px_rgba(168,85,247,1)]" />
                            )}
                        </div>

                        {i < nodes.length - 1 && (
                            <div className="h-8 w-[1px] bg-gradient-to-b from-border to-accent/20 flex flex-col items-center justify-center">
                                <div className="h-1.5 w-1.5 rounded-full bg-accent/30 my-2" />
                                <ChevronDown className="h-3 w-3 text-accent/40" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground/30">
                <GitCommit className="h-3 w-3" />
                Execution Path Trace
            </div>
        </div>
    )
}
