"use client"


import { useCallback, useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { compressImage } from "@/lib/utils/image-compression"
import { deleteImageFromStorage } from "@/lib/utils/storage-cleanup"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import ProjectForm, {
    type ProjectFormInput,
    type ProjectFormValues,
} from "@/components/dashboard/ProjectForm"
import { toast } from "sonner"
import { Loader2, Plus, FolderCode, Trash2, Edit } from "lucide-react"
import type { Database } from "@/types/database.types"
import { Skeleton } from "@/components/ui/skeleton"

// Definimos el tipo basado en la respuesta de Supabase para evitar el error 'any'
type ProjectWithTechs = Database["public"]["Tables"]["projects"]["Row"] & {
    project_techs: {
        tech_id: string
        tech_stack: {
            name: string
        }
    }[]
}

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<ProjectWithTechs[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingProject, setEditingProject] = useState<ProjectWithTechs | null>(
        null
    )
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const supabase = createClient()

    const emptyFormValues: ProjectFormInput = useMemo(
        () => ({
            title_es: "",
            title_en: "",
            description_es: "",
            description_en: "",
            content_es: "",
            content_en: "",
            live_url: "",
            repo_url: "",
            is_featured: false,
            image_url: "",
            display_order: 0,
            tech_ids: [],
        }),
        []
    )

    const formValues = useMemo<ProjectFormInput>(() => {
        if (!editingProject) return emptyFormValues

        return {
            title_es: editingProject.title_es ?? "",
            title_en: editingProject.title_en ?? "",
            description_es: editingProject.description_es ?? "",
            description_en: editingProject.description_en ?? "",
            content_es: editingProject.content_es ?? "",
            content_en: editingProject.content_en ?? "",
            live_url: editingProject.live_url ?? "",
            repo_url: editingProject.repo_url ?? "",
            is_featured: Boolean(editingProject.is_featured),
            image_url: editingProject.image_url ?? "",
            display_order: editingProject.display_order ?? 0,
            tech_ids: editingProject.project_techs?.map((tech) => tech.tech_id) ?? [],
        }
    }, [editingProject, emptyFormValues])

    // Función para obtener nodos (proyectos) con sus dependencias
    const fetchProjects = useCallback(async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('projects')
            .select(`
        *,
        project_techs (
          tech_id,
          tech_stack (name)
        )
      `)
            .order('display_order', { ascending: true })

        if (error) {
            toast.error("Error al sincronizar nodos: " + error.message)
        } else {
            setProjects(data || [])
        }
        setLoading(false)
    }, [supabase])

    useEffect(() => {
        fetchProjects()
    }, [fetchProjects])

    const handleOpenCreate = () => {
        setEditingProject(null)
        setDialogOpen(true)
    }

    const handleOpenEdit = (project: ProjectWithTechs) => {
        setEditingProject(project)
        setDialogOpen(true)
    }

    const getErrorMessage = (error: unknown) => {
        if (error instanceof Error) return error.message
        return "Error inesperado"
    }

    const uploadProjectImage = async (file: File) => {
        const compressed = await compressImage(file)
        const extFromType = compressed.type?.split("/")?.[1]
        const extFromName = file.name.split(".").pop()
        const extension = extFromType || extFromName || "webp"
        const fileName = `${crypto.randomUUID()}.${extension}`
        const filePath = `projects/${fileName}`

        const { error } = await supabase.storage
            .from("portfolio-assets")
            .upload(filePath, compressed, {
                cacheControl: "3600",
                upsert: true,
                contentType: compressed.type,
            })

        if (error) {
            throw error
        }

        const { data } = supabase.storage
            .from("portfolio-assets")
            .getPublicUrl(filePath)

        return data.publicUrl
    }



    // Lógica de guardado atómico
    async function saveProject(
        values: ProjectFormValues,
        imageFile: File | null
    ) {
        const { tech_ids, ...projectData } = values

        try {
            let imageUrl = projectData.image_url

            if (imageFile) {
                imageUrl = await uploadProjectImage(imageFile)
                // If editing and we have a new image, delete the old one
                if (
                    editingProject &&
                    editingProject.image_url &&
                    editingProject.image_url !== imageUrl
                ) {
                    await deleteImageFromStorage(supabase, editingProject.image_url)
                }
            }

            if (!imageUrl) {
                toast.error("La imagen de nodo es obligatoria")
                return
            }

            // 1. Upsert del Proyecto
            const normalizedPayload = {
                ...projectData,
                image_url: imageUrl,
                display_order: projectData.display_order ?? 0,
                is_featured: projectData.is_featured ?? false,
            }

            const payload = editingProject
                ? {
                    ...normalizedPayload,
                    id: editingProject.id,
                }
                : {
                    ...normalizedPayload,
                }

            const { data: project, error: pError } = await supabase
                .from("projects")
                .upsert(payload)
                .select()
                .single()

            if (pError) throw pError

            // 2. Sincronización de Relaciones (M:N)
            const { error: clearError } = await supabase
                .from("project_techs")
                .delete()
                .eq("project_id", project.id)

            if (clearError) throw clearError

            const relations = tech_ids.map((tId: string) => ({
                project_id: project.id,
                tech_id: tId,
            }))

            const { error: rError } = await supabase
                .from("project_techs")
                .insert(relations)
            if (rError) throw rError

            toast.success(
                editingProject
                    ? "Nodo actualizado correctamente"
                    : "Nodo creado correctamente"
            )
            setDialogOpen(false)
            setEditingProject(null)
            fetchProjects()
        } catch (error: unknown) {
            toast.error("Fallo en la orquestacion: " + getErrorMessage(error))
        }
    }

    const deleteProject = async (project: ProjectWithTechs) => {
        const confirmDelete = window.confirm(
            `Eliminar el nodo "${project.title_es}" y su imagen asociada?`
        )
        if (!confirmDelete) return

        setDeletingId(project.id)

        try {
            const { error: relError } = await supabase
                .from("project_techs")
                .delete()
                .eq("project_id", project.id)
            if (relError) throw relError

            const { error: deleteError } = await supabase
                .from("projects")
                .delete()
                .eq("id", project.id)
            if (deleteError) throw deleteError

            if (project.image_url) {
                await deleteImageFromStorage(supabase, project.image_url)
            }

            toast.success("Nodo eliminado correctamente")
            fetchProjects()
        } catch (error: unknown) {
            toast.error(
                "Error al eliminar el nodo: " + getErrorMessage(error)
            )
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Gestión de Nodos (Proyectos)</h1>
                    <p className="text-zinc-500 text-sm">Administra los módulos de software desplegados en tu cluster.</p>
                </div>
                <Button
                    className="bg-zinc-100 text-black hover:bg-white"
                    onClick={handleOpenCreate}
                >
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
                </Button>
            </div>

            {loading ? (
                <div className="grid gap-4">
                    {[0, 1, 2].map((i) => (
                        <Card key={i} className="border-zinc-800 bg-zinc-950">
                            <CardContent className="flex items-center justify-between p-6">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-10 w-10 rounded-md" />
                                    <div>
                                        <Skeleton className="h-5 w-40 mb-1" />
                                        <Skeleton className="h-3 w-64" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-9 w-9 rounded-md" />
                                    <Skeleton className="h-9 w-9 rounded-md" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid gap-4">
                    {projects.map((project) => (
                        <Card key={project.id} className="border-zinc-800 bg-zinc-950">
                            <CardContent className="flex items-center justify-between p-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-md bg-zinc-900 p-2">
                                        <FolderCode className="h-6 w-6 text-zinc-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{project.title_es}</h3>
                                        <p className="text-xs text-zinc-500">{project.description_en}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="border-zinc-800"
                                        onClick={() => handleOpenEdit(project)}
                                        aria-label={`Editar proyecto ${project.title_es}`}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="border-zinc-800 text-red-900 hover:text-red-500"
                                        onClick={() => deleteProject(project)}
                                        disabled={deletingId === project.id}
                                        aria-label={`Eliminar proyecto ${project.title_es}`}
                                    >
                                        {deletingId === project.id ? (
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
                    if (!open) setEditingProject(null)
                }}
            >
                <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto border-zinc-800 bg-zinc-950 text-zinc-100">
                    <DialogHeader>
                        <DialogTitle>
                            {editingProject
                                ? "Actualizar Nodo"
                                : "Nuevo Nodo de Proyecto"}
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500">
                            Define el payload tecnico, las relaciones y la
                            telemetria visual del nodo.
                        </DialogDescription>
                    </DialogHeader>
                    <ProjectForm
                        key={editingProject?.id ?? "new"}
                        initialValues={formValues}
                        onSave={saveProject}
                        onCancel={() => setDialogOpen(false)}
                        submitLabel={
                            editingProject
                                ? "Actualizar Nodo"
                                : "Crear Nodo"
                        }
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
