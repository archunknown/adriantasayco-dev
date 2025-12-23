export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      certificates: {
        Row: {
          category: string
          created_at: string
          credential_url: string | null
          display_order: number
          id: string
          image_url: string | null
          issue_date: string
          issuer: string
          title_en: string
          title_es: string
        }
        Insert: {
          category: string
          created_at?: string
          credential_url?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          issue_date: string
          issuer: string
          title_en: string
          title_es: string
        }
        Update: {
          category?: string
          created_at?: string
          credential_url?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          issue_date?: string
          issuer?: string
          title_en?: string
          title_es?: string
        }
        Relationships: []
      }
      experience_logs: {
        Row: {
          company_name: string
          created_at: string
          description_en: string
          description_es: string
          display_order: number
          end_date: string | null
          id: string
          is_current: boolean | null
          role_en: string
          role_es: string
          start_date: string
        }
        Insert: {
          company_name: string
          created_at?: string
          description_en: string
          description_es: string
          display_order?: number
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          role_en: string
          role_es: string
          start_date: string
        }
        Update: {
          company_name?: string
          created_at?: string
          description_en?: string
          description_es?: string
          display_order?: number
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          role_en?: string
          role_es?: string
          start_date?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          about_me_en: string | null
          about_me_es: string | null
          avatar_url: string | null
          contact_email: string
          cv_pdf_url: string | null
          full_name: string
          github_url: string | null
          id: string
          linkedin_url: string | null
          role_title_en: string
          role_title_es: string
          updated_at: string
        }
        Insert: {
          about_me_en?: string | null
          about_me_es?: string | null
          avatar_url?: string | null
          contact_email: string
          cv_pdf_url?: string | null
          full_name: string
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          role_title_en: string
          role_title_es: string
          updated_at?: string
        }
        Update: {
          about_me_en?: string | null
          about_me_es?: string | null
          avatar_url?: string | null
          contact_email?: string
          cv_pdf_url?: string | null
          full_name?: string
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          role_title_en?: string
          role_title_es?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_techs: {
        Row: {
          project_id: string
          tech_id: string
        }
        Insert: {
          project_id: string
          tech_id: string
        }
        Update: {
          project_id?: string
          tech_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_techs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_techs_tech_id_fkey"
            columns: ["tech_id"]
            isOneToOne: false
            referencedRelation: "tech_stack"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          content_en: string | null
          content_es: string | null
          created_at: string
          description_en: string
          description_es: string
          display_order: number
          id: string
          image_url: string
          is_featured: boolean | null
          live_url: string | null
          repo_url: string | null
          title_en: string
          title_es: string
        }
        Insert: {
          content_en?: string | null
          content_es?: string | null
          created_at?: string
          description_en: string
          description_es: string
          display_order?: number
          id?: string
          image_url: string
          is_featured?: boolean | null
          live_url?: string | null
          repo_url?: string | null
          title_en: string
          title_es: string
        }
        Update: {
          content_en?: string | null
          content_es?: string | null
          created_at?: string
          description_en?: string
          description_es?: string
          display_order?: number
          id?: string
          image_url?: string
          is_featured?: boolean | null
          live_url?: string | null
          repo_url?: string | null
          title_en?: string
          title_es?: string
        }
        Relationships: []
      }
      tech_stack: {
        Row: {
          category: string
          created_at: string
          icon_slug: string
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          icon_slug: string
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          icon_slug?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
