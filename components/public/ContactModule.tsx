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
            <div className="flex-1 border border-green-500/20 mt-4 flex items-center justify-center bg-black/40">
                <span className="text-green-500/40 text-[10px]">NO_CHANNELS_CONFIGURED</span>
            </div>
        )
    }

    return (
        <div className="flex-1 border border-green-500/20 mt-4 flex items-center justify-center flex-wrap gap-2 sm:gap-4 bg-black/40 px-2 sm:px-4 py-2">
            {contacts.map((contact) => (
                <a
                    key={contact.label}
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-green-500/30 px-4 py-2
                     hover:bg-green-500 hover:text-black transition-all duration-200 group"
                >
                    <div className="text-green-400 group-hover:text-black transition-colors">
                        {contact.icon}
                    </div>
                    <span className="text-[10px] font-bold">{contact.label}</span>
                </a>
            ))}
        </div>
    )
}
