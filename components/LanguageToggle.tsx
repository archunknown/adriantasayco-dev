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
    <div
      className={cn(
        "relative flex items-center rounded-full border border-zinc-800 bg-black/40 p-1 shadow-sm transition-all",
        !isMounted && "cursor-not-allowed opacity-60"
      )}
    >
      <button
        type="button"
        onClick={() => !isEnglish && toggleLang()}
        disabled={!isMounted}
        className={cn(
          "relative z-10 flex h-7 min-w-12 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300",
          !isEnglish
            ? "bg-zinc-800 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
            : "text-zinc-500 hover:text-zinc-300"
        )}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => isEnglish && toggleLang()}
        disabled={!isMounted}
        className={cn(
          "relative z-10 flex h-7 min-w-12 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300",
          isEnglish
            ? "bg-zinc-800 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
            : "text-zinc-500 hover:text-zinc-300"
        )}
      >
        EN
      </button>
    </div>
  )
}
