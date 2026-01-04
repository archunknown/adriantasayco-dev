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
import TechForm, { type TechFormValues, TECH_CATEGORIES } from "@/components/dashboard/TechForm"
import { toast } from "sonner"
import { Loader2, Plus, Cpu, Trash2, Edit, Layers } from "lucide-react"
import type { Database } from "@/types/database.types"
import { Skeleton } from "@/components/ui/skeleton"

type TechStack = Database["public"]["Tables"]["tech_stack"]["Row"]

const DEFAULT_TECH_CATEGORY: TechFormValues["category"] = TECH_CATEGORIES[0]

const isTechCategory = (value: string): value is TechFormValues["category"] => {
    return TECH_CATEGORIES.includes(value as TechFormValues["category"])
}

const normalizeCategory = (value: string): TechFormValues["category"] =>
    isTechCategory(value) ? value : DEFAULT_TECH_CATEGORY

export default function AdminTechPage() {
    const [techs, setTechs] = useState<TechStack[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingTech, setEditingTech] = useState<TechStack | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const supabase = createClient()

    const emptyFormValues: TechFormValues = useMemo(
        () => ({
            name: "",
            category: DEFAULT_TECH_CATEGORY,
            icon_slug: "",
        }),
        []
    )

    const formValues = useMemo<TechFormValues>(() => {
        if (!editingTech) return emptyFormValues

        return {
            name: editingTech.name,
            category: normalizeCategory(editingTech.category),
            icon_slug: editingTech.icon_slug,
        }
    }, [editingTech, emptyFormValues])

    const fetchTechs = useCallback(async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from("tech_stack")
            .select("*")
            .order("category", { ascending: true })

        if (error) {
            toast.error("Error al cargar módulos: " + error.message)
        } else {
            setTechs(data || [])
        }
        setLoading(false)
    }, [supabase])

    useEffect(() => {
        fetchTechs()
    }, [fetchTechs])

    const handleOpenCreate = () => {
        setEditingTech(null)
        setDialogOpen(true)
    }

    const handleOpenEdit = (tech: TechStack) => {
        setEditingTech(tech)
        setDialogOpen(true)
    }

    async function saveTech(values: TechFormValues) {
        try {
            const payload = {
                name: values.name,
                category: values.category,
                icon_slug: values.icon_slug,
            }

            const query = editingTech
                ? supabase.from("tech_stack").update(payload).eq("id", editingTech.id)
                : supabase.from("tech_stack").insert([payload])

            const { error } = await query

            if (error) throw error

            toast.success(
                editingTech ? "Módulo actualizado" : "Módulo inyectado al sistema"
            )
            setDialogOpen(false)
            setEditingTech(null)
            fetchTechs()
        } catch (error: any) {
            toast.error("Error intermitente: " + error.message)
        }
    }

    const deleteTech = async (tech: TechStack) => {
        const confirmDelete = window.confirm(
            `¿Desinstalar el módulo "${tech.name}" del sistema?`
        )
        if (!confirmDelete) return

        setDeletingId(tech.id)

        try {
            // First, delete relations in project_techs manually if CASCADE is not set, 
            // but standard Supabase fkeys usually restrict or cascade. 
            // Assuming we let the DB handle it or it might conflict if restricted.
            // Let's try deletion. If it fails due to FK, we instruct user.

            const { error } = await supabase
                .from("tech_stack")
                .delete()
                .eq("id", tech.id)

            if (error) throw error

            toast.success("Módulo eliminado correctamente")
            fetchTechs()
        } catch (error: any) {
            // Handle FK violation gracefully
            if (error.code === '23503') { // Postgres FK violation code
                toast.error("No se puede eliminar: Este módulo está siendo usado por uno o más proyectos.")
            } else {
                toast.error("Error al eliminar: " + error.message)
            }
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">System Modules</h1>
                    <p className="text-zinc-500 text-sm">Registro de dependencias y tecnologías instaladas.</p>
                </div>
                <Button
                    className="bg-zinc-100 text-black hover:bg-white"
                    onClick={handleOpenCreate}
                >
                    <Plus className="mr-2 h-4 w-4" /> Install Package
                </Button>
            </div>

            {loading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[0, 1, 2].map((i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-md bg-zinc-900" />
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {techs.map((tech) => (
                        <Card key={tech.id} className="border-zinc-800 bg-zinc-950 hover:bg-zinc-900/50 transition-colors">
                            <CardContent className="flex items-center justify-between p-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-md bg-zinc-900 p-2 text-green-500">
                                        <Cpu className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-sm">{tech.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-mono uppercase">
                                                {tech.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-zinc-400 hover:text-white"
                                        onClick={() => handleOpenEdit(tech)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-zinc-400 hover:text-red-500"
                                        onClick={() => deleteTech(tech)}
                                        disabled={deletingId === tech.id}
                                    >
                                        {deletingId === tech.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </Button>
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
                    if (!open) setEditingTech(null)
                }}
            >
                <DialogContent className="border-zinc-800 bg-[#09090b] text-zinc-100 sm:max-w-xl p-0 overflow-hidden shadow-2xl shadow-black/80">
                    <div className="p-6">
                        <DialogHeader className="border-b border-zinc-900/50 pb-6 mb-6">
                            <DialogTitle className="text-xl font-medium tracking-tight text-white flex items-center gap-2">
                                {editingTech ? (
                                    <>
                                        <div className="h-2 w-2 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                                        Configurar Módulo
                                    </>
                                ) : (
                                    <>
                                        <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                        Instalar Nuevo Paquete
                                    </>
                                )}
                            </DialogTitle>
                            <DialogDescription className="text-zinc-500 text-sm">
                                Gestiona las dependencias y tecnologías visibles en el portfolio.
                            </DialogDescription>
                        </DialogHeader>
                        <TechForm
                            key={editingTech?.id ?? "new"}
                            initialValues={formValues}
                            onSave={saveTech}
                            onCancel={() => setDialogOpen(false)}
                            submitLabel={
                                editingTech
                                    ? "Guardar Cambios"
                                    : "Instalar"
                            }
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
