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

const techSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    category: z.string().min(1, "La categoría es obligatoria").toUpperCase(), // Force uppercase for consistency
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
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre del Módulo</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej. React" {...field} className="bg-zinc-900 border-zinc-800" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Categoría (Sistema)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej. FRONTEND" {...field} className="bg-zinc-900 border-zinc-800" />
                                </FormControl>
                                <FormDescription>
                                    Se usará para agrupar en pestañas (ej. FRONTEND, BACKEND, DEVOPS).
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="icon_slug"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Identificador de Icono (Slug)</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej. react, nextjs, python" {...field} className="bg-zinc-900 border-zinc-800" />
                            </FormControl>
                            <FormDescription>
                                Identificador interno para mapear el icono visual (ej. 'react', 'aws', 'docker').
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="border-zinc-800 hover:bg-zinc-900 hover:text-white"
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {submitLabel}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
