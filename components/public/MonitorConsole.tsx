"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Github, Linkedin, FileText, Mail, Link as LinkIcon, Download, FileDown } from "lucide-react"
import LanguageToggle from "@/components/LanguageToggle"
import { useTranslation } from "@/context/LanguageContext"
import { Skeleton } from "@/components/ui/skeleton"
import SystemModules, { TechStack } from "./SystemModules"
import DeployedNodes from "./DeployedNodes"
import CredentialLogs from "./CredentialLogs"
import CommsLink from "./CommsLink"

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
  cv_pdf_url: string | null
  updated_at: string | null
}

type Experience = {
  id: string
  company_name: string
  role_es: string
  role_en: string
  description_es: string
  description_en: string
  start_date: string
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

type MonitorConsoleProps = {
  profile: Profile | null
  projects: Project[]
  experience: Experience[]
  certificates: Certificate[]
  techStack: TechStack[]
}

// Skeleton Components
function ProjectCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-md border border-zinc-800 bg-zinc-950/60">
      <Skeleton className="h-48 w-full" />
      <div className="space-y-3 p-5">
        <div>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-14" />
          </div>
        </div>
      </div>
    </div>
  )
}

function LogEntrySkeleton() {
  return (
    <div className="rounded-sm border border-zinc-800 bg-black/40 px-3 py-2">
      <Skeleton className="h-4 w-full" />
    </div>
  )
}

function MetricsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4 text-xs">
      {[0, 1, 2].map((i) => (
        <div key={i} className="space-y-1">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}

export default function MonitorConsole({
  profile,
  projects,
  experience,
  certificates,
  techStack,
}: MonitorConsoleProps) {
  const { lang, isMounted } = useTranslation()
  const activeLang = isMounted ? lang : "es"
  const router = useRouter()
  const [time, setTime] = useState<Date | null>(null)
  const [power, setPower] = useState(98.7)

  const [headerClicks, setHeaderClicks] = useState(0)

  // Admin Easter Egg Logic
  useEffect(() => {
    if (headerClicks >= 5) {
      router.push("/login")
      return
    }

    if (headerClicks === 0) return

    const timer = window.setTimeout(() => {
      setHeaderClicks(0)
    }, 1500)

    return () => window.clearTimeout(timer)
  }, [headerClicks, router])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === "a") {
        router.push("/login")
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [router])

  // Clock & Power Fluctuation
  useEffect(() => {
    const updateTime = () => setTime(new Date())
    updateTime()
    const timer = setInterval(() => {
      updateTime()
      // Randomly fluctuate power slightly
      if (Math.random() > 0.9) {
        setPower(prev => +(98.0 + Math.random()).toFixed(1))
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const timeLabel = time
    ? time.toISOString().replace("T", " // ").split(".")[0]
    : "--"

  const labels =
    activeLang === "es"
      ? {
        monitor: "Monitor de Control",
        roleFallback: "Rol sin asignar",
        telemetryFallback: "Sin telemetria disponible.",
        systemHealth: "Salud del sistema",
        nodes: "Nodos desplegados",
        active: "activos",
        dependencies: "Dependencias instaladas",
        noDependencies: "No registradas.",
        logs: "Terminal de logs",
        knowledge: "Bases de conocimiento cargadas",
        noImage: "Sin imagen",
        event: "EVENTO",
        scanning: "Escaneando sistema...",
      }
      : {
        monitor: "Control Monitor",
        roleFallback: "Role offline",
        telemetryFallback: "No telemetry available.",
        systemHealth: "System Health",
        nodes: "Deployed nodes",
        active: "active",
        dependencies: "Installed dependencies",
        noDependencies: "None reported.",
        logs: "Log terminal",
        knowledge: "Knowledge bases loaded",
        noImage: "No image",
        event: "EVENT",
        scanning: "Scanning system...",
      }

  const fullName = profile?.full_name ?? "UNDEFINED"
  const roleTitle =
    activeLang === "es" ? profile?.role_title_es : profile?.role_title_en
  const about =
    activeLang === "es" ? profile?.about_me_es : profile?.about_me_en

  return (
    <div className="flex h-full flex-col p-4 md:p-6 lg:p-8 font-mono text-xs md:text-sm text-green-500 overflow-hidden">
      {/* HEADER SECTION (To be implemented in Phase 2) */}
      <header className="flex-none border-b border-green-500/30 pb-2 mb-4 flex justify-between items-end">
        <div className="flex gap-4 items-center">
          <button onClick={() => setHeaderClicks(prev => prev + 1)} className="hover:text-green-400 select-none">
            <span>SYSTEM_TIME: {timeLabel} EST</span>
          </button>
        </div>
        <div className="flex gap-4 items-center">
          <LanguageToggle />
          <span className="animate-pulse">GRID_POWER: {power}% - STABLE</span>
        </div>
      </header>

      {/* MAIN GRID CONTENT */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        {/* LEFT COLUMN (Profile & Modules) - Spans 4 columns */}
        <div className="col-span-1 lg:col-span-5 flex flex-col gap-4 min-h-0">
          {/* OPERATOR PROFILE */}
          <div className="flex-none border border-green-500/30 bg-green-500/5 p-1 relative group">
            <div className="absolute top-0 left-0 bg-green-500 text-black px-1 text-[10px]">OPERATOR_PROFILE</div>
            <div className="h-48 flex items-center p-4 gap-6 bg-black/40">
              {/* Avatar Box */}
              <div className="relative h-32 w-32 shrink-0 border border-green-500/50 p-1">
                <div className="h-full w-full relative overflow-hidden bg-green-500/10">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt="Operator"
                      fill
                      className="object-cover contrast-125 saturate-0 hover:saturate-100 transition-all duration-500 brightness-90"
                      unoptimized
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-4xl font-bold bg-green-900/20 text-green-500">
                      {fullName.charAt(0)}
                    </div>
                  )}
                  {/* Scanline on Avatar */}
                  <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/50 to-transparent bg-size-[100%_4px] pointer-events-none opacity-50" />
                </div>
                <div className="absolute -bottom-3 -right-3 h-2 w-2 bg-green-500 animate-pulse" />
              </div>

              {/* Text Info */}
              <div className="space-y-2 text-xs">
                <div className="flex flex-col">
                  <span className="text-green-500/50 text-[10px] uppercase">NAME:</span>
                  <span className="text-lg font-bold tracking-wider">{fullName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-green-500/50 text-[10px] uppercase">ROLE:</span>
                  <span>{roleTitle ?? "CYBERNETIC ENGINEER"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-green-500/50 text-[10px] uppercase">STATUS:</span>
                  <span className="animate-pulse text-green-400">ONLINE</span>
                </div>
                <div className="animate-flicker text-[10px] text-green-500/70 mt-2">
                  &gt; TEXT FLICKERS...
                </div>

                {/* CV Download Button */}
                <a
                  href={profile?.cv_pdf_url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 mt-2 px-2 py-1 border border-green-500/30 text-[10px] uppercase font-bold transition-colors w-fit ${!profile?.cv_pdf_url ? 'opacity-50 cursor-not-allowed text-green-500/50' : 'text-green-400 hover:bg-green-500 hover:text-black'}`}
                >
                  <FileDown className="h-3 w-3" /> {profile?.cv_pdf_url ? "DOWNLOAD_CV // .PDF" : "CV_NOT_UPLOADED"}
                </a>
              </div>
            </div>
          </div>

          {/* SYSTEM MODULES */}
          <div className="flex-1 border border-green-500/30 bg-green-500/5 p-1 relative min-h-0 overflow-hidden">
            <div className="absolute top-0 left-0 bg-green-500 text-black px-1 text-[10px]">SYSTEM_MODULES // INSTALLED_PACKAGES</div>
            <div className="h-full border border-green-500/20 mt-4 flex items-center justify-center p-2 overflow-y-auto scrollbar-hide">
              <SystemModules modules={techStack} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Projects, Logs, Comms) - Spans 8 columns */}
        <div className="col-span-1 lg:col-span-7 flex flex-col gap-4 min-h-0">
          {/* DEPLOYED NODES (Projects) */}
          <div className="flex-1 border border-green-500/30 bg-green-500/5 p-1 relative min-h-0 overflow-hidden">
            <div className="absolute top-0 right-0 bg-green-500 text-black px-1 text-[10px]">DEPLOYED_NODES</div>
            <div className="h-full border border-green-500/20 mt-4 p-2 overflow-y-auto scrollbar-hide">
              <DeployedNodes projects={projects} />
            </div>
          </div>

          {/* CREDENTIAL LOGS */}
          <div className="h-1/4 border border-green-500/30 bg-green-500/5 p-1 relative">
            <div className="absolute top-0 left-0 bg-green-500 text-black px-1 text-[10px]">CREDENTIAL_LOGS // CERTIFICATIONS</div>
            <div className="h-full border border-green-500/20 mt-4">
              <CredentialLogs certificates={certificates} />
            </div>
          </div>

          {/* COMMS LINK */}
          <div className="h-24 border border-green-500/30 bg-green-500/5 p-1 relative flex flex-col">
            <div className="absolute top-0 left-0 bg-green-500 text-black px-1 text-[10px]">COMMS_LINK // TRANSMIT_DATA</div>
            <CommsLink contactEmail={profile?.contact_email} />
          </div>
        </div>
      </main>

      {/* FOOTER SECTION */}
      <footer className="flex-none border-t border-green-500/30 pt-2 mt-4 flex justify-between text-[10px] text-green-500/70">
        <span>SYSTEM STATUS: NOMINAL // SECURITY LEVEL: 4</span>
        <span className="animate-pulse">NO SCROLL DETECTED</span>
      </footer>
    </div>
  )
}
