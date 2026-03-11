"use client"

import { useState } from "react"
import { Terminal, Code2, Repeat, Box, GitBranch, Sparkles } from "lucide-react"

const concepts = [
    {
        id: "variables",
        title: "Variables & Data Types",
        icon: Box,
        description: "Think of variables as named boxes where you store information. Python is smart enough to know what kind of box to use without you explicitly telling it.",
        code: `# Storing text (String)
name = "Alice"

# Storing numbers (Integer & Float)
age = 25
height = 5.9

# Storing True/False (Boolean)
is_coding = True

print(f"My name is {name} and I am {age} years old.")`,
        simplest: "Variables are just nicknames for data.",
    },
    {
        id: "control",
        title: "Control Flow (If/Else)",
        icon: GitBranch,
        description: "Control flow allows your program to make decisions. It's like a fork in the road—if a condition is met, go left; otherwise, go right.",
        code: `weather = "raining"

if weather == "raining":
    print("Take an umbrella!")
elif weather == "cloudy":
    print("Might want a light jacket.")
else:
    print("Enjoy the sun!")`,
        simplest: "If this is true, do this. If not, do that.",
    },
    {
        id: "loops",
        title: "Loops (For & While)",
        icon: Repeat,
        description: "Loops let you do the same thing over and over without repeating your code. A 'for' loop goes through a specific set of items, while a 'while' loop keeps going until a condition stops it.",
        code: `# For Loop: Repeating a specific number of times
for i in range(3):
    print("Hello!")  # Prints 3 times

# While Loop: Repeating until a condition is met
countdown = 3
while countdown > 0:
    print(countdown)
    countdown -= 1
print("Blastoff!")`,
        simplest: "Loops automate repetitive tasks.",
    },
    {
        id: "functions",
        title: "Functions",
        icon: Code2,
        description: "Functions are reusable blocks of code. Imagine a recipe machine: you feed it ingredients (arguments), it follows the recipe, and hands you the resulting dish (return value).",
        code: `def greet(name):
    return f"Hello, {name}!"

# Using the function later
message = greet("World")
print(message)  # Output: Hello, World!`,
        simplest: "Functions package code so you don't have to rewrite it.",
    },
    {
        id: "structures",
        title: "Lists & Dictionaries",
        icon: Terminal,
        description: "Lists hold a sequence of items in order. Dictionaries hold pairs of information (like a word and its definition) using 'keys' and 'values'.",
        code: `# List: A sequence of items
fruits = ["apple", "banana", "cherry"]
print(fruits[0]) # Output: apple

# Dictionary: Key-Value pairs
user = {
    "username": "coder123",
    "level": 42
}
print(user["username"]) # Output: coder123`,
        simplest: "Lists are ordered collections. Dictionaries are labeled collections.",
    }
]

