export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      checklist_items: {
        Row: {
          action: string | null
          category: string
          conformite: string | null
          constats: string | null
          created_at: string
          critere: string | null
          datePrevue: string | null
          etat: string | null
          id: string
          note: string | null
          original_id: string | null
          resp: string | null
          score: string | null
          volet: string | null
        }
        Insert: {
          action?: string | null
          category: string
          conformite?: string | null
          constats?: string | null
          created_at?: string
          critere?: string | null
          datePrevue?: string | null
          etat?: string | null
          id?: string
          note?: string | null
          original_id?: string | null
          resp?: string | null
          score?: string | null
          volet?: string | null
        }
        Update: {
          action?: string | null
          category?: string
          conformite?: string | null
          constats?: string | null
          created_at?: string
          critere?: string | null
          datePrevue?: string | null
          etat?: string | null
          id?: string
          note?: string | null
          original_id?: string | null
          resp?: string | null
          score?: string | null
          volet?: string | null
        }
        Relationships: []
      }
      scenario_actions: {
        Row: {
          action: string | null
          commentaires: string | null
          created_at: string
          datePrevue: string | null
          id: string
          point: string | null
          resp: string | null
          scenario_id: number
          statut: string | null
        }
        Insert: {
          action?: string | null
          commentaires?: string | null
          created_at?: string
          datePrevue?: string | null
          id?: string
          point?: string | null
          resp?: string | null
          scenario_id: number
          statut?: string | null
        }
        Update: {
          action?: string | null
          commentaires?: string | null
          created_at?: string
          datePrevue?: string | null
          id?: string
          point?: string | null
          resp?: string | null
          scenario_id?: number
          statut?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scenario_actions_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      scenarios: {
        Row: {
          completed: boolean
          created_at: string
          id: number
          title: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id: number
          title: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: number
          title?: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never