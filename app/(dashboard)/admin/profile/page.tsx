"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createClient } from "@/lib/supabase/client"
import { profileSchema } from "@/lib/validations/profile"
import { compressImage } from "@/lib/utils/image-compression"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save, Upload } from "lucide-react"

export default function ProfileAdminPage() {
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const supabase = createClient()
    const SINGLETON_ID = "00000000-0000-0000-0000-000000000001"

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: "",
            role_title_es: "",
            role_title_en: "",
            about_me_es: "",
            about_me_en: "",
            contact_email: "",
        },
    })

    useEffect(() => {
        async function fetchProfile() {
            const { data, error } = await supabase
                .from("profile")
                .select("*")
                .eq("id", SINGLETON_ID)
                .single()

            if (data) {
                // Sanitización: Convertir cualquier valor null en ""
                const sanitizedData = Object.keys(data).reduce((acc: any, key) => {
                    acc[key] = data[key] === null ? "" : data[key];
                    return acc;
                }, {});

                form.reset(sanitizedData)
            }
            setLoading(false)
        }
        fetchProfile()
    }, [supabase, form])

    async function onSubmit(values: z.infer<typeof profileSchema>) {
        setUpdating(true)
        const { error } = await supabase
            .from("profile")
            .update(values)
            .eq("id", SINGLETON_ID)

        if (error) {
            toast.error("Error al actualizar kernel: " + error.message)
        } else {
            toast.success("Perfil actualizado en el cluster")
        }
        setUpdating(false)
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        const loadingToast = toast.loading("Comprimiendo y subiendo imagen...")

        try {
            // 1. Compresión en el cliente
            const optimizedFile = await compressImage(file)
            const fileName = `avatar-${Date.now()}.webp`
            const filePath = `uploads/${fileName}`

            // 2. Subida a Storage
            const { error: uploadError } = await supabase.storage
                .from("portfolio-assets")
                .upload(filePath, optimizedFile)

            if (uploadError) throw uploadError

            // 3. Obtener URL pública y actualizar tabla
            const { data: { publicUrl } } = supabase.storage
                .from("portfolio-assets")
                .getPublicUrl(filePath)

            await supabase
                .from("profile")
                .update({ avatar_url: publicUrl })
                .eq("id", SINGLETON_ID)

            toast.success("Avatar actualizado", { id: loadingToast })
        } catch (error: any) {
            toast.error("Fallo en subida: " + error.message, { id: loadingToast })
        }
    }

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Configuración de Identidad</h1>
                    <p className="text-zinc-500 text-sm">Gestiona la información central de tu portafolio.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Lado Izquierdo: Avatar */}
                <Card className="border-zinc-800 bg-zinc-950">
                    <CardHeader>
                        <CardTitle className="text-sm uppercase text-zinc-500">Imagen de Sistema</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="aspect-square w-full rounded-md border border-zinc-800 bg-black flex items-center justify-center overflow-hidden">
                            {/* Aquí podrías renderizar una imagen si ya existe en profile */}
                            <Upload className="h-8 w-8 text-zinc-800" />
                        </div>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="bg-zinc-900 border-zinc-800"
                        />
                    </CardContent>
                </Card>

                {/* Lado Derecho: Formulario de Datos */}
                <div className="md:col-span-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <Card className="border-zinc-800 bg-zinc-950">
                                <CardContent className="pt-6 space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="full_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nombre Completo</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="bg-black border-zinc-800" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="role_title_es"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Rol (ES)</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} className="bg-black border-zinc-800" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="role_title_en"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Rol (EN)</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} className="bg-black border-zinc-800" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="contact_email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email de Contacto</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="email" className="bg-black border-zinc-800" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="about_me_es"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Acerca de mí (ES)</FormLabel>
                                                <FormControl>
                                                    <Textarea {...field} className="bg-black border-zinc-800 min-h-[100px]" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="about_me_en"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Acerca de mí (EN)</FormLabel>
                                                <FormControl>
                                                    <Textarea {...field} className="bg-black border-zinc-800 min-h-[100px]" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Button
                                type="submit"
                                className="w-full bg-zinc-100 text-black hover:bg-white"
                                disabled={updating}
                            >
                                {updating ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Actualizar Datos de Sistema
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}