export function PythonConcepts() {
    const [activeConcept, setActiveConcept] = useState(concepts[0].id)

    const active = concepts.find(c => c.id === activeConcept) || concepts[0]

    return (
        <section className="relative py-24 bg-background overflow-hidden border-t border-border/50">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
                <div className="mb-16">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="h-4 w-4 text-accent fill-accent" />
                        <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent">Core Mechanics</span>
                    </div>
                    <h2 className="flex items-center gap-4 font-mono text-3xl font-black uppercase tracking-tight text-foreground">
                        <Terminal className="h-8 w-8 text-accent" />
                        Interactive Concepts
                    </h2>
                    <p className="mt-4 text-sm text-muted-foreground max-w-xl leading-relaxed">
                        Interactive breakdown of the essential building blocks. No jargon, just pure architectural patterns for modern Python.
                    </p>
                </div>

                <div className="flex flex-col gap-10 lg:flex-row">
                    {/* Navigation/Sidebar */}
                    <div className="flex flex-col gap-3 lg:w-1/3">
                        {concepts.map((concept) => (
                            <button
                                key={concept.id}
                                onClick={() => setActiveConcept(concept.id)}
                                className={`group relative flex items-center gap-4 px-6 py-5 text-left transition-all border border-transparent rounded-sm ${activeConcept === concept.id
                                    ? "border-accent/20 bg-accent/5 font-bold shadow-[0_0_20px_rgba(168,85,247,0.05)]"
                                    : "text-muted-foreground hover:bg-secondary/20 hover:text-foreground"
                                    }`}
                            >
                                {activeConcept === concept.id && (
                                    <div className="absolute left-0 top-0 h-full w-1 bg-accent" />
                                )}
                                <concept.icon className={`h-5 w-5 shrink-0 transition-colors ${activeConcept === concept.id ? "text-accent" : "group-hover:text-white"}`} />
                                <span className={`text-sm uppercase tracking-widest font-mono ${activeConcept === concept.id ? "text-white" : ""}`}>{concept.title}</span>
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 rounded-sm border border-border bg-card/40 backdrop-blur-md shadow-2xl relative overflow-hidden group/card">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />

                        <div className="border-b border-border/50 bg-secondary/20 px-8 py-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">{active.title}</h3>
                                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-accent/10 border border-accent/20">
                                    <span className="font-mono text-[10px] font-black uppercase text-accent tracking-widest">
                                        TL;DR: {active.simplest}
                                    </span>
                                </div>
                            </div>
                            <active.icon className="h-10 w-10 text-accent/20 hidden sm:block" />
                        </div>

                        <div className="p-8">
                            <p className="mb-8 text-base leading-relaxed text-muted-foreground/90 max-w-2xl">
                                {active.description}
                            </p>

                            <div className="overflow-hidden rounded-md border border-border bg-[#0d1117] shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform transition-transform hover:scale-[1.01]">
                                <div className="flex items-center justify-between border-b border-border/30 bg-[#161b22] px-5 py-3">
                                    <div className="flex gap-1.5">
                                        <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                                        <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                                        <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
                                    </div>
                                    <span className="font-mono text-[10px] uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                        <Code2 className="h-3 w-3" />
                                        example.py
                                    </span>
                                    <div className="w-12" /> {/* spacer */}
                                </div>
                                <div className="p-6 overflow-x-auto min-h-[200px]">
                                    <pre className="font-mono text-sm leading-7 text-[#c9d1d9]">
                                        {active.code.split('\n').map((line, i) => {
                                            const isComment = line.trim().startsWith('#');
                                            if (isComment) {
                                                return <div key={i} className="text-[#8b949e] italic">{line}</div>;
                                            }

                                            // 1. Extract Strings to avoid highlighting inside them
                                            const strings: string[] = [];
                                            let part = line.replace(/("[^"]*"|'[^']*')/g, (match) => {
                                                strings.push(match);
                                                return `__STR_${strings.length - 1}__`;
                                            });

                                            // 2. Escape HTML special characters
                                            part = part.replace(/</g, "&lt;").replace(/>/g, "&gt;");

                                            // 3. Highlight keywords, built-ins, and operators
                                            part = part
                                                .replace(/\b(def|if|elif|else|for|while|in|return|True|False)\b/g, "<span class='text-[#ff7b72] font-bold'>$1</span>")
                                                .replace(/\b(print|range|len)\b/g, "<span class='text-[#d2a8ff]'>$1</span>")
                                                .replace(/(=|&lt;|&gt;|\+|-|\*|\/)/g, "<span class='text-[#79c0ff]'>$1</span>");

                                            // 4. Restore and highlight Strings
                                            const finale = part.replace(/__STR_(\d+)__/g, (_, idx) => {
                                                const str = strings[parseInt(idx)]
                                                    .replace(/</g, "&lt;")
                                                    .replace(/>/g, "&gt;");
                                                return `<span class='text-[#a5d6ff]'>${str}</span>`;
                                            });

                                            return <div key={i} dangerouslySetInnerHTML={{ __html: finale || '&nbsp;' }} />;
                                        })}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
