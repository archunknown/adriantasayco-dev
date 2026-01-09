"use client"

import { useState } from "react"
import Image from "next/image"
import { FileDown, Github, Linkedin, Mail, MessageCircle } from "lucide-react"
import LanguageToggle from "@/components/LanguageToggle"
import { useTranslation } from "@/context/LanguageContext"
import SystemModules, { type TechStack } from "./SystemModules"
import DeployedNodes from "./DeployedNodes"
import CredentialLogs from "./CredentialLogs"

// ============================================================================
// Types
// ============================================================================

type Profile = {
    id: string
    full_name: string
    role_title_es: string
    role_title_en: string
    about_me_es: string | null
    about_me_en: string | null
    avatar_url: string | null
    contact_email: string | null
    github_url: string | null
    linkedin_url: string | null
    whatsapp_url: string | null
    cv_pdf_url: string | null
}

type Certificate = {
    id: string
    title_es: string
    title_en: string
    issuer: string
    issue_date: string
    image_url: string | null
    credential_url: string | null
    category: string
    created_at: string
    display_order: number
}

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

type MobileMonitorProps = {
    profile: Profile | null
    projects: Project[]
    certificates: Certificate[]
    techStack: TechStack[]
    timeLabel: string
    timezoneAbbr: string
}

type TabId = "bio" | "skills" | "projects" | "certs"

type TabConfig = {
    id: TabId
    key: string
    label: string
}

// ============================================================================
// Constants
// ============================================================================

const TABS: TabConfig[] = [
    { id: "bio", key: "F1", label: "BIO" },
    { id: "skills", key: "F2", label: "SKILLS" },
    { id: "projects", key: "F3", label: "PROJECTS" },
    { id: "certs", key: "F4", label: "CERTS" },
]

// ============================================================================
// Sub-components
// ============================================================================

