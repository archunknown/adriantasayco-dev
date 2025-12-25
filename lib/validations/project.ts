import * as z from "zod"

export const projectSchema = z.object({
    title_es: z.string().min(5, "Título demasiado corto"),
    title_en: z.string().min(5),
    description_es: z.string().min(10).max(150),
    description_en: z.string().min(10).max(150),
    content_es: z.string().min(20, "La documentación técnica es obligatoria"),
    content_en: z.string().min(20),
    live_url: z.string().url().optional().or(z.literal("")),
    repo_url: z.string().url().optional().or(z.literal("")),
    is_featured: z.boolean().default(false),
    image_url: z.string().min(1, "La imagen de nodo es obligatoria"),
    display_order: z.number().default(0),
    tech_ids: z
        .array(z.string().uuid("UUID inválido"))
        .min(1, "Selecciona al menos una tecnología"),
})
