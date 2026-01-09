"use client"

import { Database } from "@/types/database.types"

type Certificate = Database["public"]["Tables"]["certificates"]["Row"]

export default function CredentialLogs({ certificates }: { certificates: Certificate[] }) {
    // Limit to 4-5 logs to fit space
    const displayCerts = certificates.slice(0, 5)

    return (
        <div className="h-full w-full font-mono text-[10px] space-y-1 overflow-hidden p-2">
            {displayCerts.map((cert, index) => (
                <div
                    key={cert.id}
                    className="flex gap-2 text-green-500/70 hover:text-green-400 hover:bg-green-500/10 p-1.5 cursor-default transition-all duration-300 border border-transparent hover:border-green-500/30 group relative"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    {/* Active indicator */}
                    <span className="inline-block w-1 h-1 bg-green-500/50 rounded-full self-center group-hover:bg-green-400 group-hover:shadow-[0_0_6px_rgba(74,222,128,0.8)] transition-all duration-300" />

                    <span className="text-green-500/40 group-hover:text-green-500/60 transition-colors tracking-wide">CERT_ID:</span>
                    <span className="font-bold tracking-wider group-hover:text-terminal-green transition-all duration-300">{cert.id.slice(0, 4).toUpperCase()}</span>
                    <span className="text-green-500/30 group-hover:text-green-500/50 transition-colors">//</span>
                    <span className="font-bold truncate max-w-[140px] tracking-wide group-hover:text-green-300 transition-colors">
                        {cert.issuer.toUpperCase()}_{cert.title_en.split(' ')[0].toUpperCase()}
                    </span>
                    <span className="text-green-500/30 group-hover:text-green-500/50 transition-colors">//</span>
                    <span className="text-green-500/60 group-hover:text-green-400 transition-colors tracking-wide">
                        DATE: {new Date(cert.issue_date).toISOString().slice(0, 10).replace(/-/g, '.')}
                    </span>

                    {/* Hover indicator */}
                    <div className="absolute left-0 top-0 h-full w-0.5 bg-green-500/50 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />
                </div>
            ))}

            {/* Empty lines filler - Enhanced */}
            {Array.from({ length: 5 - displayCerts.length }).map((_, i) => (
                <div key={`empty-${i}`} className="flex gap-2 text-green-500/15 p-1.5 border border-transparent">
                    <span className="inline-block w-1 h-1 bg-green-500/20 rounded-full self-center" />
                    <span className="tracking-wide">CERT_ID: NULL</span>
                    <span className="text-green-500/10">//</span>
                    <span className="tracking-wide">NO_DATA</span>
                    <span className="text-green-500/10">//</span>
                    <span className="tracking-wide">STATUS: EMPTY</span>
                </div>
            ))}
        </div>
    )
}