function MobileProfileCard({ profile, activeLang }: { profile: Profile | null; activeLang: "es" | "en" }) {
    const fullName = profile?.full_name ?? "UNDEFINED"
    const roleTitle = activeLang === "es" ? profile?.role_title_es : profile?.role_title_en

    return (
        <div className="border border-green-500/40 bg-black/80 p-4 relative terminal-corners border-glow">
            {/* Corner accent indicators */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-green-500 opacity-60" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 opacity-60" />

            <div className="flex items-start gap-4">
                {/* Avatar with badge clip effect */}
                <div className="relative shrink-0">
                    {/* Enhanced Clip/Lanyard with glow */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-4 bg-green-500 rounded-b-sm z-10 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />

                    <div className="relative h-24 w-24 border-2 border-green-500/60 bg-green-500/5 overflow-hidden border-glow">
                        {profile?.avatar_url ? (
                            <>
                                <Image
                                    src={profile.avatar_url}
                                    alt="Operator"
                                    fill
                                    className="object-cover grayscale contrast-125 brightness-90"
                                    unoptimized
                                />
                                {/* Scanline overlay on avatar */}
                                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.4)_50%)] bg-size-[100%_4px] pointer-events-none opacity-20" />
                            </>
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-3xl font-bold text-green-500 text-terminal-glow-strong">
                                {fullName.charAt(0)}
                            </div>
                        )}
                        {/* Active status indicator */}
                        <div className="absolute bottom-1 right-1 h-2 w-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-1.5 text-xs">
                    <div>
                        <span className="text-green-500/50 text-[10px] tracking-wider">NAME:</span>
                        <p className="text-green-400 font-bold text-base tracking-wide text-terminal-green">{fullName}</p>
                    </div>
                    <div>
                        <span className="text-green-500/50 text-[10px] tracking-wider">ROLE:</span>
                        <p className="text-green-400 text-[11px] tracking-wide">{roleTitle ?? "ENGINEER"}</p>
                    </div>
                    <div>
                        <span className="text-green-500/50 text-[10px] tracking-wider">STATUS:</span>
                        <span className="text-green-400 animate-pulse ml-1 text-terminal-glow-strong font-bold">● ONLINE</span>
                    </div>

                    {/* CV Button - Enhanced with stronger glow */}
                    <a
                        href={profile?.cv_pdf_url ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-2 mt-3 w-full py-3 text-sm font-bold uppercase transition-all duration-300 tracking-wider ${profile?.cv_pdf_url
                                ? "bg-green-500 text-black border-2 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.6),0_0_40px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.8),0_0_60px_rgba(34,197,94,0.4)] hover:scale-[1.02] active:scale-[0.98]"
                                : "border border-green-500/30 text-green-500/50 cursor-not-allowed bg-black/40"
                            }`}
                    >
                        <FileDown className="h-4 w-4" />
                        {profile?.cv_pdf_url ? "DOWNLOAD CV" : "CV NOT AVAILABLE"}
                    </a>
                </div>
            </div>
        </div>
    )
}

function MobileContactButtons({ profile }: { profile: Profile | null }) {
    const contacts = [
        { icon: MessageCircle, label: "WHATSAPP", href: profile?.whatsapp_url },
        { icon: Linkedin, label: "LINKEDIN", href: profile?.linkedin_url },
        { icon: Github, label: "GITHUB", href: profile?.github_url },
        { icon: Mail, label: "EMAIL", href: profile?.contact_email ? `mailto:${profile.contact_email}` : null },
    ].filter((c) => c.href)

    return (
        <div className="space-y-2">
            {contacts.map((contact) => (
                <a
                    key={contact.label}
                    href={contact.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-3 border border-green-500/50 bg-black/60 text-green-400 hover:bg-green-500 hover:text-black hover:border-green-400 transition-all duration-300 font-bold text-sm tracking-wider hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden group"
                >
                    {/* Sweep effect on hover */}
                    <div className="absolute inset-0 bg-green-500/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 pointer-events-none" />

                    <contact.icon className="h-4 w-4 relative z-10" />
                    <span className="relative z-10">{contact.label}</span>
                </a>
            ))}
        </div>
    )
}

// ============================================================================
// Main Component
// ============================================================================

export default function MobileMonitor({
    profile,
    projects,
    certificates,
    techStack,
    timeLabel,
    timezoneAbbr,
}: MobileMonitorProps) {
    const { lang, isMounted } = useTranslation()
    const activeLang = isMounted ? lang : "es"
    const [activeTab, setActiveTab] = useState<TabId>("bio")

    const about = activeLang === "es" ? profile?.about_me_es : profile?.about_me_en

    // Tab content renderer
    const renderTabContent = () => {
        switch (activeTab) {
            case "bio":
                return (
                    <div className="space-y-4 p-4 animate-in fade-in duration-300">
                        <MobileProfileCard profile={profile} activeLang={activeLang} />

                        {about && (
                            <div className="border border-green-500/40 bg-black/80 p-4 relative border-glow">
                                <span className="text-green-500/50 text-[10px] uppercase tracking-wider">ABOUT_ME:</span>
                                <p className="text-green-400/90 text-xs mt-2 leading-relaxed font-light">{about}</p>

                                {/* Decorative corner accents */}
                                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-green-500/40" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-green-500/40" />
                            </div>
                        )}

                        <MobileContactButtons profile={profile} />
                    </div>
                )

            case "skills":
                return (
                    <div className="p-4 h-full overflow-y-auto scrollbar-terminal animate-in fade-in duration-300">
                        <div className="border border-green-500/40 bg-black/80 p-4 border-glow">
                            <div className="text-green-500/60 text-[10px] uppercase mb-3 tracking-[0.2em] flex items-center gap-2">
                                <span className="inline-block w-1 h-1 bg-green-500 animate-pulse" />
                                SYSTEM_MODULES // INSTALLED
                            </div>
                            <SystemModules modules={techStack} />
                        </div>
                    </div>
                )

            case "projects":
                return (
                    <div className="p-4 h-full overflow-y-auto scrollbar-terminal animate-in fade-in duration-300">
                        <div className="border border-green-500/40 bg-black/80 p-2 border-glow">
                            <div className="text-green-500/60 text-[10px] uppercase mb-3 px-2 tracking-[0.2em] flex items-center gap-2">
                                <span className="inline-block w-1 h-1 bg-green-500 animate-pulse" />
                                DEPLOYED_NODES
                            </div>
                            <DeployedNodes projects={projects} />
                        </div>
                    </div>
                )

            case "certs":
                return (
                    <div className="p-4 h-full overflow-y-auto scrollbar-terminal animate-in fade-in duration-300">
                        <div className="border border-green-500/40 bg-black/80 p-2 border-glow">
                            <div className="text-green-500/60 text-[10px] uppercase mb-3 px-2 tracking-[0.2em] flex items-center gap-2">
                                <span className="inline-block w-1 h-1 bg-green-500 animate-pulse" />
                                CREDENTIAL_LOGS
                            </div>
                            <CredentialLogs certificates={certificates} />
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="flex flex-col h-full font-mono text-xs text-green-500 crt-screen">
            {/* Header with enhanced styling */}
            <header className="flex-none border-b border-green-500/40 p-3 flex justify-between items-center bg-black/90 backdrop-blur-sm relative">
                {/* Decorative line */}
                <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-green-500/50 to-transparent" />

                <div className="flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                    <span className="text-[10px] tracking-wider text-terminal-green">
                        SYSTEM_TIME: {timeLabel} {timezoneAbbr}
                    </span>
                </div>
                <LanguageToggle />
            </header>

            {/* Top Tabs with improved visual feedback */}
            <div className="flex-none border-b border-green-500/40 flex bg-black/70 backdrop-blur-sm">
                {TABS.slice(0, 2).map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-2.5 text-[10px] font-bold uppercase transition-all duration-300 tracking-wider relative ${activeTab === tab.id
                                ? "bg-green-500/20 text-green-400 border-b-2 border-green-400 shadow-[inset_0_-2px_10px_rgba(74,222,128,0.2)]"
                                : "text-green-500/50 hover:text-green-400 hover:bg-green-500/5"
                            }`}
                    >
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 w-full h-px bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                        )}
                        [{tab.key}] {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area with subtle grain texture */}
            <main className="flex-1 overflow-y-auto bg-black/50 relative">
                {renderTabContent()}
            </main>

            {/* Bottom Navigation Bar - Enhanced */}
            <nav className="flex-none border-t border-green-500/40 flex bg-black/95 backdrop-blur-sm relative">
                {/* Decorative top line */}
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-green-500/50 to-transparent" />

                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-3 flex flex-col items-center gap-0.5 transition-all duration-300 relative ${activeTab === tab.id
                                ? "text-green-400 bg-green-500/15 shadow-[inset_0_2px_10px_rgba(74,222,128,0.15)]"
                                : "text-green-500/50 hover:text-green-400 hover:bg-green-500/5"
                            }`}
                    >
                        {activeTab === tab.id && (
                            <>
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                                <div className="absolute inset-0 border-t border-green-500/30 pointer-events-none" />
                            </>
                        )}
                        <span className="text-[10px] font-bold tracking-wider">[{tab.key}]</span>
                        <span className="text-[9px] tracking-wide">{tab.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    )
}
