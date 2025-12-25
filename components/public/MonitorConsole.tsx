"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import LanguageToggle from "@/components/LanguageToggle"
import { useTranslation } from "@/context/LanguageContext"
import { Skeleton } from "@/components/ui/skeleton"

type Profile = {
  id: string
  full_name: string
  role_title_es: string
  role_title_en: string
  about_me_es: string | null
  about_me_en: string | null
  avatar_url: string | null
  contact_email: string | null
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
}: MonitorConsoleProps) {
  const { lang, isMounted } = useTranslation()
  const activeLang = isMounted ? lang : "es"
  const router = useRouter()
  const [headerClicks, setHeaderClicks] = useState(0)
  const [isScanning, setIsScanning] = useState(true)

  // Simulated scanning effect for industrial aesthetic
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsScanning(false)
    }, 800)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === "a") {
        router.push("/login")
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [router])

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
    <div className="relative min-h-screen bg-black text-zinc-100">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(34,197,94,0.08), rgba(34,197,94,0.08) 1px, transparent 1px, transparent 3px)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 font-mono">
        <header
          className="flex flex-wrap items-center justify-between gap-4"
          onClick={() => setHeaderClicks((count) => count + 1)}
        >
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
              {labels.monitor}
            </p>
            {isScanning ? (
              <>
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-5 w-40" />
              </>
            ) : (
              <>
                <h1 className="text-3xl font-semibold text-green-400">
                  {fullName}
                </h1>
                <p className="text-sm text-zinc-400">
                  {roleTitle ?? labels.roleFallback}
                </p>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Avatar with cache busting */}
            {isScanning ? (
              <Skeleton className="h-12 w-12 rounded-full" />
            ) : (
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-zinc-800 bg-zinc-900">
                {profile?.avatar_url ? (
                  <Image
                    src={`${profile.avatar_url}${profile.updated_at ? `?t=${new Date(profile.updated_at).getTime()}` : ""}`}
                    alt={profile.full_name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-bold text-green-400">
                    {profile?.full_name?.charAt(0) ?? "?"}
                  </div>
                )}
              </div>
            )}
            <LanguageToggle />
          </div>
        </header>

        {/* Email / Contact Line */}
        {profile?.contact_email && !isScanning && (
          <div className="flex items-center gap-2 border-l-2 border-green-500/50 bg-green-500/5 px-4 py-2 text-xs text-green-400">
            <span className="opacity-50">$</span>
            <span className="opacity-70">send_signal</span>
            <a
              href={`mailto:${profile.contact_email}`}
              className="underline decoration-green-500/30 underline-offset-4 hover:text-green-300 hover:decoration-green-400"
            >
              {profile.contact_email}
            </a>
          </div>
        )}

        <section className="grid gap-4 rounded-md border border-zinc-800 bg-zinc-950/60 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
                {labels.systemHealth}
              </p>
              {isScanning ? (
                <div className="mt-2 space-y-2">
                  <Skeleton className="h-4 w-full max-w-md" />
                  <Skeleton className="h-4 w-3/4 max-w-md" />
                </div>
              ) : (
                <p className="text-sm text-zinc-400">
                  {about ?? labels.telemetryFallback}
                </p>
              )}
            </div>
            {isScanning ? (
              <MetricsSkeleton />
            ) : (
              <div className="grid grid-cols-3 gap-4 text-xs text-zinc-400">
                <div className="space-y-1">
                  <p className="uppercase tracking-[0.3em] text-zinc-500">
                    Uptime
                  </p>
                  <p className="text-green-400">99.9%</p>
                </div>
                <div className="space-y-1">
                  <p className="uppercase tracking-[0.3em] text-zinc-500">
                    Latency
                  </p>
                  <p className="text-green-400">&lt; 30ms</p>
                </div>
                <div className="space-y-1">
                  <p className="uppercase tracking-[0.3em] text-zinc-500">
                    Status
                  </p>
                  <p className="text-green-400">Operational</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm uppercase tracking-[0.4em] text-zinc-500">
              {labels.nodes}
            </h2>
            <span className="text-xs text-zinc-500">
              {isScanning ? (
                <Skeleton className="h-4 w-16 inline-block" />
              ) : (
                `${projects.length} ${labels.active}`
              )}
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {isScanning ? (
              <>
                <ProjectCardSkeleton />
                <ProjectCardSkeleton />
              </>
            ) : (
              projects.map((project, index) => {
                const title =
                  activeLang === "es" ? project.title_es : project.title_en
                const description =
                  activeLang === "es"
                    ? project.description_es
                    : project.description_en
                const techStack = project.project_techs
                  .map((entry) => entry.tech_stack?.name)
                  .filter((value): value is string => Boolean(value))

                return (
                  <div
                    key={project.id}
                    className="overflow-hidden rounded-md border border-zinc-800 bg-zinc-950/60"
                  >
                    <div className="relative h-48 w-full bg-zinc-950">
                      {project.image_url ? (
                        <Image
                          src={project.image_url}
                          alt={title}
                          fill
                          priority={index < 2}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized={project.image_url.includes("placehold.co")}
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.3em] text-zinc-600">
                          {labels.noImage}
                        </div>
                      )}
                    </div>
                    <div className="space-y-3 p-5">
                      <div>
                        <h3 className="text-lg font-semibold text-green-400">
                          {title}
                        </h3>
                        <p className="text-sm text-zinc-400">{description}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
                          {labels.dependencies}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
                          {techStack.length > 0 ? (
                            techStack.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-sm border border-zinc-800 bg-black/40 px-2 py-1"
                              >
                                {tech}
                              </span>
                            ))
                          ) : (
                            <span className="text-zinc-600">
                              {labels.noDependencies}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-md border border-zinc-800 bg-zinc-950/60 p-6">
            <h2 className="text-sm uppercase tracking-[0.4em] text-zinc-500">
              {labels.logs}
            </h2>
            <div className="mt-4 space-y-3 text-sm text-zinc-400">
              {isScanning ? (
                <>
                  <LogEntrySkeleton />
                  <LogEntrySkeleton />
                  <LogEntrySkeleton />
                </>
              ) : (
                experience.map((log) => {
                  const timestamp = new Date(log.start_date)
                    .toISOString()
                    .slice(0, 10)
                  const role =
                    activeLang === "es" ? log.role_es : log.role_en
                  const description =
                    activeLang === "es"
                      ? log.description_es
                      : log.description_en
                  return (
                    <div
                      key={log.id}
                      className="rounded-sm border border-zinc-800 bg-black/40 px-3 py-2"
                    >
                      <span className="text-green-400">
                        [{timestamp}]
                      </span>{" "}
                      {labels.event}: {role} @ {log.company_name} - {description}
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div className="rounded-md border border-zinc-800 bg-zinc-950/60 p-6">
            <h2 className="text-sm uppercase tracking-[0.4em] text-zinc-500">
              {labels.knowledge}
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-400">
              {isScanning ? (
                <>
                  <LogEntrySkeleton />
                  <LogEntrySkeleton />
                </>
              ) : (
                certificates.map((cert) => {
                  const title =
                    activeLang === "es" ? cert.title_es : cert.title_en
                  return (
                    <li
                      key={cert.id}
                      className="rounded-sm border border-zinc-800 bg-black/40 px-3 py-2"
                    >
                      {title} — {cert.issuer}
                    </li>
                  )
                })
              )}
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
