import { ReactNode } from "react"

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div className="h-screen w-screen overflow-hidden bg-black text-green-500 font-mono selection:bg-green-500 selection:text-black antialiased relative">
            {/* Global Grid Overlay */}
            <div className="pointer-events-none absolute inset-0 z-0 bg-grid-pattern opacity-20" />

            {/* CRT Scanline Overlay */}
            <div className="pointer-events-none absolute inset-0 z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
            <div className="pointer-events-none absolute inset-0 z-50 bg-linear-to-b from-transparent via-green-500/5 to-transparent bg-size-[100%_4px] animate-scanline" />

            {/* Contenedor del Monitor de Control */}
            <div className="relative z-10 h-full w-full">
                {children}
            </div>
        </div>
    )
}