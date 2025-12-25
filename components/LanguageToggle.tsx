"use client"

import { useTranslation } from "@/context/LanguageContext"
import { cn } from "@/lib/utils"

export default function LanguageToggle() {
  const { lang, toggleLang, isMounted } = useTranslation()

  const isEnglish = lang === "en"
  const ariaLabel = lang === "es"
    ? "Cambiar idioma a Inglés"
    : "Switch language to Spanish"

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isEnglish}
      aria-label={ariaLabel}
      onClick={toggleLang}
      disabled={!isMounted}
      className={cn(
        "relative inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-500 transition",
        !isMounted && "cursor-not-allowed opacity-60"
      )}
    >
      <span className={cn(isEnglish ? "text-zinc-500" : "text-green-400")}>
        ES
      </span>
      <div className="relative h-4 w-10 rounded-full border border-zinc-800 bg-zinc-950">
        <span
          className={cn(
            "absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] transition",
            isEnglish ? "translate-x-6" : "translate-x-1"
          )}
        />
      </div>
      <span className={cn(isEnglish ? "text-green-400" : "text-zinc-500")}>
        EN
      </span>
    </button>
  )
}
