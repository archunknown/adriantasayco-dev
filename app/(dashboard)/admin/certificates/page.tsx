"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import CertificateForm, { type CertificateFormValues } from "@/components/dashboard/CertificateForm"
import { toast } from "sonner"
import { Loader2, Plus, Award, Trash2, Edit, ExternalLink } from "lucide-react"
import type { Database } from "@/types/database.types"
import { Skeleton } from "@/components/ui/skeleton"
import { compressImage } from "@/lib/utils/image-compression"
import { deleteImageFromStorage } from "@/lib/utils/storage-cleanup"
import Image from "next/image"

type Certificate = Database["public"]["Tables"]["certificates"]["Row"]

export default function AdminCertificatesPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingCert, setEditingCert] = useState<Certificate | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const supabase = createClient()

    const emptyFormValues: CertificateFormValues = useMemo(
        () => ({
            title_es: "",
            title_en: "",
            issuer: "",
            issue_date: new Date().toISOString().split('T')[0],
            credential_url: "",
            image_url: "",
        }),
        []
    )

    const formValues = useMemo<CertificateFormValues>(() => {
        if (!editingCert) return emptyFormValues

        return {
            title_es: editingCert.title_es,
            title_en: editingCert.title_en,
            issuer: editingCert.issuer,
            issue_date: editingCert.issue_date,
            credential_url: editingCert.credential_url ?? "",
            image_url: editingCert.image_url ?? "",
        }
    }, [editingCert, emptyFormValues])

    const fetchCertificates = useCallback(async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from("certificates")
            .select("*")
            .order("issue_date", { ascending: false })

        if (error) {
            toast.error("Error al cargar certificados: " + error.message)
        } else {
            setCertificates(data || [])
        }
        setLoading(false)
    }, [supabase])

    useEffect(() => {
        fetchCertificates()
    }, [fetchCertificates])

    const handleOpenCreate = () => {
        setEditingCert(null)
        setDialogOpen(true)
    }

    const handleOpenEdit = (cert: Certificate) => {
        setEditingCert(cert)
        setDialogOpen(true)
    }

    const uploadCertImage = async (file: File) => {
        const compressed = await compressImage(file)
        const ext = compressed.type.split("/")[1] || "webp"
        const fileName = `${crypto.randomUUID()}.${ext}`
        const filePath = `certificates/${fileName}`

        const { error } = await supabase.storage
            .from("portfolio-assets")
            .upload(filePath, compressed, {
                cacheControl: "3600",
                upsert: true,
                contentType: compressed.type,
            })

        if (error) throw error

        const { data } = supabase.storage
            .from("portfolio-assets")
            .getPublicUrl(filePath)

        return data.publicUrl
    }

    async function saveCertificate(values: CertificateFormValues, imageFile: File | null) {
        try {
            let imageUrl = values.image_url

            if (imageFile) {
                imageUrl = await uploadCertImage(imageFile)
                // If editing and we have a new image, delete the old one
                if (editingCert && editingCert.image_url && editingCert.image_url !== imageUrl) {
                    await deleteImageFromStorage(supabase, editingCert.image_url)
                }
            }

            const payload = {
                title_es: values.title_es,
                title_en: values.title_en,
                issuer: values.issuer,
                issue_date: values.issue_date,
                credential_url: values.credential_url || null,
                image_url: imageUrl || null,
                category: "General", // Default for now
                display_order: 0,
            }

            const query = editingCert
                ? supabase.from("certificates").update(payload).eq("id", editingCert.id)
                : supabase.from("certificates").insert([payload])

            const { error } = await query

            if (error) throw error

            toast.success(
                editingCert ? "Certificado actualizado" : "Certificado registrado"
            )
            setDialogOpen(false)
            setEditingCert(null)
            fetchCertificates()
        } catch (error: any) {
            toast.error("Error: " + error.message)
        }
    }

    const deleteCertificate = async (cert: Certificate) => {
        if (!confirm(`¿Eliminar certificado "${cert.title_es}"?`)) return

        setDeletingId(cert.id)

        try {
            const { error } = await supabase
                .from("certificates")
                .delete()
                .eq("id", cert.id)

            if (error) throw error

            // Cleanup storage
            if (cert.image_url) {
                await deleteImageFromStorage(supabase, cert.image_url)
            }

            toast.success("Certificado eliminado")
            fetchCertificates()
        } catch (error: any) {
            toast.error("Error al eliminar: " + error.message)
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Certificaciones</h1>
                    <p className="text-zinc-500 text-sm">Gestiona tus credenciales, insignias y diplomas.</p>
                </div>
                <Button
                    className="bg-zinc-100 text-black hover:bg-white"
                    onClick={handleOpenCreate}
                >
                    <Plus className="mr-2 h-4 w-4" /> Agregar Certificado
                </Button>
            </div>

            {loading ? (
                <div className="grid gap-4 md:grid-cols-2">
                    {[0, 1].map((i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-md bg-zinc-900" />
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {certificates.map((cert) => (
                        <Card key={cert.id} className="border-zinc-800 bg-zinc-950 hover:bg-zinc-900/50 transition-colors overflow-hidden">
                            <CardContent className="flex p-0">
                                {/* Thumbnail Image */}
                                <div className="relative h-auto w-32 bg-zinc-900 flex-shrink-0">
                                    {cert.image_url ? (
                                        <Image
                                            src={cert.image_url}
                                            alt={cert.title_es}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-zinc-700">
                                            <Award className="h-8 w-8" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 p-4 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-white text-sm line-clamp-2" title={cert.title_es}>
                                            {cert.title_es}
                                        </h3>
                                        <p className="text-xs text-zinc-400 mt-1">{cert.issuer}</p>
                                        <p className="text-[10px] text-zinc-600 font-mono mt-0.5">{cert.issue_date}</p>
                                    </div>

                                    <div className="flex items-center gap-2 mt-4 justify-end">
                                        {cert.credential_url && (
                                            <Button variant="ghost" size="icon" className="h-7 w-7 border border-green-500/40 text-green-400/80 shadow-[0_0_12px_rgba(34,197,94,0.35)] transition-shadow hover:border-green-400 hover:text-green-300 hover:bg-green-500/10 hover:shadow-[0_0_18px_rgba(34,197,94,0.6)]" asChild>
                                                <a href={cert.credential_url} target="_blank" rel="noreferrer">
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                </a>
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-zinc-400 hover:text-white"
                                            onClick={() => handleOpenEdit(cert)}
                                        >
                                            <Edit className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-zinc-400 hover:text-red-500"
                                            onClick={() => deleteCertificate(cert)}
                                            disabled={deletingId === cert.id}
                                        >
                                            {deletingId === cert.id ? (
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-3.5 w-3.5" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog
                open={dialogOpen}
                onOpenChange={(open) => {
                    setDialogOpen(open)
                    if (!open) setEditingCert(null)
                }}
            >
                <DialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100 max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCert
                                ? "Editar Certificado"
                                : "Nuevo Certificado"}
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500">
                            Registra tus logros académicos y profesionales.
                        </DialogDescription>
                    </DialogHeader>
                    <CertificateForm
                        key={editingCert?.id ?? "new"}
                        initialValues={formValues}
                        onSave={saveCertificate}
                        onCancel={() => setDialogOpen(false)}
                        submitLabel={
                            editingCert
                                ? "Guardar Cambios"
                                : "Registrar"
                        }
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
