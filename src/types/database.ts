/* eslint-disable no-unused-vars */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      assessment_response: {
        Row: {
          assessment_result_id: string;
          is_correct: boolean;
          multiple_choice_id: string;
          question_id: string;
        };
        Insert: {
          assessment_result_id: string;
          is_correct: boolean;
          multiple_choice_id: string;
          question_id: string;
        };
        Update: {
          assessment_result_id?: string;
          is_correct?: boolean;
          multiple_choice_id?: string;
          question_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "assessment_response_assessment_result_id_fkey";
            columns: ["assessment_result_id"];
            isOneToOne: false;
            referencedRelation: "assessment_result";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "assessment_response_multiple_choice_id_fkey";
            columns: ["multiple_choice_id"];
            isOneToOne: false;
            referencedRelation: "multiple_choice";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "assessment_response_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "question";
            referencedColumns: ["id"];
          },
        ];
      };
      assessment_result: {
        Row: {
          created_at: string;
          id: string;
          material_id: string;
          type: Database["public"]["Enums"]["assessment_type"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          material_id: string;
          type: Database["public"]["Enums"]["assessment_type"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          material_id?: string;
          type?: Database["public"]["Enums"]["assessment_type"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "assessment_result_material_id_fkey";
            columns: ["material_id"];
            isOneToOne: false;
            referencedRelation: "material";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "assessment_result_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      domain: {
        Row: {
          id: string;
          name: string;
          tag: Database["public"]["Enums"]["domain_tag"];
        };
        Insert: {
          id: string;
          name: string;
          tag: Database["public"]["Enums"]["domain_tag"];
        };
        Update: {
          id?: string;
          name?: string;
          tag?: Database["public"]["Enums"]["domain_tag"];
        };
        Relationships: [];
      };
      domain_material: {
        Row: {
          domain_id: string;
          material_id: string;
          material_number: number;
        };
        Insert: {
          domain_id: string;
          material_id: string;
          material_number: number;
        };
        Update: {
          domain_id?: string;
          material_id?: string;
          material_number?: number;
        };
        Relationships: [
          {
            foreignKeyName: "domain_material_domain_id_fkey";
            columns: ["domain_id"];
            isOneToOne: false;
            referencedRelation: "domain";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "domain_material_material_id_fkey";
            columns: ["material_id"];
            isOneToOne: false;
            referencedRelation: "material";
            referencedColumns: ["id"];
          },
        ];
      };
      learning_material: {
        Row: {
          description: string;
          id: string;
          learning_module_url: string;
          name: string;
          type: Database["public"]["Enums"]["learning_material_type"];
        };
        Insert: {
          description: string;
          id: string;
          learning_module_url: string;
          name: string;
          type: Database["public"]["Enums"]["learning_material_type"];
        };
        Update: {
          description?: string;
          id?: string;
          learning_module_url?: string;
          name?: string;
          type?: Database["public"]["Enums"]["learning_material_type"];
        };
        Relationships: [];
      };
      learning_material_question: {
        Row: {
          learning_material_id: string;
          question_id: string;
        };
        Insert: {
          learning_material_id: string;
          question_id: string;
        };
        Update: {
          learning_material_id?: string;
          question_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "learning_material_question_learning_material_id_fkey";
            columns: ["learning_material_id"];
            isOneToOne: false;
            referencedRelation: "learning_material";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "learning_material_question_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "question";
            referencedColumns: ["id"];
          },
        ];
      };
      material: {
        Row: {
          description: string;
          id: string;
          name: string;
        };
        Insert: {
          description: string;
          id: string;
          name: string;
        };
        Update: {
          description?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      material_learning_material: {
        Row: {
          learning_material_id: string;
          material_id: string;
          sequence_number: number;
        };
        Insert: {
          learning_material_id: string;
          material_id: string;
          sequence_number: number;
        };
        Update: {
          learning_material_id?: string;
          material_id?: string;
          sequence_number?: number;
        };
        Relationships: [
          {
            foreignKeyName: "material_learning_material_learning_material_id_fkey";
            columns: ["learning_material_id"];
            isOneToOne: false;
            referencedRelation: "learning_material";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "material_learning_material_material_id_fkey";
            columns: ["material_id"];
            isOneToOne: false;
            referencedRelation: "material";
            referencedColumns: ["id"];
          },
        ];
      };
      multiple_choice: {
        Row: {
          content: string;
          id: string;
          is_correct_answer: boolean;
          question_id: string;
        };
        Insert: {
          content: string;
          id: string;
          is_correct_answer: boolean;
          question_id: string;
        };
        Update: {
          content?: string;
          id?: string;
          is_correct_answer?: boolean;
          question_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "multiple_choice_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "question";
            referencedColumns: ["id"];
          },
        ];
      };
      question: {
        Row: {
          content: string;
          explanation: string;
          id: string;
          taxonomy_bloom: string;
        };
        Insert: {
          content: string;
          explanation: string;
          id: string;
          taxonomy_bloom: string;
        };
        Update: {
          content?: string;
          explanation?: string;
          id?: string;
          taxonomy_bloom?: string;
        };
        Relationships: [];
      };
      user: {
        Row: {
          avatar_url: string;
          email: string;
          id: string;
          major: Database["public"]["Enums"]["school_major"] | null;
          name: string;
        };
        Insert: {
          avatar_url: string;
          email: string;
          id: string;
          major?: Database["public"]["Enums"]["school_major"] | null;
          name: string;
        };
        Update: {
          avatar_url?: string;
          email?: string;
          id?: string;
          major?: Database["public"]["Enums"]["school_major"] | null;
          name?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      assessment_type: "asesmen_kesiapan_belajar" | "asesmen_akhir";
      domain_tag: "bil" | "alj" | "geo" | "pgk" | "adp" | "kal";
      learning_material_type: "prerequisite" | "sub_material";
      school_major: "ips" | "ipa";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

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
    : never;