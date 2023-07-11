export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      helbreath_items: {
        Row: {
          created_at: string | null
          first_attribute_name: string | null
          first_attribute_value: number | null
          gender: string | null
          id: number
          image_url: string | null
          name: string | null
          second_attribute_name: string | null
          second_attribute_value: number | null
          sub_type: string | null
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          first_attribute_name?: string | null
          first_attribute_value?: number | null
          gender?: string | null
          id?: number
          image_url?: string | null
          name?: string | null
          second_attribute_name?: string | null
          second_attribute_value?: number | null
          sub_type?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          first_attribute_name?: string | null
          first_attribute_value?: number | null
          gender?: string | null
          id?: number
          image_url?: string | null
          name?: string | null
          second_attribute_name?: string | null
          second_attribute_value?: number | null
          sub_type?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "helbreath_items_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          discord_id: string
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          discord_id: string
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          discord_id?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
