import Link from "next/link"

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-black font-mono text-zinc-100">
            <div
                className="pointer-events-none fixed inset-0 z-0 opacity-10"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(0deg, rgba(239,68,68,0.08), rgba(239,68,68,0.08) 1px, transparent 1px, transparent 3px)",
                }}
            />

            <div className="relative z-10 space-y-8 text-center">
                <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.4em] text-red-500">
                        SYSTEM ERROR
                    </p>
                    <h1 className="text-6xl font-bold text-red-400">404</h1>
                </div>

                <div className="rounded-md border border-zinc-800 bg-zinc-950/60 px-8 py-6">
                    <pre className="text-sm text-zinc-400">
                        <span className="text-red-400">[ERROR]</span> NODE_NOT_FOUND{"\n"}
                        <span className="text-zinc-500">├─</span> Requested resource does not exist{"\n"}
                        <span className="text-zinc-500">├─</span> Path: <span className="text-zinc-300">unknown</span>{"\n"}
                        <span className="text-zinc-500">└─</span> Status: <span className="text-red-400">OFFLINE</span>
                    </pre>
                </div>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-6 py-3 text-sm uppercase tracking-[0.2em] text-zinc-300 transition hover:border-green-800 hover:bg-green-950/20 hover:text-green-400"
                >
                    <span className="text-green-400">▶</span>
                    Reiniciar Sistema
                </Link>
            </div>
        </div>
    )
}
