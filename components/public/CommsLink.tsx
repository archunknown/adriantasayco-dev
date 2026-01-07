"use client"

import { useState } from "react"
import { Send, Terminal } from "lucide-react"

export default function CommsLink({ contactEmail }: { contactEmail?: string | null }) {
    const [message, setMessage] = useState("")

    const handleSend = () => {
        if (!contactEmail || !message) return
        window.location.href = `mailto:${contactEmail}?subject=TRANSMISSION_REQUEST&body=${encodeURIComponent(message)}`
    }

    return (
        <div className="flex-1 border border-green-500/20 mt-2 flex flex-col p-2 bg-black/40">
            <div className="flex items-center gap-2 text-green-500/60 mb-2">
                <span className="animate-pulse">_</span>
                <span className="text-[10px]">ENCRYPTED CHANNEL: OPEN</span>
            </div>

            <div className="flex-1 flex gap-2">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="TYPE MESSAGE..."
                        className="w-full h-full bg-transparent border-b border-green-500/30 text-green-400 font-mono text-xs focus:outline-none focus:border-green-500 placeholder-green-500/20"
                    />
                </div>
                <button
                    onClick={handleSend}
                    className="border border-green-500/50 px-4 py-1 hover:bg-green-500 hover:text-black transition-colors uppercase text-[10px] font-bold flex items-center gap-2"
                >
                    SEND <Send className="h-3 w-3" />
                </button>
            </div>
        </div>
    )
}
