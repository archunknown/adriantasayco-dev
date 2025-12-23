import { ReactNode } from "react"

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-black text-green-500 font-mono selection:bg-green-500 selection:text-black">
            {/* Contenedor del Monitor de Control */}
            {children}
        </div>
    )
}