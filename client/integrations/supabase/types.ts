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
      deposits: {
        Row: {
          amount: number
          created_at: string | null
          crypto_currency: string | null
          currency: string
          id: string
          nowpayments_id: string | null
          payment_address: string | null
          status: string | null
          transaction_hash: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          crypto_currency?: string | null
          currency: string
          id?: string
          nowpayments_id?: string | null
          payment_address?: string | null
          status?: string | null
          transaction_hash?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          crypto_currency?: string | null
          currency?: string
          id?: string
          nowpayments_id?: string | null
          payment_address?: string | null
          status?: string | null
          transaction_hash?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      forex_signals: {
        Row: {
          analysis: string | null
          confidence_level: string | null
          created_at: string | null
          currency_pair: string
          entry_price: number
          exit_price: number | null
          id: string
          pips_result: number | null
          risk_level: string | null
          signal_type: string
          status: string | null
          stop_loss: number | null
          take_profit: number | null
          updated_at: string | null
        }
        Insert: {
          analysis?: string | null
          confidence_level?: string | null
          created_at?: string | null
          currency_pair: string
          entry_price: number
          exit_price?: number | null
          id?: string
          pips_result?: number | null
          risk_level?: string | null
          signal_type: string
          status?: string | null
          stop_loss?: number | null
          take_profit?: number | null
          updated_at?: string | null
        }
        Update: {
          analysis?: string | null
          confidence_level?: string | null
          created_at?: string | null
          currency_pair?: string
          entry_price?: number
          exit_price?: number | null
          id?: string
          pips_result?: number | null
          risk_level?: string | null
          signal_type?: string
          status?: string | null
          stop_loss?: number | null
          take_profit?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      investment_plans: {
        Row: {
          created_at: string | null
          description: string | null
          duration_days: number
          id: string
          is_active: boolean | null
          max_amount: number
          min_amount: number
          name: string
          roi_percentage: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_days: number
          id?: string
          is_active?: boolean | null
          max_amount: number
          min_amount: number
          name: string
          roi_percentage: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_days?: number
          id?: string
          is_active?: boolean | null
          max_amount?: number
          min_amount?: number
          name?: string
          roi_percentage?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          commission_rate: number | null
          created_at: string | null
          id: string
          referred_id: string
          referrer_id: string
          status: string | null
          total_commission_earned: number | null
        }
        Insert: {
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          referred_id: string
          referrer_id: string
          status?: string | null
          total_commission_earned?: number | null
        }
        Update: {
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          referred_id?: string
          referrer_id?: string
          status?: string | null
          total_commission_earned?: number | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_featured: boolean | null
          is_verified: boolean | null
          rating: number | null
          reviewer_name: string
          service_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          rating?: number | null
          reviewer_name: string
          service_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          rating?: number | null
          reviewer_name?: string
          service_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          admin_response: string | null
          category: string
          created_at: string | null
          description: string
          id: string
          priority: string | null
          resolved_at: string | null
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_response?: string | null
          category: string
          created_at?: string | null
          description: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_response?: string | null
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          content: string
          country: string | null
          created_at: string | null
          email: string | null
          id: string
          is_approved: boolean | null
          is_featured: boolean | null
          name: string
          profession: string | null
          rating: number | null
          updated_at: string | null
        }
        Insert: {
          content: string
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          name: string
          profession?: string | null
          rating?: number | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          name?: string
          profession?: string | null
          rating?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          reference_id: string | null
          status: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          status?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          status?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_balances: {
        Row: {
          balance: number | null
          created_at: string | null
          currency: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_investments: {
        Row: {
          actual_return: number | null
          amount: number
          created_at: string | null
          end_date: string | null
          expected_return: number
          id: string
          plan_id: string
          start_date: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          actual_return?: number | null
          amount: number
          created_at?: string | null
          end_date?: string | null
          expected_return: number
          id?: string
          plan_id: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          actual_return?: number | null
          amount?: number
          created_at?: string | null
          end_date?: string | null
          expected_return?: number
          id?: string
          plan_id?: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          country: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_verified: boolean | null
          phone_number: string | null
          telegram_id: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          phone_number?: string | null
          telegram_id?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          phone_number?: string | null
          telegram_id?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      website_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          setting_key: string
          setting_type: string | null
          setting_value: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      withdrawal_requests: {
        Row: {
          admin_notes: string | null
          amount: number
          created_at: string | null
          crypto_currency: string
          id: string
          network: string
          status: string | null
          transaction_hash: string | null
          updated_at: string | null
          user_id: string
          wallet_address: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          created_at?: string | null
          crypto_currency: string
          id?: string
          network: string
          status?: string | null
          transaction_hash?: string | null
          updated_at?: string | null
          user_id: string
          wallet_address: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          created_at?: string | null
          crypto_currency?: string
          id?: string
          network?: string
          status?: string | null
          transaction_hash?: string | null
          updated_at?: string | null
          user_id?: string
          wallet_address?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_to_balance: {
        Args: {
          user_id: string
          amount: number
        }
        Returns: boolean
      }
      auto_complete_investments: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      complete_investment: {
        Args: {
          p_investment_id: string
        }
        Returns: boolean
      }
      create_admin_user: {
        Args: {
          email: string
          password: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Returns: string
      }
      create_investment: {
        Args: {
          p_user_id: string
          p_plan_id: string
          p_amount: number
        }
        Returns: string
      }
      get_user_stats: {
        Args: {
          p_user_id: string
        }
        Returns: Json
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      process_referral_commission: {
        Args: {
          p_referred_user_id: string
          p_investment_amount: number
        }
        Returns: boolean
      }
      subtract_from_balance: {
        Args: {
          user_id: string
          amount: number
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "super_admin"
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