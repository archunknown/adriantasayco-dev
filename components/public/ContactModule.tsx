"use client"

import { Github, Linkedin, Mail, MessageCircle } from "lucide-react"

type ContactModuleProps = {
    whatsappUrl?: string | null
    linkedinUrl?: string | null
    githubUrl?: string | null
    contactEmail?: string | null
}

type ContactItem = {
    icon: React.ReactNode
    label: string
    href: string
}

export default function ContactModule({
    whatsappUrl,
    linkedinUrl,
    githubUrl,
    contactEmail,
}: ContactModuleProps) {
    const contacts: ContactItem[] = [
        ...(whatsappUrl
            ? [{ icon: <MessageCircle className="h-4 w-4" />, label: "WHATSAPP", href: whatsappUrl }]
            : []),
        ...(linkedinUrl
            ? [{ icon: <Linkedin className="h-4 w-4" />, label: "LINKEDIN", href: linkedinUrl }]
            : []),
        ...(githubUrl
            ? [{ icon: <Github className="h-4 w-4" />, label: "GITHUB", href: githubUrl }]
            : []),
        ...(contactEmail
            ? [{ icon: <Mail className="h-4 w-4" />, label: "EMAIL", href: `mailto:${contactEmail}` }]
            : []),
    ]

    if (contacts.length === 0) {
        return (
            <div className="flex-1 border border-green-500/20 mt-4 flex items-center justify-center bg-black/60 relative">
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-green-500/30" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-green-500/30" />

                <div className="flex items-center gap-2">
                    <span className="inline-block w-1 h-1 bg-green-500/40 rounded-full animate-pulse" />
                    <span className="text-green-500/40 text-[10px] uppercase tracking-[0.15em]">NO_CHANNELS_CONFIGURED</span>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 border border-green-500/20 mt-5 flex items-center justify-center flex-wrap gap-2 sm:gap-3 bg-black/60 px-2 sm:px-4 py-2 relative">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-green-500/30" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-green-500/30" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-green-500/30" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-green-500/30" />

            {contacts.map((contact) => (
                <a
                    key={contact.label}
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-green-500/40 px-4 py-2 hover:bg-green-500 hover:text-black hover:border-green-400 transition-all duration-300 group relative overflow-hidden bg-black/40 backdrop-blur-sm hover:shadow-[0_0_15px_rgba(74,222,128,0.4)] hover:scale-105 active:scale-95"
                >
                    {/* Sweep effect */}
                    <div className="absolute inset-0 bg-green-500/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 pointer-events-none" />

                    <div className="text-green-400 group-hover:text-black transition-colors relative z-10">
                        {contact.icon}
                    </div>
                    <span className="text-[10px] font-bold tracking-widest relative z-10">{contact.label}</span>

                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-green-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-green-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
            ))}
        </div>
    )
}
