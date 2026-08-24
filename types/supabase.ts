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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      checklist_items: {
        Row: {
          created_at: string | null
          id: string
          owner: string
          status: string | null
          submission_id: string
          task_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          owner: string
          status?: string | null
          submission_id: string
          task_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          owner?: string
          status?: string | null
          submission_id?: string
          task_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      deliverables: {
        Row: {
          capability_doc_url: string | null
          compliance_matrix: Json | null
          created_at: string | null
          id: string
          submission_id: string
          technical_narrative: string | null
          updated_at: string | null
        }
        Insert: {
          capability_doc_url?: string | null
          compliance_matrix?: Json | null
          created_at?: string | null
          id?: string
          submission_id: string
          technical_narrative?: string | null
          updated_at?: string | null
        }
        Update: {
          capability_doc_url?: string | null
          compliance_matrix?: Json | null
          created_at?: string | null
          id?: string
          submission_id?: string
          technical_narrative?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deliverables_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      package_requests: {
        Row: {
          created_at: string | null
          delivered_packet_url: string | null
          id: string
          package_fee: number | null
          solicitation_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          delivered_packet_url?: string | null
          id?: string
          package_fee?: number | null
          solicitation_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          delivered_packet_url?: string | null
          id?: string
          package_fee?: number | null
          solicitation_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "package_requests_solicitation_id_fkey"
            columns: ["solicitation_id"]
            isOneToOne: false
            referencedRelation: "solicitations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bonding_capacity: string | null
          certifications: string[] | null
          company_name: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          email: string | null
          fein: string | null
          id: string
          insurance_coverage: string | null
          is_admin: boolean | null
          license_number: string | null
          naics_codes: string | null
          phone: string | null
          primary_trade: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          service_radius_counties: string[] | null
          small_business_status: string[] | null
          subscription_tier: string | null
          sunbiz_number: string | null
          trade: Database["public"]["Enums"]["trade_category"] | null
          updated_at: string | null
        }
        Insert: {
          bonding_capacity?: string | null
          certifications?: string[] | null
          company_name?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          email?: string | null
          fein?: string | null
          id: string
          insurance_coverage?: string | null
          is_admin?: boolean | null
          license_number?: string | null
          naics_codes?: string | null
          phone?: string | null
          primary_trade?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          service_radius_counties?: string[] | null
          small_business_status?: string[] | null
          subscription_tier?: string | null
          sunbiz_number?: string | null
          trade?: Database["public"]["Enums"]["trade_category"] | null
          updated_at?: string | null
        }
        Update: {
          bonding_capacity?: string | null
          certifications?: string[] | null
          company_name?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          email?: string | null
          fein?: string | null
          id?: string
          insurance_coverage?: string | null
          is_admin?: boolean | null
          license_number?: string | null
          naics_codes?: string | null
          phone?: string | null
          primary_trade?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          service_radius_counties?: string[] | null
          small_business_status?: string[] | null
          subscription_tier?: string | null
          sunbiz_number?: string | null
          trade?: Database["public"]["Enums"]["trade_category"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      proposal_requests: {
        Row: {
          created_at: string
          current_step_index: number | null
          document_version: string | null
          id: string
          issuing_agency: string
          raw_payload: Json | null
          snapshot_url: string | null
          solicitation_id: string | null
          solicitation_title: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_step_index?: number | null
          document_version?: string | null
          id?: string
          issuing_agency: string
          raw_payload?: Json | null
          snapshot_url?: string | null
          solicitation_id?: string | null
          solicitation_title: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_step_index?: number | null
          document_version?: string | null
          id?: string
          issuing_agency?: string
          raw_payload?: Json | null
          snapshot_url?: string | null
          solicitation_id?: string | null
          solicitation_title?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rfp_submissions: {
        Row: {
          agency: string | null
          budget: string | null
          business_name: string
          contact_name: string
          created_at: string
          document_url: string | null
          due_date: string | null
          email: string
          id: string
          phone: string | null
          solicitation_title: string
          status: string
        }
        Insert: {
          agency?: string | null
          budget?: string | null
          business_name: string
          contact_name: string
          created_at?: string
          document_url?: string | null
          due_date?: string | null
          email: string
          id?: string
          phone?: string | null
          solicitation_title: string
          status?: string
        }
        Update: {
          agency?: string | null
          budget?: string | null
          business_name?: string
          contact_name?: string
          created_at?: string
          document_url?: string | null
          due_date?: string | null
          email?: string
          id?: string
          phone?: string | null
          solicitation_title?: string
          status?: string
        }
        Relationships: []
      }
      solicitations: {
        Row: {
          agency: string
          created_at: string | null
          estimated_value: string | null
          id: string
          portal_url: string | null
          pre_bid_date: string | null
          solicitation_number: string
          status: string | null
          submission_deadline: string
          title: string
          trade: Database["public"]["Enums"]["trade_category"]
        }
        Insert: {
          agency: string
          created_at?: string | null
          estimated_value?: string | null
          id?: string
          portal_url?: string | null
          pre_bid_date?: string | null
          solicitation_number: string
          status?: string | null
          submission_deadline: string
          title: string
          trade: Database["public"]["Enums"]["trade_category"]
        }
        Update: {
          agency?: string
          created_at?: string | null
          estimated_value?: string | null
          id?: string
          portal_url?: string | null
          pre_bid_date?: string | null
          solicitation_number?: string
          status?: string | null
          submission_deadline?: string
          title?: string
          trade?: Database["public"]["Enums"]["trade_category"]
        }
        Relationships: []
      }
      submissions: {
        Row: {
          created_at: string | null
          due_date: string | null
          id: string
          internal_notes: string | null
          issuing_agency: string
          pdf_file_url: string | null
          pilot_stage: number | null
          set_asides: string[] | null
          solicitation_number: string
          solicitation_title: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          due_date?: string | null
          id?: string
          internal_notes?: string | null
          issuing_agency: string
          pdf_file_url?: string | null
          pilot_stage?: number | null
          set_asides?: string[] | null
          solicitation_number: string
          solicitation_title?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          due_date?: string | null
          id?: string
          internal_notes?: string | null
          issuing_agency?: string
          pdf_file_url?: string | null
          pilot_stage?: number | null
          set_asides?: string[] | null
          solicitation_number?: string
          solicitation_title?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      trade_category:
        | "commercial_janitorial"
        | "landscaping_grounds"
        | "pressure_washing_facades"
        | "commercial_painting"
        | "security_guard_services"
        | "hvac_preventative_maintenance"
        | "hauling_waste_removal"
      user_role: "client" | "specialist" | "admin"
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
    Enums: {
      trade_category: [
        "commercial_janitorial",
        "landscaping_grounds",
        "pressure_washing_facades",
        "commercial_painting",
        "security_guard_services",
        "hvac_preventative_maintenance",
        "hauling_waste_removal",
      ],
      user_role: ["client", "specialist", "admin"],
    },
  },
} as const
