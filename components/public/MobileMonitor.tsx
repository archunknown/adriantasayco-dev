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
        <div className="border border-green-500/30 bg-black/60 p-4">
            <div className="flex items-start gap-4">
                {/* Avatar with badge clip effect */}
                <div className="relative shrink-0">
                    {/* Clip/Lanyard */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-3 bg-green-500 rounded-b-sm z-10" />
                    <div className="relative h-24 w-24 border-2 border-green-500/50 bg-green-500/10 overflow-hidden">
                        {profile?.avatar_url ? (
                            <Image
                                src={profile.avatar_url}
                                alt="Operator"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-3xl font-bold text-green-500">
                                {fullName.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-1 text-xs">
                    <div>
                        <span className="text-green-500/50 text-[10px]">NAME:</span>
                        <p className="text-green-400 font-bold text-base">{fullName}</p>
                    </div>
                    <div>
                        <span className="text-green-500/50 text-[10px]">ROLE:</span>
                        <p className="text-green-400 text-[11px]">{roleTitle ?? "ENGINEER"}</p>
                    </div>
                    <div>
                        <span className="text-green-500/50 text-[10px]">STATUS:</span>
                        <span className="text-green-400 animate-pulse ml-1">ONLINE</span>
                    </div>

                    {/* CV Button - Prominent */}
                    <a
                        href={profile?.cv_pdf_url ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-2 mt-3 w-full py-3 text-sm font-bold uppercase transition-all duration-300 ${profile?.cv_pdf_url
                                ? "bg-green-500 text-black border-2 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:shadow-[0_0_30px_rgba(34,197,94,0.8)]"
                                : "border border-green-500/30 text-green-500/50 cursor-not-allowed"
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
                    className="flex items-center justify-center gap-3 w-full py-3 border border-green-500/40 bg-black/40 text-green-400 hover:bg-green-500 hover:text-black transition-colors font-bold text-sm"
                >
                    <contact.icon className="h-4 w-4" />
                    {contact.label}
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
                    <div className="space-y-4 p-4">
                        <MobileProfileCard profile={profile} activeLang={activeLang} />

                        {about && (
                            <div className="border border-green-500/30 bg-black/60 p-4">
                                <span className="text-green-500/50 text-[10px] uppercase">ABOUT:</span>
                                <p className="text-green-400/80 text-xs mt-1 leading-relaxed">{about}</p>
                            </div>
                        )}

                        <MobileContactButtons profile={profile} />
                    </div>
                )

            case "skills":
                return (
                    <div className="p-4 h-full overflow-y-auto">
                        <div className="border border-green-500/30 bg-black/60 p-4">
                            <div className="text-green-500/50 text-[10px] uppercase mb-3">SYSTEM_MODULES // INSTALLED</div>
                            <SystemModules modules={techStack} />
                        </div>
                    </div>
                )

            case "projects":
                return (
                    <div className="p-4 h-full overflow-y-auto">
                        <div className="border border-green-500/30 bg-black/60 p-2">
                            <div className="text-green-500/50 text-[10px] uppercase mb-3 px-2">DEPLOYED_NODES</div>
                            <DeployedNodes projects={projects} />
                        </div>
                    </div>
                )

            case "certs":
                return (
                    <div className="p-4 h-full overflow-y-auto">
                        <div className="border border-green-500/30 bg-black/60 p-2">
                            <div className="text-green-500/50 text-[10px] uppercase mb-3 px-2">CREDENTIAL_LOGS</div>
                            <CredentialLogs certificates={certificates} />
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="flex flex-col h-full font-mono text-xs text-green-500">
            {/* Header */}
            <header className="flex-none border-b border-green-500/30 p-3 flex justify-between items-center bg-black/80">
                <span className="text-[10px]">
                    SYSTEM_TIME: {timeLabel} {timezoneAbbr}
                </span>
                <LanguageToggle />
            </header>

            {/* Top Tabs (visible indicators) */}
            <div className="flex-none border-b border-green-500/30 flex bg-black/60">
                {TABS.slice(0, 2).map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-2 text-[10px] font-bold uppercase transition-colors ${activeTab === tab.id
                            ? "bg-green-500/20 text-green-400 border-b-2 border-green-500"
                            : "text-green-500/50 hover:text-green-400"
                            }`}
                    >
                        [{tab.key}] {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto bg-black/40">{renderTabContent()}</main>

            {/* Bottom Navigation Bar */}
            <nav className="flex-none border-t border-green-500/30 flex bg-black/90">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-3 flex flex-col items-center gap-0.5 transition-colors ${activeTab === tab.id ? "text-green-400 bg-green-500/10" : "text-green-500/50"
                            }`}
                    >
                        <span className="text-[10px] font-bold">[{tab.key}]</span>
                        <span className="text-[9px]">{tab.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    )
}
