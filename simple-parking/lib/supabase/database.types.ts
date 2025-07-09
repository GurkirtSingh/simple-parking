export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      properties: {
        Row: {
          address: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      property_levels: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          name: string
          property_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string
          id?: string
          name: string
          property_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          name?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_levels_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_stalls: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          is_accessible: boolean | null
          is_active: boolean | null
          is_compact: boolean | null
          is_electric: boolean | null
          is_large: boolean | null
          name: string
          property_id: string
          property_level_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string
          id?: string
          is_accessible?: boolean | null
          is_active?: boolean | null
          is_compact?: boolean | null
          is_electric?: boolean | null
          is_large?: boolean | null
          name: string
          property_id: string
          property_level_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          is_accessible?: boolean | null
          is_active?: boolean | null
          is_compact?: boolean | null
          is_electric?: boolean | null
          is_large?: boolean | null
          name?: string
          property_id?: string
          property_level_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_stalls_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_stalls_property_level_id_fkey"
            columns: ["property_level_id"]
            isOneToOne: false
            referencedRelation: "property_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          check_in: string
          check_out: string
          created_at: string | null
          created_by: string | null
          hotel_reservation_number: string | null
          hotel_room_number: string | null
          id: string
          is_staff: boolean | null
          license_plate: string | null
          notes: string | null
          property_id: string
          staff_name: string | null
          stall_id: string
        }
        Insert: {
          check_in?: string
          check_out: string
          created_at?: string | null
          created_by?: string | null
          hotel_reservation_number?: string | null
          hotel_room_number?: string | null
          id?: string
          is_staff?: boolean | null
          license_plate?: string | null
          notes?: string | null
          property_id: string
          staff_name?: string | null
          stall_id: string
        }
        Update: {
          check_in?: string
          check_out?: string
          created_at?: string | null
          created_by?: string | null
          hotel_reservation_number?: string | null
          hotel_room_number?: string | null
          id?: string
          is_staff?: boolean | null
          license_plate?: string | null
          notes?: string | null
          property_id?: string
          staff_name?: string | null
          stall_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_property"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_stall"
            columns: ["stall_id"]
            isOneToOne: false
            referencedRelation: "property_stalls"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Relationships: []
      }
      user_properties: {
        Row: {
          property_id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          property_id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          property_id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      current_reservation_status: {
        Row: {
          hotel_reservation_number: string | null
          hotel_room_number: string | null
          is_staff: boolean | null
          license_plate: string | null
          notes: string | null
          reservation_id: string | null
          staff_name: string | null
          stall_id: string | null
          status: string | null
        }
        Insert: {
          hotel_reservation_number?: string | null
          hotel_room_number?: string | null
          is_staff?: boolean | null
          license_plate?: string | null
          notes?: string | null
          reservation_id?: string | null
          staff_name?: string | null
          stall_id?: string | null
          status?: never
        }
        Update: {
          hotel_reservation_number?: string | null
          hotel_room_number?: string | null
          is_staff?: boolean | null
          license_plate?: string | null
          notes?: string | null
          reservation_id?: string | null
          staff_name?: string | null
          stall_id?: string | null
          status?: never
        }
        Relationships: [
          {
            foreignKeyName: "fk_stall"
            columns: ["stall_id"]
            isOneToOne: false
            referencedRelation: "property_stalls"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "admin" | "staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      user_role: ["admin", "staff"],
    },
  },
} as const