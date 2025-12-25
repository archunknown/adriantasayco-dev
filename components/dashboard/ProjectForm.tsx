"use client"

import { useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { createClient } from "@/lib/supabase/client"
import { projectSchema } from "@/lib/validations/project"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

type TechStackItem = {
  id: string
  name: string
  category: string
}

export type ProjectFormInput = z.input<typeof projectSchema>
export type ProjectFormValues = z.output<typeof projectSchema>

type ProjectFormProps = {
  initialValues: ProjectFormInput
  onSave: (values: ProjectFormValues, imageFile: File | null) => Promise<void>
  onCancel: () => void
  submitLabel: string
}

export default function ProjectForm({
  initialValues,
  onSave,
  onCancel,
  submitLabel,
}: ProjectFormProps) {
  const supabase = createClient()
  const [techStack, setTechStack] = useState<TechStackItem[]>([])
  const [techLoading, setTechLoading] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const form = useForm<ProjectFormInput, undefined, ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialValues,
  })

  useEffect(() => {
    form.reset(initialValues)
  }, [form, initialValues])

  useEffect(() => {
    let mounted = true

    const fetchTechStack = async () => {
      setTechLoading(true)
      const { data, error } = await supabase
        .from("tech_stack")
        .select("id, name, category")
        .order("category", { ascending: true })
        .order("name", { ascending: true })

      if (mounted) {
        if (!error) {
          setTechStack(data ?? [])
        }
        setTechLoading(false)
      }
    }

    fetchTechStack()

    return () => {
      mounted = false
    }
  }, [supabase])

  const groupedTechStack = useMemo(() => {
    const groups = new Map<string, TechStackItem[]>()
    techStack.forEach((tech) => {
      const list = groups.get(tech.category) ?? []
      list.push(tech)
      groups.set(tech.category, list)
    })
    return Array.from(groups.entries())
  }, [techStack])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setImageFile(file)
    if (file) {
      form.setValue("image_url", "pending-upload", { shouldValidate: true })
      form.clearErrors("image_url")
    }
  }

  const handleSubmit = async (values: ProjectFormValues) => {
    await onSave(values, imageFile)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid gap-6 text-zinc-200"
      >
        <div className="grid gap-4 rounded-md border border-zinc-800 bg-black/50 p-4">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
            Contenido en Espanol
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="title_es"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titulo ES</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-zinc-800 bg-zinc-950 text-zinc-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description_es"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripcion ES</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[90px] border-zinc-800 bg-zinc-950 text-zinc-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="content_es"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Documentacion Tecnica ES</FormLabel>
                <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[120px] border-zinc-800 bg-zinc-950 text-zinc-100"
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 rounded-md border border-zinc-800 bg-black/50 p-4">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
            English Content
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="title_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title EN</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-zinc-800 bg-zinc-950 text-zinc-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description EN</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[90px] border-zinc-800 bg-zinc-950 text-zinc-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="content_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technical Documentation EN</FormLabel>
                <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[120px] border-zinc-800 bg-zinc-950 text-zinc-100"
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 rounded-md border border-zinc-800 bg-black/50 p-4">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
            Metadatos Operativos
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="live_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Live URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://"
                      className="border-zinc-800 bg-zinc-950 text-zinc-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="repo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repo URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://"
                      className="border-zinc-800 bg-zinc-950 text-zinc-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="display_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orden de despliegue</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value ?? 0}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value))
                      }
                      className="border-zinc-800 bg-zinc-950 text-zinc-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_featured"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proyecto destacado</FormLabel>
                  <FormControl>
                    <label className="flex items-center gap-2 text-sm text-zinc-400">
                      <input
                        type="checkbox"
                        checked={Boolean(field.value)}
                        onChange={(event) => field.onChange(event.target.checked)}
                        className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-green-500 focus:ring-green-500"
                      />
                      Marcar como prioridad en el grid
                    </label>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid gap-4 rounded-md border border-zinc-800 bg-black/50 p-4">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
            Imagen del Nodo
          </div>
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Archivo de imagen</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border-zinc-800 bg-zinc-950 text-zinc-100 file:border-0 file:bg-zinc-900 file:text-zinc-200"
                  />
                </FormControl>
                <input type="hidden" {...field} />
                <div className="text-xs text-zinc-500">
                  {imageFile?.name ??
                    (initialValues.image_url
                      ? "Imagen actual registrada."
                      : "No se ha cargado ninguna imagen.")}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 rounded-md border border-zinc-800 bg-black/50 p-4">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
            Tech Stack
          </div>
          <FormField
            control={form.control}
            name="tech_ids"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selecciona tecnologias</FormLabel>
                <FormControl>
                  <div className="grid gap-4">
                    {techLoading ? (
                      <div className="text-xs text-zinc-500">
                        Sincronizando catalogo...
                      </div>
                    ) : groupedTechStack.length === 0 ? (
                      <div className="text-xs text-zinc-500">
                        No hay tecnologias disponibles.
                      </div>
                    ) : (
                      groupedTechStack.map(([category, items]) => (
                        <div key={category} className="grid gap-2">
                          <div className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                            {category}
                          </div>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {items.map((tech) => {
                              const checked = field.value.includes(tech.id)
                              return (
                                <label
                                  key={tech.id}
                                  className="flex items-center gap-3 rounded-sm border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300"
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => {
                                      if (checked) {
                                        field.onChange(
                                          field.value.filter(
                                            (value) => value !== tech.id
                                          )
                                        )
                                      } else {
                                        field.onChange([
                                          ...field.value,
                                          tech.id,
                                        ])
                                      }
                                    }}
                                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-green-500 focus:ring-green-500"
                                  />
                                  {tech.name}
                                </label>
                              )
                            })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="border-zinc-800 text-zinc-200 hover:bg-zinc-900"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-zinc-100 text-black hover:bg-white"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Procesando..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}
