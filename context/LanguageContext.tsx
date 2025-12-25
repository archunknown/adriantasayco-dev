"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react"

type Lang = "es" | "en"

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
  isMounted: boolean
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = "lang"

// External store for localStorage sync
const langStore = {
  listeners: new Set<() => void>(),

  subscribe(listener: () => void) {
    langStore.listeners.add(listener)
    return () => langStore.listeners.delete(listener)
  },

  getSnapshot(): Lang {
    if (typeof window === "undefined") return "es"
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === "es" || stored === "en" ? stored : "es"
  },

  getServerSnapshot(): Lang {
    return "es"
  },

  setLang(value: Lang) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, value)
      langStore.listeners.forEach((listener) => listener())
    }
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(
    langStore.subscribe,
    langStore.getSnapshot,
    langStore.getServerSnapshot
  )

  // isMounted derived from hydration state
  const isMounted = useSyncExternalStore(
    () => () => { },
    () => true,
    () => false
  )

  const setLang = useCallback((value: Lang) => {
    langStore.setLang(value)
  }, [])

  const toggleLang = useCallback(() => {
    const current = langStore.getSnapshot()
    langStore.setLang(current === "es" ? "en" : "es")
  }, [])

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang,
      isMounted,
    }),
    [lang, setLang, toggleLang, isMounted]
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useTranslation must be used within LanguageProvider")
  }
  return context
}
