"use client"

import { Award, ExternalLink, ShieldCheck } from "lucide-react"
import type { Database } from "@/types/database.types"
import Image from "next/image"
import { useTranslation } from "@/context/LanguageContext"

type Certificate = Database["public"]["Tables"]["certificates"]["Row"]

type SystemCertificatesProps = {
    certificates: Certificate[]
}

export default function SystemCertificates({ certificates }: SystemCertificatesProps) {
    const { lang } = useTranslation()
    const isEn = lang === "en"

    if (certificates.length === 0) return null

    return (
        <section className="space-y-6 py-6 border-t border-zinc-900/50">
            <div className="flex items-center justify-between">
                <h2 className="text-sm uppercase tracking-[0.4em] text-zinc-500">
                    [ CREDENTIAL_LOGS // CERTIFICATIONS ]
                </h2>
                <span className="text-xs text-zinc-600 font-mono">
                    VERIFIED_COUNT: {certificates.length}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                    <div
                        key={cert.id}
                        className="group relative flex overflow-hidden rounded-sm border border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 transition-all duration-300"
                    >
                        {/* Image / Icon Section */}
                        <div className="relative w-24 md:w-32 bg-zinc-900/50 flex items-center justify-center flex-shrink-0 border-r border-zinc-800/50">
                            {cert.image_url ? (
                                <Image
                                    src={cert.image_url}
                                    alt={isEn ? cert.title_en : cert.title_es}
                                    fill
                                    className="object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                                />
                            ) : (
                                <Award className="h-8 w-8 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
                            )}

                            {/* Overlay Badge */}
                            <div className="absolute top-1 left-1 bg-black/80 p-0.5 rounded">
                                <ShieldCheck className="h-3 w-3 text-green-500/50 group-hover:text-green-500 transition-colors" />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 p-4 flex flex-col justify-center">
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="font-mono text-xs font-bold uppercase text-zinc-300 group-hover:text-white transition-colors line-clamp-2">
                                    {isEn ? cert.title_en : cert.title_es}
                                </h3>
                                {cert.credential_url && (
                                    <a
                                        href={cert.credential_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-zinc-600 hover:text-green-400 transition-colors"
                                    >
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                )}
                            </div>

                            <div className="mt-2 space-y-0.5">
                                <p className="text-[10px] uppercase tracking-wide text-zinc-500 group-hover:text-zinc-400">
                                    ISSUER: {cert.issuer}
                                </p>
                                <p className="text-[10px] font-mono text-zinc-600">
                                    DATE: {cert.issue_date}
                                </p>
                            </div>
                        </div>

                        {/* "Scanline" effect on hover */}
                        <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 -skew-x-12 translate-x-full group-hover:translate-x-0" />
                    </div>
                ))}
            </div>
        </section>
    )
}
