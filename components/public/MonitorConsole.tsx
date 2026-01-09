"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FileDown } from "lucide-react"
import LanguageToggle from "@/components/LanguageToggle"
import { useTranslation } from "@/context/LanguageContext"
import { Skeleton } from "@/components/ui/skeleton"
import SystemModules, { TechStack } from "./SystemModules"
import DeployedNodes from "./DeployedNodes"
import CredentialLogs from "./CredentialLogs"
import ContactModule from "./ContactModule"
import MobileMonitor from "./MobileMonitor"

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

// Skeleton Components (unchanged)
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

  // Format time with user's local timezone
  const timeLabel = time
    ? `${time.toLocaleDateString("en-CA")} // ${time.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
    : "--"

  // Get timezone abbreviation (e.g., "EST", "PST", "PET")
  const timezoneAbbr = time
    ? Intl.DateTimeFormat("en", { timeZoneName: "short" })
      .formatToParts(time)
      .find((part) => part.type === "timeZoneName")?.value ?? "LOCAL"
    : ""

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
    <>
      {/* Mobile Layout (< lg) */}
      <div className="lg:hidden h-full">
        <MobileMonitor
          profile={profile}
          projects={projects}
          certificates={certificates}
          techStack={techStack}
          timeLabel={timeLabel}
          timezoneAbbr={timezoneAbbr}
        />
      </div>

      {/* Desktop Layout (>= lg) */}
      <div className="hidden lg:flex h-full flex-col p-4 md:p-6 lg:p-8 font-mono text-xs md:text-sm text-green-500 overflow-hidden crt-screen bg-grid-pattern">
        {/* HEADER SECTION - Enhanced */}
        <header className="flex-none border-b border-green-500/40 pb-3 mb-4 flex justify-between items-end relative backdrop-blur-sm">
          {/* Decorative accent line */}
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/60 to-transparent shadow-[0_0_8px_rgba(74,222,128,0.4)]" />

          <div className="flex gap-4 items-center">
            <button
              onClick={() => setHeaderClicks(prev => prev + 1)}
              className="hover:text-green-400 select-none transition-all duration-300 flex items-center gap-2 group"
            >
              <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)] group-hover:shadow-[0_0_12px_rgba(74,222,128,1)]" />
              <span className="text-terminal-green tracking-wider">SYSTEM_TIME: {timeLabel} {timezoneAbbr}</span>
            </button>
          </div>
          <div className="flex gap-6 items-center">
            <LanguageToggle />
            <div className="flex items-center gap-2">
              <span className="inline-block w-1 h-1 bg-green-500 animate-pulse rounded-full shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
              <span className="animate-pulse text-terminal-glow-strong tracking-wider">
                GRID_POWER: {power}% - STABLE
              </span>
            </div>
          </div>
        </header>

        {/* MAIN GRID CONTENT */}
        <main className="flex-1 grid grid-cols-12 gap-4 min-h-0">
          {/* LEFT COLUMN (Profile & Modules) - Spans 5 columns */}
          <div className="col-span-5 flex flex-col gap-4 min-h-0">
            {/* OPERATOR PROFILE - Enhanced */}
            <div className="flex-none border border-green-500/40 bg-green-500/5 p-1.5 relative group border-glow backdrop-blur-sm">
              <div className="absolute top-0 left-0 bg-green-500 text-black px-2 py-0.5 text-[10px] tracking-[0.15em] font-bold shadow-[0_0_10px_rgba(74,222,128,0.6)]">
                OPERATOR_PROFILE
              </div>

              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-green-500/60" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-green-500/60" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-green-500/60" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-green-500/60" />

              <div className="flex flex-col bg-black/60 border border-green-500/20 backdrop-blur-sm">
                {/* Top Section: Avatar + Info */}
                <div className="flex items-start p-4 gap-6">
                  {/* Avatar Box - Enhanced */}
                  <div className="relative h-32 w-32 shrink-0 border-2 border-green-500/60 p-1 border-glow group/avatar">
                    <div className="h-full w-full relative overflow-hidden bg-green-500/5">
                      {profile?.avatar_url ? (
                        <>
                          <Image
                            src={profile.avatar_url}
                            alt="Operator"
                            fill
                            className="object-cover contrast-125 saturate-0 group-hover/avatar:saturate-50 transition-all duration-700 brightness-90"
                            unoptimized
                          />
                          {/* Enhanced scanline on avatar */}
                          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
                          {/* Vignette */}
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
                        </>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-4xl font-bold bg-green-900/20 text-green-500 text-terminal-glow-strong">
                          {fullName.charAt(0)}
                        </div>
                      )}
                    </div>
                    {/* Active pulse indicator - enhanced */}
                    <div className="absolute -bottom-2 -right-2 h-3 w-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_12px_rgba(74,222,128,1)]">
                      <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
                    </div>
                  </div>

                  {/* Text Info - Enhanced */}
                  <div className="flex-1 space-y-2 text-xs">
                    <div className="flex flex-col">
                      <span className="text-green-500/50 text-[10px] uppercase tracking-[0.2em]">NAME:</span>
                      <span className="text-lg font-bold tracking-wider text-terminal-glow-strong">{fullName}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-green-500/50 text-[10px] uppercase tracking-[0.2em]">ROLE:</span>
                      <span className="text-xs tracking-wide text-green-400">{roleTitle ?? "ENGINEER"}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex flex-col">
                        <span className="text-green-500/50 text-[10px] uppercase tracking-[0.2em]">STATUS:</span>
                        <span className="animate-pulse text-green-400 flex items-center gap-1.5 text-terminal-glow-strong font-bold">
                          <span className="inline-block w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,1)]" />
                          ONLINE
                        </span>
                      </div>
                      {/* CV Download Button - Enhanced */}
                      <a
                        href={profile?.cv_pdf_url ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-5 py-2.5 text-[11px] uppercase font-bold transition-all duration-300 tracking-[0.15em] relative overflow-hidden group/cv ${!profile?.cv_pdf_url
                            ? 'opacity-50 cursor-not-allowed border border-green-500/20 text-green-500/50 bg-black/40'
                            : 'bg-green-500 text-black border-2 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.6),0_0_40px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.8),0_0_60px_rgba(34,197,94,0.4)] hover:scale-105 active:scale-95'
                          }`}
                      >
                        {profile?.cv_pdf_url && (
                          <div className="absolute inset-0 bg-green-400 transform -translate-x-full group-hover/cv:translate-x-0 transition-transform duration-500" />
                        )}
                        <FileDown className="h-4 w-4 relative z-10" />
                        <span className="relative z-10">{profile?.cv_pdf_url ? "DOWNLOAD_CV.PDF" : "CV_NOT_AVAILABLE"}</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* ABOUT Section - Enhanced */}
                {about && (
                  <div className="border-t border-green-500/30 px-4 py-3 relative">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-green-500/50 text-[10px] uppercase tracking-[0.2em]">ABOUT_ME:</span>
                    </div>
                    <p className="text-[11px] text-green-400/90 leading-relaxed line-clamp-3 font-light">
                      {about}
                    </p>

                    {/* Decorative corner accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500/40" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500/40" />
                  </div>
                )}
              </div>
            </div>

            {/* SYSTEM MODULES - Enhanced */}
            <div className="flex-1 border border-green-500/40 bg-green-500/5 p-1.5 relative min-h-0 overflow-hidden border-glow backdrop-blur-sm">
              <div className="absolute top-0 left-0 bg-green-500 text-black px-2 py-0.5 text-[10px] tracking-[0.15em] font-bold shadow-[0_0_10px_rgba(74,222,128,0.6)]">
                SYSTEM_MODULES // INSTALLED_PACKAGES
              </div>

              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-green-500/60" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-green-500/60" />

              <div className="h-full border border-green-500/20 mt-5 flex items-center justify-center p-2 overflow-y-auto scrollbar-terminal bg-black/60">
                <SystemModules modules={techStack} />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Projects, Logs, Comms) - Spans 7 columns */}
          <div className="col-span-7 flex flex-col gap-4 min-h-0">
            {/* DEPLOYED NODES (Projects) - Enhanced */}
            <div className="flex-1 border border-green-500/40 bg-green-500/5 p-1.5 relative min-h-0 overflow-hidden border-glow backdrop-blur-sm">
              <div className="absolute top-0 right-0 bg-green-500 text-black px-2 py-0.5 text-[10px] tracking-[0.15em] font-bold shadow-[0_0_10px_rgba(74,222,128,0.6)]">
                DEPLOYED_NODES
              </div>

              {/* Corner brackets */}
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-green-500/60" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-green-500/60" />

              <div className="h-full border border-green-500/20 mt-5 p-3 overflow-y-auto scrollbar-terminal bg-black/60">
                <DeployedNodes projects={projects} />
              </div>
            </div>

            {/* CREDENTIAL LOGS - Enhanced */}
            <div className="h-1/4 border border-green-500/40 bg-green-500/5 p-1.5 relative border-glow backdrop-blur-sm">
              <div className="absolute top-0 left-0 bg-green-500 text-black px-2 py-0.5 text-[10px] tracking-[0.15em] font-bold shadow-[0_0_10px_rgba(74,222,128,0.6)]">
                CREDENTIAL_LOGS // CERTIFICATIONS
              </div>

              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-green-500/60" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-green-500/60" />

              <div className="h-full border border-green-500/20 mt-5 bg-black/60">
                <CredentialLogs certificates={certificates} />
              </div>
            </div>

            {/* CONTACT MODULE - Enhanced */}
            <div className="h-24 border border-green-500/40 bg-green-500/5 p-1.5 relative flex flex-col border-glow backdrop-blur-sm">
              <div className="absolute top-0 left-0 bg-green-500 text-black px-2 py-0.5 text-[10px] tracking-[0.15em] font-bold shadow-[0_0_10px_rgba(74,222,128,0.6)]">
                CONTACT_MODULE // SECURE_COMMS
              </div>

              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-green-500/60" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-green-500/60" />

              <ContactModule
                whatsappUrl={profile?.whatsapp_url}
                linkedinUrl={profile?.linkedin_url}
                githubUrl={profile?.github_url}
                contactEmail={profile?.contact_email}
              />
            </div>
          </div>
        </main>

        {/* FOOTER SECTION - Enhanced */}
        <footer className="flex-none border-t border-green-500/40 pt-3 mt-4 flex justify-between text-[10px] text-green-500/70 relative">
          {/* Decorative top line */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/60 to-transparent shadow-[0_0_8px_rgba(74,222,128,0.4)]" />

          <div className="flex items-center gap-2">
            <span className="inline-block w-1 h-1 bg-green-500/50 rounded-full animate-pulse" />
            <span className="truncate tracking-wider">STATUS: NOMINAL // SECURITY LEVEL: 4</span>
          </div>
        </footer>
      </div>
    </>
  )
}