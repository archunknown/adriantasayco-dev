"use client"

import { Database } from "@/types/database.types"

type Certificate = Database["public"]["Tables"]["certificates"]["Row"]

export default function CredentialLogs({ certificates }: { certificates: Certificate[] }) {
    // Limit to 4-5 logs to fit space
    const displayCerts = certificates.slice(0, 5)

    return (
        <div className="h-full w-full font-mono text-[10px] space-y-1 overflow-hidden p-2">
            {displayCerts.map((cert) => (
                <div key={cert.id} className="flex gap-2 text-green-500/80 hover:bg-green-500/10 p-1 cursor-default transition-colors">
                    <span className="text-green-500/40">CERT_ID:</span>
                    <span>{cert.id.slice(0, 4).toUpperCase()}</span>
                    <span className="text-green-500/40">//</span>
                    <span className="font-bold truncate max-w-[120px]">{cert.issuer.toUpperCase()}_{cert.title_en.split(' ')[0].toUpperCase()}</span>
                    <span className="text-green-500/40">//</span>
                    <span>DATE: {new Date(cert.issue_date).toISOString().slice(0, 10).replace(/-/g, '.')}</span>
                </div>
            ))}
            {/* Empty lines filler */}
            {Array.from({ length: 5 - displayCerts.length }).map((_, i) => (
                <div key={`empty-${i}`} className="flex gap-2 text-green-500/20 p-1">
                    <span>CERT_ID: NULL</span>
                    <span>//</span>
                    <span>NO_DATA</span>
                </div>
            ))}
        </div>
    )
}
