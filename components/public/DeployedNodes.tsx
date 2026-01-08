"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
// Note: We need to check if these Dialog components exist or if we need to use Radix directly. 
// Assuming standard shadcn/ui structure for now or I will fallback to custom.
// Since I don't see components/ui/dialog.tsx in the list_dir earlier, I should probably build a custom one or check first.
// Wait, package.json had @radix-ui/react-dialog. I'll use a custom simple implementation to avoid dependency issues if files are missing.

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
                {topProjects.map((project) => (
                    <div
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className="group relative flex items-start gap-4 border border-green-500/20 bg-green-500/5 p-3 hover:bg-green-500/10 cursor-pointer transition-all duration-300 overflow-hidden"
                    >
                        {/* 16:9 Image Area */}
                        <div className="relative w-32 h-20 shrink-0 border border-green-500/30 overflow-hidden bg-black/50">
                            <Image
                                src={project.image_url}
                                alt={project.title_en}
                                fill
                                className="object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                            />
                            {/* Overlay Lines */}
                            <div className="absolute inset-0 bg-size-[100%_2px] bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.8)_50%)] pointer-events-none opacity-20" />
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col h-full justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="text-sm font-bold text-green-400 truncate group-hover:text-green-300 font-mono">{project.title_en}</h3>
                                    <span className="text-[9px] border border-green-500/30 px-1 text-green-500/60 uppercase group-hover:text-green-400 group-hover:border-green-400">active</span>
                                </div>

                                <p className="text-[10px] text-green-500/70 mt-1 line-clamp-2 leading-relaxed">
                                    {project.description_en}
                                </p>
                            </div>

                            {/* Tech Stack Mini-List */}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {project.project_techs.slice(0, 4).map((pt, i) => (
                                    <span key={i} className="text-[10px] font-bold border border-green-400/60 bg-green-500/20 px-2 py-0.5 text-green-300 group-hover:bg-green-500/40 group-hover:border-green-400 transition-colors">
                                        {pt.tech_stack?.name}
                                    </span>
                                ))}
                                {project.project_techs.length > 4 && (
                                    <span className="text-[10px] font-bold border border-green-500/30 bg-black/40 px-2 py-0.5 text-green-500/70">+{project.project_techs.length - 4}</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal / Overlay */}
            {selectedProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-2xl bg-black border border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.15)] relative flex flex-col max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-3 border-b border-green-500/30 bg-green-500/10">
                            <span className="text-xs uppercase tracking-[0.2em] text-green-400">NODE_DETAILS // {selectedProject.title_en}</span>
                            <button onClick={() => setSelectedProject(null)} className="text-green-500 hover:text-white">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto space-y-6 scrollbar-hide">
                            <div className="relative h-64 w-full border border-green-500/20 bg-green-900/5 group">
                                <Image
                                    src={selectedProject.image_url}
                                    alt={selectedProject.title_en}
                                    fill
                                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_4px,3px_100%] pointer-events-none" />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-bold text-green-400 mb-2">&gt; DESCRIPTION_LOG</h3>
                                    <p className="text-sm text-green-500/80 leading-relaxed font-mono">
                                        {selectedProject.description_en}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-green-400 mb-2">&gt; TECH_STACK_MATRIX</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.project_techs.map((pt, i) => (
                                            <span key={i} className="px-3 py-1.5 border-2 border-green-400 text-xs font-bold text-green-300 bg-green-500/20 hover:bg-green-500/40 transition-colors">
                                                {pt.tech_stack?.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer (Actions) */}
                        <div className="p-4 border-t border-green-500/30 flex justify-end gap-4 bg-green-500/5">
                            <button className="flex items-center gap-2 px-4 py-2 border border-green-500/50 hover:bg-green-500 hover:text-black transition-colors text-xs font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed">
                                <Github className="h-4 w-4" /> REPO_SOURCE
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black hover:bg-green-400 transition-colors text-xs font-bold uppercase">
                                <ExternalLink className="h-4 w-4" /> INIT_SEQUENCE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
