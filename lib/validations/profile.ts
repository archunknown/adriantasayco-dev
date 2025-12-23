import * as z from "zod"

export const profileSchema = z.object({
    full_name: z.string().min(3, "Mínimo 3 caracteres"),
    role_title_es: z.string().min(5),
    role_title_en: z.string().min(5),
    about_me_es: z.string().min(20),
    about_me_en: z.string().min(20),
    contact_email: z.string().email(),
})