"use client"

import { Cpu, Database, Globe, Layers, Layout, Server, Terminal, Code2, AppWindow } from "lucide-react"
import { useState } from "react"

export type TechStack = {
    id: string
    name: string
    category: string
    icon_slug: string
}

type SystemModulesProps = {
    modules: TechStack[]
}

const TechIcon = ({ slug, name }: { slug: string; name: string }) => {
    const [error, setError] = useState(false)

    // Safety check for empty slugs
    if (!slug) return <Cpu strokeWidth={1.5} className="h-7 w-7" />

    // If we failed to load the CDN icon, fallback to Lucide CPU
    if (error) return <Cpu strokeWidth={1.5} className="h-7 w-7" />

    // We request the icon in Green-400 (#4ade80) to match the theme
    // We start grayscale and low opacity, then reveal the "Green Light" on hover via CSS
    const iconUrl = `https://cdn.simpleicons.org/${slug}/4ade80`

    return (
        <img
            src={iconUrl}
            alt={`${name} icon`}
            className="h-7 w-7 object-contain transition-all duration-300 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]"
            onError={() => setError(true)}
        />
    )
}

const generateVersion = (name: string) => {
    const hash = name.split("").reduce((a, b) => a + b.charCodeAt(0), 0)
    const major = (hash % 20) + 1
    const minor = hash % 10
    const patch = hash % 5
    return `v${major}.${minor}.${patch} [STABLE]`
}

export default function SystemModules({ modules }: SystemModulesProps) {
    const [activeTab, setActiveTab] = useState("ALL")

    // Get unique categories and normalize them (optional: hardcode preferred order)
    const categories = ["ALL", ...Array.from(new Set(modules.map(m => m.category.toUpperCase())))]

    const filteredModules = activeTab === "ALL"
        ? modules
        : modules.filter(m => m.category.toUpperCase() === activeTab)

    return (
        <section className="space-y-4 py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-sm uppercase tracking-[0.4em] text-zinc-500">
                    [ SYSTEM_MODULES // INSTALLED_PACKAGES ]
                </h2>

                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`px-3 py-1 text-[10px] font-mono border transition-all duration-300 ${activeTab === cat
                                ? "border-green-500/50 bg-green-500/10 text-green-400"
                                : "border-zinc-800 bg-zinc-950/40 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredModules.map((tech) => {
                    const version = generateVersion(tech.name)

                    return (
                        <div
                            key={tech.id}
                            className="group relative overflow-hidden rounded-sm border border-zinc-800 bg-zinc-950/40 hover:border-green-500/50 hover:bg-zinc-900/60 hover:shadow-[0_0_15px_rgba(34,197,94,0.15)] transition-all duration-300"
                        >
                            <div className="flex items-center gap-4 p-4">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded bg-black/50 text-zinc-600 transition-all duration-300 group-hover:text-green-400 group-hover:shadow-[0_0_8px_rgba(34,197,94,0.3)]">
                                    <TechIcon slug={tech.icon_slug} name={tech.name} />
                                </div>

                                <div className="flex flex-col space-y-1 flex-1 min-w-0">
                                    <div className="flex items-baseline justify-between w-full">
                                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-400 group-hover:text-green-100 transition-colors truncate">
                                            {tech.name}
                                        </span>
                                        <span className="font-mono text-[9px] text-zinc-600 group-hover:text-green-500/60 ml-2 shrink-0">
                                            {version}
                                        </span>
                                    </div>

                                    <div className="mt-1.5 space-y-1">
                                        <div className="h-0.5 w-full bg-zinc-800/80 overflow-hidden rounded-full">
                                            <div className="h-full w-[85%] bg-zinc-600 group-hover:bg-green-500 transition-all duration-500 ease-out" />
                                        </div>
                                        <div className="flex justify-end">
                                            <span className="font-mono text-[8px] uppercase text-zinc-700 group-hover:text-green-500/50 tracking-widest">
                                                USAGE_LOAD: HEAVY
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="mt-2 flex justify-end">
                <span className="text-[9px] font-mono text-zinc-700">
                    TOTAL_MODULES_LOADED: {filteredModules.length}
                </span>
            </div>
        </section>
    )
}