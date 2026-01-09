"use client"

import { Cpu } from "lucide-react"
import { useState, useRef } from "react"

export type TechStack = {
    id: string
    name: string
    category: string
    icon_slug: string
}

type SystemModulesProps = {
    modules: TechStack[]
}

// Cache for failed slugs to avoid re-fetching on re-render
const failedSlugs = new Set<string>()

const TechIcon = ({ slug, name }: { slug: string; name: string }) => {
    const [hasError, setHasError] = useState(() => failedSlugs.has(slug))
    const imgRef = useRef<HTMLImageElement>(null)

    // Safety check for empty slugs or known failed slugs
    if (!slug || hasError) {
        return <Cpu strokeWidth={1.5} className="h-7 w-7 text-green-500/60 group-hover:text-green-400 transition-colors duration-300" />
    }

    const iconUrl = `https://cdn.simpleicons.org/${slug}/4ade80`

    const handleError = () => {
        failedSlugs.add(slug)
        setHasError(true)
    }

    return (
        <img
            ref={imgRef}
            src={iconUrl}
            alt={`${name} icon`}
            className="h-7 w-7 object-contain transition-all duration-500 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:drop-shadow-[0_0_10px_rgba(74,222,128,0.7)] group-hover:scale-110"
            onError={handleError}
            loading="lazy"
        />
    )
}

const generateVersion = (name: string) => {
    const hash = name.split("").reduce((a, b) => a + b.charCodeAt(0), 0)
    const major = (hash % 20) + 1
    const minor = hash % 10
    const patch = hash % 5
    return `v${major}.${minor}.${patch}`
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
            {/* Tabs Header - Enhanced */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide shrink-0 mb-3 border-b border-green-500/30">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`px-3 py-1 text-[9px] font-mono border transition-all duration-300 uppercase whitespace-nowrap relative group/tab ${activeTab === cat
                                ? "border-green-500 bg-green-500/20 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.3)]"
                                : "border-green-500/30 text-green-500/50 hover:border-green-500/60 hover:text-green-500/80 hover:bg-green-500/5"
                            }`}
                    >
                        {activeTab === cat && (
                            <>
                                <div className="absolute inset-0 border border-green-500/40 pointer-events-none" />
                                <div className="absolute -top-0.5 -left-0.5 w-1 h-1 bg-green-500" />
                                <div className="absolute -bottom-0.5 -right-0.5 w-1 h-1 bg-green-500" />
                            </>
                        )}
                        <span className="relative z-10 tracking-[0.1em] font-bold">{cat}</span>
                    </button>
                ))}
            </div>

            {/* Modules Grid - Enhanced */}
            <div className="grid grid-cols-3 gap-2.5 content-start overflow-y-auto scrollbar-terminal">
                {filteredModules.map((tech, index) => {
                    const version = generateVersion(tech.name)
                    return (
                        <div
                            key={tech.id}
                            className="group relative flex flex-col items-center justify-center p-3 border border-green-500/30 bg-green-500/5 hover:bg-green-500/15 hover:border-green-500/60 transition-all duration-500 backdrop-blur-sm min-h-[90px] overflow-hidden"
                            style={{ animationDelay: `${index * 30}ms` }}
                        >
                            {/* Hover sweep effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent transform scale-0 group-hover:scale-100 transition-transform duration-500 origin-top-left pointer-events-none" />

                            {/* Icon */}
                            <div className="relative z-10 mb-2">
                                <TechIcon slug={tech.icon_slug} name={tech.name} />
                            </div>

                            {/* Name */}
                            <span className="mt-1 font-mono text-[9px] font-bold uppercase text-green-500/70 group-hover:text-green-400 group-hover:text-terminal-green truncate w-full text-center transition-all duration-300 tracking-wide relative z-10">
                                {tech.name}
                            </span>

                            {/* Version */}
                            <div className="flex items-center gap-1 mt-0.5 relative z-10">
                                <span className="inline-block w-0.5 h-0.5 bg-green-500/50 rounded-full group-hover:bg-green-500 group-hover:shadow-[0_0_4px_rgba(74,222,128,0.8)] transition-all duration-300" />
                                <span className="text-[8px] text-green-500/40 group-hover:text-green-500/70 transform scale-90 group-hover:scale-100 transition-all duration-300 font-mono">
                                    {version}
                                </span>
                            </div>

                            {/* Corner accents - Enhanced */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500/40 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-green-500/40 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-green-500/40 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500/40 opacity-0 group-hover:opacity-100 transition-all duration-300" />

                            {/* Glow effect on hover */}
                            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(74,222,128,0)] group-hover:shadow-[inset_0_0_20px_rgba(74,222,128,0.15)] transition-all duration-500 pointer-events-none" />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}