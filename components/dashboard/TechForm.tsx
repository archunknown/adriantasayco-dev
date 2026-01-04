"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

export const TECH_CATEGORIES = [
    "LANGUAGES",
    "FRAMEWORKS & RUNTIMES",
    "DATABASES",
    "DEVOPS & TOOLING",
] as const

const techSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    category: z.enum(TECH_CATEGORIES, {
        message: "Selecciona una categoria",
    }),
    icon_slug: z.string().min(1, "El slug del icono es obligatorio (ej. react, python)"),
})

export type TechFormValues = z.infer<typeof techSchema>

interface TechFormProps {
    initialValues: TechFormValues
    onSave: (values: TechFormValues) => Promise<void>
    onCancel: () => void
    submitLabel: string
}

export default function TechForm({
    initialValues,
    onSave,
    onCancel,
    submitLabel,
}: TechFormProps) {
    const form = useForm<TechFormValues>({
        resolver: zodResolver(techSchema),
        defaultValues: initialValues,
    })

    const isSubmitting = form.formState.isSubmitting

    const onSubmit = async (values: TechFormValues) => {
        try {
            await onSave(values)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="col-span-2 md:col-span-1">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-400">Nombre del módulo</FormLabel>
                                    <FormControl>
                                        <div className="relative group">
                                            <Input
                                                placeholder="Ej. React"
                                                {...field}
                                                className="bg-black/40 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-green-500/50 focus:ring-green-500/20 transition-all pl-10 h-11"
                                            />
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-green-500 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel className="text-zinc-400">Categoria del Sistema</FormLabel>
                                <FormDescription className="text-zinc-500 text-xs mb-3">
                                    Define la jerarquía tecnológica para el módulo.
                                </FormDescription>
                                <FormControl>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {TECH_CATEGORIES.map((category) => {
                                            const isSelected = field.value === category
                                            return (
                                                <div
                                                    key={category}
                                                    onClick={() => field.onChange(category)}
                                                    className={`
                                                        relative cursor-pointer rounded-xl border p-4 transition-all duration-200
                                                        hover:border-zinc-700 hover:bg-zinc-900/80
                                                        ${isSelected
                                                            ? "border-green-500 bg-zinc-900 shadow-[0_0_15px_-3px_rgba(34,197,94,0.3)]"
                                                            : "border-zinc-800 bg-zinc-950/50"
                                                        }
                                                    `}
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className={`text-sm font-semibold tracking-tight ${isSelected ? "text-white" : "text-zinc-400"}`}>
                                                            {category}
                                                        </span>
                                                        <div className={`
                                                            h-4 w-4 rounded-full border flex items-center justify-center transition-colors
                                                            ${isSelected ? "border-green-500 bg-green-500" : "border-zinc-700 bg-transparent"}
                                                        `}>
                                                            {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-black" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="col-span-2 md:col-span-1">
                    <FormField
                        control={form.control}
                        name="icon_slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-zinc-400">Identificador (Slug)</FormLabel>
                                <FormControl>
                                    <div className="relative group">
                                        <Input
                                            placeholder="Ej. react"
                                            {...field}
                                            className="bg-black/40 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-green-500/50 focus:ring-green-500/20 transition-all pl-10 h-11 font-mono text-sm"
                                        />
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-green-500 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                                        </div>
                                    </div>
                                </FormControl>
                                <FormDescription className="text-zinc-600 text-[10px] uppercase tracking-wider">
                                    Slug para mapeo de iconos (ej. 'react', 'nextjs')
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-zinc-900/50">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="text-zinc-400 hover:text-white hover:bg-zinc-900"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-500 text-black font-semibold shadow-[0_0_20px_-5px_rgba(34,197,94,0.4)] transition-all hover:scale-105"
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {submitLabel}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
