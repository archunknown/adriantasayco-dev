"use client"

import { useEffect } from "react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log error to monitoring service (avoid leaking sensitive data)
        console.error("[CRITICAL_SYSTEM_FAILURE]", error.digest ?? "Unknown error")
    }, [error])

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
                        CRITICAL FAILURE
                    </p>
                    <h1 className="text-4xl font-bold text-red-400">
                        SYSTEM_EXCEPTION
                    </h1>
                </div>

                <div className="rounded-md border border-zinc-800 bg-zinc-950/60 px-8 py-6">
                    <pre className="text-sm text-zinc-400">
                        <span className="text-red-400">[FATAL]</span> CRITICAL_SYSTEM_FAILURE{"\n"}
                        <span className="text-zinc-500">├─</span> An unexpected error has occurred{"\n"}
                        <span className="text-zinc-500">├─</span> Digest: <span className="text-zinc-300">{error.digest ?? "N/A"}</span>{"\n"}
                        <span className="text-zinc-500">└─</span> Recovery: <span className="text-yellow-400">AVAILABLE</span>
                    </pre>
                </div>

                <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-6 py-3 text-sm uppercase tracking-[0.2em] text-zinc-300 transition hover:border-green-800 hover:bg-green-950/20 hover:text-green-400"
                >
                    <span className="text-green-400">↻</span>
                    Retry Operation
                </button>
            </div>
        </div>
    )
}
