"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ExternalLink, Github } from "lucide-react"

type Project = {
    id: string
    title_es: string
    title_en: string
    description_es: string
    description_en: string
    image_url: string
    display_order: number
    project_techs: {
        tech_id: string
        tech_stack: { name: string } | null
    }[]
}

export default function DeployedNodes({ projects }: { projects: Project[] }) {
    // Display only top 3 projects
    const topProjects = projects.slice(0, 3)
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)

    return (
        <>
            <div className="grid grid-rows-3 gap-3 h-full overflow-hidden">
                {topProjects.map((project, index) => (
                    <div
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className="group relative flex items-start gap-4 border border-green-500/30 bg-green-500/5 p-3 hover:bg-green-500/10 hover:border-green-500/60 cursor-pointer transition-all duration-500 overflow-hidden backdrop-blur-sm"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Hover sweep effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* 16:9 Image Area - Enhanced */}
                        <div className="relative w-32 h-20 shrink-0 border border-green-500/40 overflow-hidden bg-black/70 group-hover:border-green-500/60 transition-all duration-500">
                            <Image
                                src={project.image_url}
                                alt={project.title_en}
                                fill
                                className="object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-90 transition-all duration-700 group-hover:scale-110"
                            />
                            {/* CRT scanline overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.8)_50%)] bg-[length:100%_2px] pointer-events-none opacity-20" />
                            {/* Vignette */}
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />

                            {/* Node ID badge */}
                            <div className="absolute top-1 left-1 bg-black/80 border border-green-500/50 px-1.5 py-0.5 text-[8px] text-green-400 font-bold tracking-wider backdrop-blur-sm">
                                NODE_{String(index + 1).padStart(2, '0')}
                            </div>
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col h-full justify-between relative z-10">
                            <div>
                                <div className="flex justify-between items-start mb-1.5">
                                    <h3 className="text-sm font-bold text-green-400 truncate group-hover:text-green-300 font-mono tracking-wide text-terminal-green transition-all duration-300">
                                        {project.title_en}
                                    </h3>
                                    <span className="text-[9px] border border-green-500/40 px-1.5 py-0.5 text-green-500/60 uppercase group-hover:text-green-400 group-hover:border-green-400 group-hover:shadow-[0_0_8px_rgba(74,222,128,0.4)] transition-all duration-300 font-bold tracking-wider">
                                        ACTIVE
                                    </span>
                                </div>

                                <p className="text-[10px] text-green-500/70 group-hover:text-green-400/90 mt-1 line-clamp-2 leading-relaxed transition-colors duration-300">
                                    {project.description_en}
                                </p>
                            </div>

                            {/* Tech Stack Mini-List - Enhanced */}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {project.project_techs.slice(0, 4).map((pt, i) => (
                                    <span
                                        key={i}
                                        className="text-[10px] font-bold border border-green-400/60 bg-green-500/20 px-2 py-0.5 text-green-300 group-hover:bg-green-500/40 group-hover:border-green-400 group-hover:shadow-[0_0_6px_rgba(74,222,128,0.3)] transition-all duration-300 tracking-wide"
                                    >
                                        {pt.tech_stack?.name}
                                    </span>
                                ))}
                                {project.project_techs.length > 4 && (
                                    <span className="text-[10px] font-bold border border-green-500/30 bg-black/40 px-2 py-0.5 text-green-500/70 group-hover:text-green-500/90 transition-colors duration-300">
                                        +{project.project_techs.length - 4}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Click indicator */}
                        <div className="absolute bottom-2 right-2 text-[8px] text-green-500/40 group-hover:text-green-500/60 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            [CLICK_TO_EXPAND]
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal / Overlay - Enhanced */}
            {selectedProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    {/* Scanline overlay on modal background */}
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none opacity-10" />

                    <div className="w-full max-w-3xl bg-black/95 border-2 border-green-500/60 shadow-[0_0_40px_rgba(34,197,94,0.25)] relative flex flex-col max-h-[90vh] overflow-hidden backdrop-blur-sm animate-in zoom-in-95 duration-300">
                        {/* Corner brackets */}
                        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-green-500" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-green-500" />
                        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-green-500" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-green-500" />

                        {/* Modal Header - Enhanced */}
                        <div className="flex justify-between items-center p-4 border-b border-green-500/40 bg-green-500/10 relative">
                            <div className="flex items-center gap-3">
                                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                                <span className="text-xs uppercase tracking-[0.25em] text-green-400 font-bold text-terminal-glow-strong">
                                    NODE_DETAILS // {selectedProject.title_en}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="text-green-500 hover:text-green-300 hover:bg-green-500/20 p-2 border border-green-500/40 hover:border-green-500 transition-all duration-300 hover:shadow-[0_0_10px_rgba(74,222,128,0.4)] group"
                            >
                                <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* Modal Content - Enhanced */}
                        <div className="p-6 overflow-y-auto space-y-6 scrollbar-terminal">
                            {/* Project Image - Enhanced */}
                            <div className="relative h-72 w-full border-2 border-green-500/30 bg-green-900/5 group/img overflow-hidden">
                                <Image
                                    src={selectedProject.image_url}
                                    alt={selectedProject.title_en}
                                    fill
                                    className="object-cover opacity-70 group-hover/img:opacity-90 transition-opacity duration-700 grayscale group-hover/img:grayscale-0"
                                />
                                {/* CRT effects */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.3)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.02),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] pointer-events-none" />
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)] pointer-events-none" />
                            </div>

                            <div className="space-y-5">
                                {/* Description */}
                                <div className="border border-green-500/30 bg-black/60 p-4 relative">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="inline-block w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                                        <h3 className="text-sm font-bold text-green-400 uppercase tracking-[0.15em]">&gt; DESCRIPTION_LOG</h3>
                                    </div>
                                    <p className="text-sm text-green-500/80 leading-relaxed font-mono font-light">
                                        {selectedProject.description_en}
                                    </p>

                                    {/* Corner accents */}
                                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500/40" />
                                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500/40" />
                                </div>

                                {/* Tech Stack */}
                                <div className="border border-green-500/30 bg-black/60 p-4 relative">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="inline-block w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                                        <h3 className="text-sm font-bold text-green-400 uppercase tracking-[0.15em]">&gt; TECH_STACK_MATRIX</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.project_techs.map((pt, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1.5 border-2 border-green-400/60 text-xs font-bold text-green-300 bg-green-500/20 hover:bg-green-500/40 hover:border-green-400 hover:shadow-[0_0_10px_rgba(74,222,128,0.4)] transition-all duration-300 tracking-wide"
                                            >
                                                {pt.tech_stack?.name}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Corner accents */}
                                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500/40" />
                                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500/40" />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer (Actions) - Enhanced */}
                        <div className="p-4 border-t border-green-500/40 flex justify-end gap-3 bg-green-500/5 relative">
                            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />

                            <button className="flex items-center gap-2 px-5 py-2.5 border-2 border-green-500/60 hover:bg-green-500/20 hover:border-green-500 transition-all duration-300 text-xs font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed tracking-wider hover:shadow-[0_0_15px_rgba(74,222,128,0.3)] group relative overflow-hidden">
                                <div className="absolute inset-0 bg-green-500/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                                <Github className="h-4 w-4 relative z-10" />
                                <span className="relative z-10">REPO_SOURCE</span>
                            </button>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-black border-2 border-green-400 hover:bg-green-400 transition-all duration-300 text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:scale-105 active:scale-95 group relative overflow-hidden">
                                <div className="absolute inset-0 bg-green-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                                <ExternalLink className="h-4 w-4 relative z-10" />
                                <span className="relative z-10">INIT_SEQUENCE</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}