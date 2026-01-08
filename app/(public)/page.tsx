import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { LanguageProvider } from "@/context/LanguageContext"
import MonitorConsole from "@/components/public/MonitorConsole"
import type { Database } from "@/types/database.types"

// ISR: Regenerate page every hour
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("profile")
      .select("full_name, role_title_es, role_title_en")
      .single()

    const name = data?.full_name ?? "Portfolio"
    const roleEn = data?.role_title_en ?? "Developer"
    const roleEs = data?.role_title_es ?? "Desarrollador"

    return {
      title: `${name} | ${roleEn}`,
      description: `${roleEn} • ${roleEs}`,
      openGraph: {
        title: `${name} | ${roleEn}`,
        description: `${roleEn} • ${roleEs}`,
        type: "website",
      },
    }
  } catch {
    // Fallback metadata if Supabase is unavailable
    return {
      title: "Portfolio | Developer",
      description: "Software Developer Portfolio",
    }
  }
}

type NormalizedProject = Pick<
  Database["public"]["Tables"]["projects"]["Row"],
  | "id"
  | "title_es"
  | "title_en"
  | "description_es"
  | "description_en"
  | "image_url"
  | "display_order"
> & {
  project_techs: {
    tech_id: string
    tech_stack: { name: string } | null
  }[]
}

function normalizeProjects(
  rawData: unknown[]
): NormalizedProject[] {
  if (!Array.isArray(rawData)) return []

  return rawData.map((item) => {
    const project = item as Record<string, unknown>
    const projectTechs = Array.isArray(project.project_techs)
      ? project.project_techs.map((pt) => {
        const tech = pt as Record<string, unknown>
        return {
          tech_id: String(tech.tech_id ?? ""),
          tech_stack: tech.tech_stack && typeof tech.tech_stack === "object"
            ? { name: String((tech.tech_stack as Record<string, unknown>).name ?? "") }
            : null,
        }
      })
      : []

    return {
      id: String(project.id ?? ""),
      title_es: String(project.title_es ?? ""),
      title_en: String(project.title_en ?? ""),
      description_es: String(project.description_es ?? ""),
      description_en: String(project.description_en ?? ""),
      image_url: String(project.image_url ?? ""),
      display_order: Number(project.display_order ?? 0),
      project_techs: projectTechs,
    }
  })
}

export default async function HomePage() {
  const supabase = await createClient()

  const [
    profileResult,
    projectsResult,
    experienceResult,
    certificatesResult,
    techStackResult,
  ] = await Promise.all([
    supabase
      .from("profile")
      .select(
        "id, full_name, role_title_es, role_title_en, about_me_es, about_me_en, avatar_url, updated_at, contact_email, github_url, linkedin_url, whatsapp_url, cv_pdf_url"
      )
      .single(),
    supabase
      .from("projects")
      .select(
        `
        id,
        title_es,
        title_en,
        description_es,
        description_en,
        image_url,
        display_order,
        project_techs (
          tech_id,
          tech_stack (name)
        )
      `
      )
      .order("display_order", { ascending: true }),
    supabase
      .from("experience_logs")
      .select(
        "id, company_name, role_es, role_en, description_es, description_en, start_date"
      )
      .order("start_date", { ascending: false }),
    supabase
      .from("certificates")
      .select("id, title_es, title_en, issuer, issue_date, image_url, credential_url, category, created_at, display_order")
      .order("issue_date", { ascending: false }),
    supabase
      .from("tech_stack")
      .select("id, name, category, icon_slug")
      .order("category", { ascending: true }),
  ])

  const profile = profileResult.data ?? null
  const projects = normalizeProjects(projectsResult.data ?? [])
  const experience = experienceResult.data ?? []
  const certificates = certificatesResult.data ?? []
  const techStack = techStackResult.data ?? []

  return (
    <LanguageProvider>
      <MonitorConsole
        profile={profile}
        projects={projects}
        experience={experience}
        certificates={certificates}
        techStack={techStack}
      />
    </LanguageProvider>
  )
}
