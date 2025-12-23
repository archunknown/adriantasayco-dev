import { ReactNode } from "react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono">
            {/* Futura Sidebar/Nav del Admin */}
            <header className="border-b border-zinc-800 p-4">
                <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                    Admin_Kernel_v1.0
                </span>
            </header>
            <main>{children}</main>
        </div>
    )
}