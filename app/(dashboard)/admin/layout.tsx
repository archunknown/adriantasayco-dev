"use client"

import Link from "next/link"
import { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { LayoutDashboard, FolderCode, History, Award, UserCircle, LogOut, Cpu } from "lucide-react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const router = useRouter()
    const supabase = createClient()
    const navItems = [
        { name: "Resumen", href: "/admin", icon: LayoutDashboard },
        { name: "Perfil", href: "/admin/profile", icon: UserCircle },
        { name: "Proyectos", href: "/admin/projects", icon: FolderCode },
        { name: "Tecnologías", href: "/admin/tech", icon: Cpu },
        { name: "Experiencia", href: "/admin/experience", icon: History },
        { name: "Certificados", href: "/admin/certificates", icon: Award },
    ]

    return (
        <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-mono">
            {/* Sidebar de Control */}
            <aside className="flex w-64 flex-col border-r border-zinc-800 bg-black p-4">
                <div className="mb-8 px-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Admin_Kernel_v1.0
                </div>
                <nav className="space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors hover:bg-zinc-900 hover:text-white"
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <button
                    type="button"
                    onClick={async () => {
                        await supabase.auth.signOut()
                        router.push("/")
                    }}
                    className="mt-auto flex items-center gap-3 rounded-sm px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
                >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                </button>
            </aside>

            {/* Área de Trabajo */}
            <main className="flex-1 overflow-y-auto bg-zinc-950 p-8">
                {children}
            </main>
        </div>
    )
}
