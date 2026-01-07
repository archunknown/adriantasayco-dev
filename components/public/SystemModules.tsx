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

    // Get unique categories
    const categories = ["ALL", ...Array.from(new Set(modules.map(m => m.category.toUpperCase())))]

    // Filter modules
    const filteredModules = activeTab === "ALL"
        ? modules
        : modules.filter(m => m.category.toUpperCase() === activeTab)



    return (
        <div className="h-full w-full flex flex-col">
            {/* Tabs Header */}
            <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide shrink-0 mb-2 border-b border-green-500/20">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`px-2 py-0.5 text-[8px] font-mono border transition-all duration-300 uppercase whitespace-nowrap ${activeTab === cat
                            ? "border-green-500 bg-green-500/20 text-green-400"
                            : "border-green-500/30 text-green-500/50 hover:border-green-500/60 hover:text-green-500/80"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-3 gap-2 content-start overflow-y-auto scrollbar-hide">
                {filteredModules.map((tech) => {
                    const version = generateVersion(tech.name)
                    return (
                        <div
                            key={tech.id}
                            className="group relative flex flex-col items-center justify-center p-2 border border-green-500/20 bg-green-500/5 hover:bg-green-500/20 transition-all duration-300 backdrop-blur-sm min-h-[80px]"
                        >
                            <TechIcon slug={tech.icon_slug} name={tech.name} />
                            <span className="mt-1 font-mono text-[9px] font-bold uppercase text-green-500/70 group-hover:text-green-400 truncate w-full text-center">
                                {tech.name}
                            </span>
                            <span className="text-[8px] text-green-500/40 group-hover:text-green-500/60 transform scale-90">
                                {version.split(' ')[0]}
                            </span>

                            {/* Corner accents */}
                            <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-green-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-green-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}