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
import { Loader2, Upload } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

const certificateSchema = z.object({
    title_es: z.string().min(1, "El título (ES) es obligatorio"),
    title_en: z.string().min(1, "El título (EN) es obligatorio"),
    issuer: z.string().min(1, "La institución emisora es obligatoria"),
    issue_date: z.string().min(1, "La fecha de emisión es obligatoria"),
    credential_url: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
    image_url: z.string().optional(),
})

export type CertificateFormValues = z.infer<typeof certificateSchema>

interface CertificateFormProps {
    initialValues: CertificateFormValues
    onSave: (values: CertificateFormValues, imageFile: File | null) => Promise<void>
    onCancel: () => void
    submitLabel: string
}

export default function CertificateForm({
    initialValues,
    onSave,
    onCancel,
    submitLabel,
}: CertificateFormProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(initialValues.image_url || null)
    const [imageFile, setImageFile] = useState<File | null>(null)

    const form = useForm<CertificateFormValues>({
        resolver: zodResolver(certificateSchema),
        defaultValues: initialValues,
    })

    const isSubmitting = form.formState.isSubmitting

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const onSubmit = async (values: CertificateFormValues) => {
        try {
            await onSave(values, imageFile)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Image Upload Section */}
                <div className="flex flex-col gap-4">
                    <FormLabel>Imagen del Certificado (Credencial)</FormLabel>
                    <div className="flex items-start gap-4">
                        <div className="relative h-40 w-64 overflow-hidden rounded-md border-2 border-dashed border-zinc-800 bg-zinc-900/50 flex items-center justify-center group">
                            {imagePreview ? (
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center text-zinc-500">
                                    <Upload className="h-8 w-8 mb-2" />
                                    <span className="text-xs">Subir imagen</span>
                                </div>
                            )}
                            <Input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleImageChange}
                            />
                        </div>
                        <div className="text-xs text-zinc-500 max-w-xs">
                            <p>Sube una imagen representativa del certificado o insignia.</p>
                            <p className="mt-1">Recomendado: 16:9 o 4:3 (JPG, PNG, WebP)</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="title_es"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Título (Español)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej. Arquitecto de Soluciones AWS" {...field} className="bg-zinc-900 border-zinc-800" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="title_en"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Título (Inglés)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej. AWS Solutions Architect" {...field} className="bg-zinc-900 border-zinc-800" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="issuer"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Entidad Emisora</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej. Amazon Web Services" {...field} className="bg-zinc-900 border-zinc-800" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="issue_date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fecha de Emisión</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} className="bg-zinc-900 border-zinc-800" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="credential_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL de Credencial (Verificación)</FormLabel>
                            <FormControl>
                                <Input placeholder="https://..." {...field} className="bg-zinc-900 border-zinc-800" />
                            </FormControl>
                            <FormDescription>
                                Enlace directo a la validación del certificado.
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
