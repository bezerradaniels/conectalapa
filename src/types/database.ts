/**
 * AUTO-GENERATED FILE — DO NOT EDIT DIRECTLY.
 * Generated from live Supabase schema via `npm run db:types`.
 * Source of truth: vydymabffpgfrigkbtax (schema: public)
 */

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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      amenities: {
        Row: {
          created_at: string
          domain: string | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          domain?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          domain?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      anuncios: {
        Row: {
          anunciante: string | null
          ativo: boolean
          cliques: number
          criado_em: string
          fim_em: string
          id: string
          imagem_url: string
          impressoes: number
          inicio_em: string
          link_url: string
          posicao: Database["public"]["Enums"]["posicao_anuncio"]
          titulo: string
        }
        Insert: {
          anunciante?: string | null
          ativo?: boolean
          cliques?: number
          criado_em?: string
          fim_em: string
          id?: string
          imagem_url: string
          impressoes?: number
          inicio_em?: string
          link_url: string
          posicao: Database["public"]["Enums"]["posicao_anuncio"]
          titulo: string
        }
        Update: {
          anunciante?: string | null
          ativo?: boolean
          cliques?: number
          criado_em?: string
          fim_em?: string
          id?: string
          imagem_url?: string
          impressoes?: number
          inicio_em?: string
          link_url?: string
          posicao?: Database["public"]["Enums"]["posicao_anuncio"]
          titulo?: string
        }
        Relationships: []
      }
      assinaturas: {
        Row: {
          atualizado_em: string
          ciclo: Database["public"]["Enums"]["ciclo_cobranca"] | null
          criado_em: string
          empresa_id: string
          id: string
          inicio_em: string
          origem: Database["public"]["Enums"]["origem_assinatura"]
          plano_codigo: Database["public"]["Enums"]["plano_codigo"]
          situacao: Database["public"]["Enums"]["situacao_assinatura"]
          vence_em: string | null
        }
        Insert: {
          atualizado_em?: string
          ciclo?: Database["public"]["Enums"]["ciclo_cobranca"] | null
          criado_em?: string
          empresa_id: string
          id?: string
          inicio_em?: string
          origem?: Database["public"]["Enums"]["origem_assinatura"]
          plano_codigo?: Database["public"]["Enums"]["plano_codigo"]
          situacao?: Database["public"]["Enums"]["situacao_assinatura"]
          vence_em?: string | null
        }
        Update: {
          atualizado_em?: string
          ciclo?: Database["public"]["Enums"]["ciclo_cobranca"] | null
          criado_em?: string
          empresa_id?: string
          id?: string
          inicio_em?: string
          origem?: Database["public"]["Enums"]["origem_assinatura"]
          plano_codigo?: Database["public"]["Enums"]["plano_codigo"]
          situacao?: Database["public"]["Enums"]["situacao_assinatura"]
          vence_em?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assinaturas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: true
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assinaturas_plano_codigo_fkey"
            columns: ["plano_codigo"]
            isOneToOne: false
            referencedRelation: "planos"
            referencedColumns: ["codigo"]
          },
        ]
      }
      business_amenities: {
        Row: {
          amenity_id: string
          business_id: string
        }
        Insert: {
          amenity_id: string
          business_id: string
        }
        Update: {
          amenity_id?: string
          business_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_amenities_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          additional_links: Json | null
          address: string | null
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          instagram: string | null
          logo_url: string | null
          name: string
          opening_hours: Json | null
          services: string[] | null
          slug: string
          status: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          additional_links?: Json | null
          address?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          instagram?: string | null
          logo_url?: string | null
          name: string
          opening_hours?: Json | null
          services?: string[] | null
          slug: string
          status?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          additional_links?: Json | null
          address?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          instagram?: string | null
          logo_url?: string | null
          name?: string
          opening_hours?: Json | null
          services?: string[] | null
          slug?: string
          status?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias: {
        Row: {
          ativa: boolean
          categoria_pai_id: string | null
          criado_em: string
          icone: string | null
          id: string
          nome: string
          ordem: number
          slug: string
          tipo_listagem: Database["public"]["Enums"]["tipo_listagem"]
        }
        Insert: {
          ativa?: boolean
          categoria_pai_id?: string | null
          criado_em?: string
          icone?: string | null
          id?: string
          nome: string
          ordem?: number
          slug: string
          tipo_listagem: Database["public"]["Enums"]["tipo_listagem"]
        }
        Update: {
          ativa?: boolean
          categoria_pai_id?: string | null
          criado_em?: string
          icone?: string | null
          id?: string
          nome?: string
          ordem?: number
          slug?: string
          tipo_listagem?: Database["public"]["Enums"]["tipo_listagem"]
        }
        Relationships: [
          {
            foreignKeyName: "categorias_categoria_pai_id_fkey"
            columns: ["categoria_pai_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          domain: string
          icon: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          domain: string
          icon?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          domain?: string
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      cidades: {
        Row: {
          criado_em: string
          id: string
          nome: string
          principal: boolean
          slug: string
          uf: string
        }
        Insert: {
          criado_em?: string
          id?: string
          nome: string
          principal?: boolean
          slug: string
          uf?: string
        }
        Update: {
          criado_em?: string
          id?: string
          nome?: string
          principal?: boolean
          slug?: string
          uf?: string
        }
        Relationships: []
      }
      convites: {
        Row: {
          aceito_em: string | null
          aceito_por: string | null
          criado_em: string
          criado_por: string
          email: string | null
          empresa_id: string
          expira_em: string
          id: string
          papel: Database["public"]["Enums"]["papel_membro"]
          token: string
        }
        Insert: {
          aceito_em?: string | null
          aceito_por?: string | null
          criado_em?: string
          criado_por: string
          email?: string | null
          empresa_id: string
          expira_em?: string
          id?: string
          papel?: Database["public"]["Enums"]["papel_membro"]
          token?: string
        }
        Update: {
          aceito_em?: string | null
          aceito_por?: string | null
          criado_em?: string
          criado_por?: string
          email?: string | null
          empresa_id?: string
          expira_em?: string
          id?: string
          papel?: Database["public"]["Enums"]["papel_membro"]
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "convites_aceito_por_fkey"
            columns: ["aceito_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "convites_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "convites_empresa_fk"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      denuncias: {
        Row: {
          criado_em: string
          decidido_em: string | null
          decidido_por: string | null
          detalhes: string | null
          email_contato: string | null
          empresa_id: string
          id: string
          motivo: string
          situacao: Database["public"]["Enums"]["situacao_fila"]
        }
        Insert: {
          criado_em?: string
          decidido_em?: string | null
          decidido_por?: string | null
          detalhes?: string | null
          email_contato?: string | null
          empresa_id: string
          id?: string
          motivo: string
          situacao?: Database["public"]["Enums"]["situacao_fila"]
        }
        Update: {
          criado_em?: string
          decidido_em?: string | null
          decidido_por?: string | null
          detalhes?: string | null
          email_contato?: string | null
          empresa_id?: string
          id?: string
          motivo?: string
          situacao?: Database["public"]["Enums"]["situacao_fila"]
        }
        Relationships: [
          {
            foreignKeyName: "denuncias_decidido_por_fkey"
            columns: ["decidido_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "denuncias_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      dining: {
        Row: {
          address: string | null
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          instagram: string | null
          name: string
          opening_hours: Json | null
          price_range: string | null
          restaurant_type: string
          slug: string
          status: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          instagram?: string | null
          name: string
          opening_hours?: Json | null
          price_range?: string | null
          restaurant_type: string
          slug: string
          status?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          instagram?: string | null
          name?: string
          opening_hours?: Json | null
          price_range?: string | null
          restaurant_type?: string
          slug?: string
          status?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dining_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      dining_amenities: {
        Row: {
          amenity_id: string
          dining_id: string
        }
        Insert: {
          amenity_id: string
          dining_id: string
        }
        Update: {
          amenity_id?: string
          dining_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dining_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dining_amenities_dining_id_fkey"
            columns: ["dining_id"]
            isOneToOne: false
            referencedRelation: "dining"
            referencedColumns: ["id"]
          },
        ]
      }
      empresa_categorias: {
        Row: {
          categoria_id: string
          empresa_id: string
          principal: boolean
        }
        Insert: {
          categoria_id: string
          empresa_id: string
          principal?: boolean
        }
        Update: {
          categoria_id?: string
          empresa_id?: string
          principal?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "empresa_categorias_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empresa_categorias_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresa_equipe: {
        Row: {
          cargo: string | null
          criado_em: string
          empresa_id: string
          foto_url: string | null
          id: string
          nome: string
          ordem: number
        }
        Insert: {
          cargo?: string | null
          criado_em?: string
          empresa_id: string
          foto_url?: string | null
          id?: string
          nome: string
          ordem?: number
        }
        Update: {
          cargo?: string | null
          criado_em?: string
          empresa_id?: string
          foto_url?: string | null
          id?: string
          nome?: string
          ordem?: number
        }
        Relationships: [
          {
            foreignKeyName: "empresa_equipe_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresa_fotos: {
        Row: {
          criado_em: string
          empresa_id: string
          id: string
          legenda: string | null
          ordem: number
          url: string
        }
        Insert: {
          criado_em?: string
          empresa_id: string
          id?: string
          legenda?: string | null
          ordem?: number
          url: string
        }
        Update: {
          criado_em?: string
          empresa_id?: string
          id?: string
          legenda?: string | null
          ordem?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "empresa_fotos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresa_horarios: {
        Row: {
          abre_1: string | null
          abre_2: string | null
          dia_semana: number
          empresa_id: string
          fecha_1: string | null
          fecha_2: string | null
          fechado: boolean
          id: string
        }
        Insert: {
          abre_1?: string | null
          abre_2?: string | null
          dia_semana: number
          empresa_id: string
          fecha_1?: string | null
          fecha_2?: string | null
          fechado?: boolean
          id?: string
        }
        Update: {
          abre_1?: string | null
          abre_2?: string | null
          dia_semana?: number
          empresa_id?: string
          fecha_1?: string | null
          fecha_2?: string | null
          fechado?: boolean
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "empresa_horarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresa_horarios_excecoes: {
        Row: {
          abre: string | null
          data: string
          empresa_id: string
          fecha: string | null
          fechado: boolean
          id: string
          observacao: string | null
        }
        Insert: {
          abre?: string | null
          data: string
          empresa_id: string
          fecha?: string | null
          fechado?: boolean
          id?: string
          observacao?: string | null
        }
        Update: {
          abre?: string | null
          data?: string
          empresa_id?: string
          fecha?: string | null
          fechado?: boolean
          id?: string
          observacao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empresa_horarios_excecoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresa_links: {
        Row: {
          criado_em: string
          empresa_id: string
          id: string
          ordem: number
          rotulo: string | null
          tipo: string
          url: string
        }
        Insert: {
          criado_em?: string
          empresa_id: string
          id?: string
          ordem?: number
          rotulo?: string | null
          tipo?: string
          url: string
        }
        Update: {
          criado_em?: string
          empresa_id?: string
          id?: string
          ordem?: number
          rotulo?: string | null
          tipo?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "empresa_links_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresa_membros: {
        Row: {
          criado_em: string
          empresa_id: string
          id: string
          papel: Database["public"]["Enums"]["papel_membro"]
          usuario_id: string
        }
        Insert: {
          criado_em?: string
          empresa_id: string
          id?: string
          papel?: Database["public"]["Enums"]["papel_membro"]
          usuario_id: string
        }
        Update: {
          criado_em?: string
          empresa_id?: string
          id?: string
          papel?: Database["public"]["Enums"]["papel_membro"]
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "empresa_membros_empresa_fk"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empresa_membros_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      empresa_recursos: {
        Row: {
          empresa_id: string
          recurso_id: string
        }
        Insert: {
          empresa_id: string
          recurso_id: string
        }
        Update: {
          empresa_id?: string
          recurso_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "empresa_recursos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empresa_recursos_recurso_id_fkey"
            columns: ["recurso_id"]
            isOneToOne: false
            referencedRelation: "recursos_catalogo"
            referencedColumns: ["id"]
          },
        ]
      }
      empresa_servicos: {
        Row: {
          destaque: boolean
          empresa_id: string
          ordem: number
          servico_id: string
        }
        Insert: {
          destaque?: boolean
          empresa_id: string
          ordem?: number
          servico_id: string
        }
        Update: {
          destaque?: boolean
          empresa_id?: string
          ordem?: number
          servico_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "empresa_servicos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empresa_servicos_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos_catalogo"
            referencedColumns: ["id"]
          },
        ]
      }
      empresa_slugs_historico: {
        Row: {
          criado_em: string
          empresa_id: string
          slug: string
        }
        Insert: {
          criado_em?: string
          empresa_id: string
          slug: string
        }
        Update: {
          criado_em?: string
          empresa_id?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "empresa_slugs_historico_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          atualizado_em: string
          busca: unknown
          capa_url: string | null
          cidade_id: string | null
          cor_destaque: string | null
          criado_em: string
          criado_por: string | null
          descricao: string | null
          email: string | null
          endereco_texto: string | null
          id: string
          instagram: string | null
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          nome: string
          ordem_blocos: Json | null
          plano: Database["public"]["Enums"]["plano_codigo"]
          reivindicavel: boolean
          situacao: Database["public"]["Enums"]["situacao_empresa"]
          slug: string
          telefone: string | null
          tipo_listagem: Database["public"]["Enums"]["tipo_listagem"]
          visitas_total: number
          whatsapp: string | null
        }
        Insert: {
          atualizado_em?: string
          busca?: unknown
          capa_url?: string | null
          cidade_id?: string | null
          cor_destaque?: string | null
          criado_em?: string
          criado_por?: string | null
          descricao?: string | null
          email?: string | null
          endereco_texto?: string | null
          id?: string
          instagram?: string | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          nome: string
          ordem_blocos?: Json | null
          plano?: Database["public"]["Enums"]["plano_codigo"]
          reivindicavel?: boolean
          situacao?: Database["public"]["Enums"]["situacao_empresa"]
          slug: string
          telefone?: string | null
          tipo_listagem?: Database["public"]["Enums"]["tipo_listagem"]
          visitas_total?: number
          whatsapp?: string | null
        }
        Update: {
          atualizado_em?: string
          busca?: unknown
          capa_url?: string | null
          cidade_id?: string | null
          cor_destaque?: string | null
          criado_em?: string
          criado_por?: string | null
          descricao?: string | null
          email?: string | null
          endereco_texto?: string | null
          id?: string
          instagram?: string | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          nome?: string
          ordem_blocos?: Json | null
          plano?: Database["public"]["Enums"]["plano_codigo"]
          reivindicavel?: boolean
          situacao?: Database["public"]["Enums"]["situacao_empresa"]
          slug?: string
          telefone?: string | null
          tipo_listagem?: Database["public"]["Enums"]["tipo_listagem"]
          visitas_total?: number
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empresas_cidade_id_fkey"
            columns: ["cidade_id"]
            isOneToOne: false
            referencedRelation: "cidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empresas_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      event_amenities: {
        Row: {
          amenity_id: string
          event_id: string
        }
        Insert: {
          amenity_id: string
          event_id: string
        }
        Update: {
          amenity_id?: string
          event_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_amenities_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos: {
        Row: {
          atualizado_em: string
          cidade_id: string | null
          criado_em: string
          criado_por: string | null
          descricao: string | null
          empresa_id: string | null
          endereco_texto: string | null
          fim_em: string | null
          gratuito: boolean
          id: string
          imagem_url: string | null
          inicio_em: string
          latitude: number | null
          link_ingressos: string | null
          local_nome: string | null
          longitude: number | null
          preco: number | null
          situacao: Database["public"]["Enums"]["situacao_moderacao"]
          slug: string
          titulo: string
        }
        Insert: {
          atualizado_em?: string
          cidade_id?: string | null
          criado_em?: string
          criado_por?: string | null
          descricao?: string | null
          empresa_id?: string | null
          endereco_texto?: string | null
          fim_em?: string | null
          gratuito?: boolean
          id?: string
          imagem_url?: string | null
          inicio_em: string
          latitude?: number | null
          link_ingressos?: string | null
          local_nome?: string | null
          longitude?: number | null
          preco?: number | null
          situacao?: Database["public"]["Enums"]["situacao_moderacao"]
          slug: string
          titulo: string
        }
        Update: {
          atualizado_em?: string
          cidade_id?: string | null
          criado_em?: string
          criado_por?: string | null
          descricao?: string | null
          empresa_id?: string | null
          endereco_texto?: string | null
          fim_em?: string | null
          gratuito?: boolean
          id?: string
          imagem_url?: string | null
          inicio_em?: string
          latitude?: number | null
          link_ingressos?: string | null
          local_nome?: string | null
          longitude?: number | null
          preco?: number | null
          situacao?: Database["public"]["Enums"]["situacao_moderacao"]
          slug?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "eventos_cidade_id_fkey"
            columns: ["cidade_id"]
            isOneToOne: false
            referencedRelation: "cidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos_metricas: {
        Row: {
          criado_em: string
          empresa_id: string | null
          evento_id: string | null
          id: number
          pacote_id: string | null
          referer: string | null
          tipo: Database["public"]["Enums"]["tipo_metrica"]
          visitante_hash: string | null
        }
        Insert: {
          criado_em?: string
          empresa_id?: string | null
          evento_id?: string | null
          id?: never
          pacote_id?: string | null
          referer?: string | null
          tipo: Database["public"]["Enums"]["tipo_metrica"]
          visitante_hash?: string | null
        }
        Update: {
          criado_em?: string
          empresa_id?: string | null
          evento_id?: string | null
          id?: never
          pacote_id?: string | null
          referer?: string | null
          tipo?: Database["public"]["Enums"]["tipo_metrica"]
          visitante_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eventos_metricas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_metricas_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_metricas_pacote_id_fkey"
            columns: ["pacote_id"]
            isOneToOne: false
            referencedRelation: "pacotes_viagem"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          address: string | null
          category_id: string | null
          created_at: string
          description: string | null
          end_datetime: string | null
          id: string
          image_aspect_ratio: string | null
          instagram: string | null
          links: Json | null
          name: string
          promotional_image_url: string | null
          restrictions: string[] | null
          slug: string
          start_datetime: string
          status: string
          ticket_price: number | null
          ticket_price_description: string | null
          updated_at: string
          venue_name: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          end_datetime?: string | null
          id?: string
          image_aspect_ratio?: string | null
          instagram?: string | null
          links?: Json | null
          name: string
          promotional_image_url?: string | null
          restrictions?: string[] | null
          slug: string
          start_datetime: string
          status?: string
          ticket_price?: number | null
          ticket_price_description?: string | null
          updated_at?: string
          venue_name?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          end_datetime?: string | null
          id?: string
          image_aspect_ratio?: string | null
          instagram?: string | null
          links?: Json | null
          name?: string
          promotional_image_url?: string | null
          restrictions?: string[] | null
          slug?: string
          start_datetime?: string
          status?: string
          ticket_price?: number | null
          ticket_price_description?: string | null
          updated_at?: string
          venue_name?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      galleries: {
        Row: {
          aspect_ratio: string | null
          business_id: string | null
          caption: string | null
          created_at: string
          dining_id: string | null
          display_order: number
          event_id: string | null
          id: string
          image_url: string
          lodging_id: string | null
        }
        Insert: {
          aspect_ratio?: string | null
          business_id?: string | null
          caption?: string | null
          created_at?: string
          dining_id?: string | null
          display_order?: number
          event_id?: string | null
          id?: string
          image_url: string
          lodging_id?: string | null
        }
        Update: {
          aspect_ratio?: string | null
          business_id?: string | null
          caption?: string | null
          created_at?: string
          dining_id?: string | null
          display_order?: number
          event_id?: string | null
          id?: string
          image_url?: string
          lodging_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "galleries_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "galleries_dining_id_fkey"
            columns: ["dining_id"]
            isOneToOne: false
            referencedRelation: "dining"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "galleries_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "galleries_lodging_id_fkey"
            columns: ["lodging_id"]
            isOneToOne: false
            referencedRelation: "lodging"
            referencedColumns: ["id"]
          },
        ]
      }
      lodging: {
        Row: {
          address: string | null
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          instagram: string | null
          lodging_type: string
          name: string
          price_range: string | null
          slug: string
          status: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          instagram?: string | null
          lodging_type: string
          name: string
          price_range?: string | null
          slug: string
          status?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          instagram?: string | null
          lodging_type?: string
          name?: string
          price_range?: string | null
          slug?: string
          status?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lodging_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      lodging_amenities: {
        Row: {
          amenity_id: string
          lodging_id: string
        }
        Insert: {
          amenity_id: string
          lodging_id: string
        }
        Update: {
          amenity_id?: string
          lodging_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lodging_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lodging_amenities_lodging_id_fkey"
            columns: ["lodging_id"]
            isOneToOne: false
            referencedRelation: "lodging"
            referencedColumns: ["id"]
          },
        ]
      }
      package_amenities: {
        Row: {
          amenity_id: string
          package_id: string
        }
        Insert: {
          amenity_id: string
          package_id: string
        }
        Update: {
          amenity_id?: string
          package_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_amenities_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          agency_id: string | null
          agency_name: string | null
          agency_whatsapp: string | null
          category_id: string | null
          created_at: string
          departure_date: string
          departure_location: string
          destination: string
          id: string
          image_url: string | null
          information: string | null
          price: number | null
          return_date: string
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          agency_id?: string | null
          agency_name?: string | null
          agency_whatsapp?: string | null
          category_id?: string | null
          created_at?: string
          departure_date: string
          departure_location?: string
          destination: string
          id?: string
          image_url?: string | null
          information?: string | null
          price?: number | null
          return_date: string
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          agency_id?: string | null
          agency_name?: string | null
          agency_whatsapp?: string | null
          category_id?: string | null
          created_at?: string
          departure_date?: string
          departure_location?: string
          destination?: string
          id?: string
          image_url?: string | null
          information?: string | null
          price?: number | null
          return_date?: string
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "packages_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packages_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      pacotes_viagem: {
        Row: {
          atualizado_em: string
          criado_em: string
          criado_por: string | null
          descricao: string | null
          destino: string
          empresa_id: string | null
          fim_em: string | null
          id: string
          imagem_url: string | null
          incluso: string[] | null
          inicio_em: string
          situacao: Database["public"]["Enums"]["situacao_moderacao"]
          slug: string
          titulo: string
          valor: number | null
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          criado_por?: string | null
          descricao?: string | null
          destino: string
          empresa_id?: string | null
          fim_em?: string | null
          id?: string
          imagem_url?: string | null
          incluso?: string[] | null
          inicio_em: string
          situacao?: Database["public"]["Enums"]["situacao_moderacao"]
          slug: string
          titulo: string
          valor?: number | null
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          criado_por?: string | null
          descricao?: string | null
          destino?: string
          empresa_id?: string | null
          fim_em?: string | null
          id?: string
          imagem_url?: string | null
          incluso?: string[] | null
          inicio_em?: string
          situacao?: Database["public"]["Enums"]["situacao_moderacao"]
          slug?: string
          titulo?: string
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pacotes_viagem_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pacotes_viagem_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      pagamentos: {
        Row: {
          assinatura_id: string | null
          ciclo: Database["public"]["Enums"]["ciclo_cobranca"]
          criado_em: string
          empresa_id: string
          expira_em: string | null
          id: string
          pago_em: string | null
          provedor: string
          provedor_id: string | null
          qr_code: string | null
          qr_code_base64: string | null
          situacao: Database["public"]["Enums"]["situacao_pagamento"]
          valor: number
        }
        Insert: {
          assinatura_id?: string | null
          ciclo: Database["public"]["Enums"]["ciclo_cobranca"]
          criado_em?: string
          empresa_id: string
          expira_em?: string | null
          id?: string
          pago_em?: string | null
          provedor?: string
          provedor_id?: string | null
          qr_code?: string | null
          qr_code_base64?: string | null
          situacao?: Database["public"]["Enums"]["situacao_pagamento"]
          valor: number
        }
        Update: {
          assinatura_id?: string | null
          ciclo?: Database["public"]["Enums"]["ciclo_cobranca"]
          criado_em?: string
          empresa_id?: string
          expira_em?: string | null
          id?: string
          pago_em?: string | null
          provedor?: string
          provedor_id?: string | null
          qr_code?: string | null
          qr_code_base64?: string | null
          situacao?: Database["public"]["Enums"]["situacao_pagamento"]
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_assinatura_id_fkey"
            columns: ["assinatura_id"]
            isOneToOne: false
            referencedRelation: "assinaturas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      papeis_admin: {
        Row: {
          criado_em: string
          papel: Database["public"]["Enums"]["papel_admin"]
          usuario_id: string
        }
        Insert: {
          criado_em?: string
          papel?: Database["public"]["Enums"]["papel_admin"]
          usuario_id: string
        }
        Update: {
          criado_em?: string
          papel?: Database["public"]["Enums"]["papel_admin"]
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "papeis_admin_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: true
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      planos: {
        Row: {
          codigo: Database["public"]["Enums"]["plano_codigo"]
          cor_destaque_livre: boolean
          destaque_home: boolean
          limite_equipe: number
          limite_fotos: number
          mapa: boolean
          mostra_anuncios: boolean
          nome: string
          ordem_blocos_livre: boolean
          painel_desempenho: boolean
          preco_anual: number
          preco_mensal: number
        }
        Insert: {
          codigo: Database["public"]["Enums"]["plano_codigo"]
          cor_destaque_livre?: boolean
          destaque_home?: boolean
          limite_equipe?: number
          limite_fotos?: number
          mapa?: boolean
          mostra_anuncios?: boolean
          nome: string
          ordem_blocos_livre?: boolean
          painel_desempenho?: boolean
          preco_anual?: number
          preco_mensal?: number
        }
        Update: {
          codigo?: Database["public"]["Enums"]["plano_codigo"]
          cor_destaque_livre?: boolean
          destaque_home?: boolean
          limite_equipe?: number
          limite_fotos?: number
          mapa?: boolean
          mostra_anuncios?: boolean
          nome?: string
          ordem_blocos_livre?: boolean
          painel_desempenho?: boolean
          preco_anual?: number
          preco_mensal?: number
        }
        Relationships: []
      }
      recursos_catalogo: {
        Row: {
          ativo: boolean
          criado_em: string
          grupo: string
          icone: string
          id: string
          nome: string
          ordem: number
          slug: string
        }
        Insert: {
          ativo?: boolean
          criado_em?: string
          grupo?: string
          icone: string
          id?: string
          nome: string
          ordem?: number
          slug: string
        }
        Update: {
          ativo?: boolean
          criado_em?: string
          grupo?: string
          icone?: string
          id?: string
          nome?: string
          ordem?: number
          slug?: string
        }
        Relationships: []
      }
      servicos_catalogo: {
        Row: {
          ativo: boolean
          categoria_id: string | null
          criado_em: string
          id: string
          nome: string
          slug: string
        }
        Insert: {
          ativo?: boolean
          categoria_id?: string | null
          criado_em?: string
          id?: string
          nome: string
          slug: string
        }
        Update: {
          ativo?: boolean
          categoria_id?: string | null
          criado_em?: string
          id?: string
          nome?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "servicos_catalogo_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitacoes_propriedade: {
        Row: {
          criado_em: string
          decidido_em: string | null
          decidido_por: string | null
          email: string | null
          empresa_id: string
          id: string
          mensagem: string | null
          nome: string
          situacao: Database["public"]["Enums"]["situacao_fila"]
          telefone: string
          usuario_id: string | null
        }
        Insert: {
          criado_em?: string
          decidido_em?: string | null
          decidido_por?: string | null
          email?: string | null
          empresa_id: string
          id?: string
          mensagem?: string | null
          nome: string
          situacao?: Database["public"]["Enums"]["situacao_fila"]
          telefone: string
          usuario_id?: string | null
        }
        Update: {
          criado_em?: string
          decidido_em?: string | null
          decidido_por?: string | null
          email?: string | null
          empresa_id?: string
          id?: string
          mensagem?: string | null
          nome?: string
          situacao?: Database["public"]["Enums"]["situacao_fila"]
          telefone?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_propriedade_decidido_por_fkey"
            columns: ["decidido_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_propriedade_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_propriedade_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          contact_email: string | null
          contact_name: string
          contact_phone: string
          created_at: string
          id: string
          ip_address: string | null
          payload: Json
          review_notes: string | null
          reviewed_at: string | null
          status: string
          target_domain: string
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          contact_name: string
          contact_phone: string
          created_at?: string
          id?: string
          ip_address?: string | null
          payload?: Json
          review_notes?: string | null
          reviewed_at?: string | null
          status?: string
          target_domain: string
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          contact_name?: string
          contact_phone?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          payload?: Json
          review_notes?: string | null
          reviewed_at?: string | null
          status?: string
          target_domain?: string
          updated_at?: string
        }
        Relationships: []
      }
      sugestoes_catalogo: {
        Row: {
          categoria_id: string | null
          criado_em: string
          decidido_em: string | null
          decidido_por: string | null
          empresa_id: string | null
          id: string
          nome: string
          situacao: Database["public"]["Enums"]["situacao_fila"]
          tipo: Database["public"]["Enums"]["tipo_sugestao_catalogo"]
          usuario_id: string | null
        }
        Insert: {
          categoria_id?: string | null
          criado_em?: string
          decidido_em?: string | null
          decidido_por?: string | null
          empresa_id?: string | null
          id?: string
          nome: string
          situacao?: Database["public"]["Enums"]["situacao_fila"]
          tipo: Database["public"]["Enums"]["tipo_sugestao_catalogo"]
          usuario_id?: string | null
        }
        Update: {
          categoria_id?: string | null
          criado_em?: string
          decidido_em?: string | null
          decidido_por?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string
          situacao?: Database["public"]["Enums"]["situacao_fila"]
          tipo?: Database["public"]["Enums"]["tipo_sugestao_catalogo"]
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sugestoes_catalogo_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sugestoes_catalogo_decidido_por_fkey"
            columns: ["decidido_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sugestoes_catalogo_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sugestoes_catalogo_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      sugestoes_correcao: {
        Row: {
          campo: string
          criado_em: string
          decidido_em: string | null
          decidido_por: string | null
          email_contato: string | null
          empresa_id: string
          id: string
          situacao: Database["public"]["Enums"]["situacao_fila"]
          valor_sugerido: string
        }
        Insert: {
          campo: string
          criado_em?: string
          decidido_em?: string | null
          decidido_por?: string | null
          email_contato?: string | null
          empresa_id: string
          id?: string
          situacao?: Database["public"]["Enums"]["situacao_fila"]
          valor_sugerido: string
        }
        Update: {
          campo?: string
          criado_em?: string
          decidido_em?: string | null
          decidido_por?: string | null
          email_contato?: string | null
          empresa_id?: string
          id?: string
          situacao?: Database["public"]["Enums"]["situacao_fila"]
          valor_sugerido?: string
        }
        Relationships: [
          {
            foreignKeyName: "sugestoes_correcao_decidido_por_fkey"
            columns: ["decidido_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sugestoes_correcao_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          atualizado_em: string
          criado_em: string
          email: string
          foto_url: string | null
          id: string
          nome: string
          telefone: string | null
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          email: string
          foto_url?: string | null
          id: string
          nome?: string
          telefone?: string | null
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          email?: string
          foto_url?: string | null
          id?: string
          nome?: string
          telefone?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      metricas_diarias: {
        Row: {
          dia: string | null
          empresa_id: string | null
          tipo: Database["public"]["Enums"]["tipo_metrica"] | null
          total: number | null
          unicos: number | null
        }
        Relationships: [
          {
            foreignKeyName: "eventos_metricas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      aceitar_convite: { Args: { p_token: string }; Returns: Json }
      admin_conteudo: { Args: never; Returns: Json }
      admin_criar_empresa: {
        Args: {
          p_categorias: string[]
          p_cidade_id?: string
          p_descricao?: string
          p_email?: string
          p_endereco_texto?: string
          p_instagram?: string
          p_latitude?: number
          p_longitude?: number
          p_nome: string
          p_slug: string
          p_telefone?: string
          p_tipo: Database["public"]["Enums"]["tipo_listagem"]
          p_whatsapp?: string
        }
        Returns: Json
      }
      admin_empresas: {
        Args: {
          p_pagina?: number
          p_por_pagina?: number
          p_termo?: string
          p_tipo?: Database["public"]["Enums"]["tipo_listagem"]
        }
        Returns: Json
      }
      admin_resumo: { Args: never; Returns: Json }
      anuncios_da_posicao: {
        Args: {
          p_limite?: number
          p_posicao: Database["public"]["Enums"]["posicao_anuncio"]
        }
        Returns: Json
      }
      busca_publica: {
        Args: {
          p_categoria?: string
          p_cidade?: string
          p_pagina?: number
          p_por_pagina?: number
          p_termo?: string
          p_tipo?: Database["public"]["Enums"]["tipo_listagem"]
        }
        Returns: Json
      }
      catalogos: { Args: never; Returns: Json }
      chave_busca: { Args: { texto: string }; Returns: string }
      convidar: {
        Args: {
          p_email?: string
          p_empresa: string
          p_papel?: Database["public"]["Enums"]["papel_membro"]
        }
        Returns: {
          aceito_em: string | null
          aceito_por: string | null
          criado_em: string
          criado_por: string
          email: string | null
          empresa_id: string
          expira_em: string
          id: string
          papel: Database["public"]["Enums"]["papel_membro"]
          token: string
        }
        SetofOptions: {
          from: "*"
          to: "convites"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      criar_empresa: {
        Args: {
          p_categorias: string[]
          p_cidade_id?: string
          p_descricao?: string
          p_email?: string
          p_endereco_texto?: string
          p_instagram?: string
          p_latitude?: number
          p_longitude?: number
          p_nome: string
          p_slug: string
          p_telefone?: string
          p_tipo: Database["public"]["Enums"]["tipo_listagem"]
          p_whatsapp?: string
        }
        Returns: Json
      }
      dados_home: {
        Args: {
          p_destaques?: number
          p_eventos?: number
          p_pacotes?: number
          p_populares?: number
        }
        Returns: Json
      }
      desempenho_empresa: {
        Args: { p_dias?: number; p_empresa: string }
        Returns: Json
      }
      eh_admin: { Args: { uid?: string }; Returns: boolean }
      eh_dono: { Args: { alvo: string; uid?: string }; Returns: boolean }
      eh_membro: { Args: { alvo: string; uid?: string }; Returns: boolean }
      eh_superadmin: { Args: { uid?: string }; Returns: boolean }
      equipe_da_empresa: { Args: { p_empresa: string }; Returns: Json }
      evento_por_slug: { Args: { p_slug: string }; Returns: Json }
      generate_slug: {
        Args: { p_id?: string; p_table: string; p_text: string }
        Returns: string
      }
      immutable_unaccent: { Args: { "": string }; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      listar_eventos: {
        Args: { p_cidade?: string; p_limite?: number }
        Returns: Json
      }
      listar_pacotes: { Args: { p_limite?: number }; Returns: Json }
      minhas_empresas: { Args: never; Returns: Json }
      pacote_por_slug: { Args: { p_slug: string }; Returns: Json }
      perfil_para_edicao: { Args: { p_empresa: string }; Returns: Json }
      perfil_por_slug: { Args: { p_slug: string }; Returns: Json }
      pode_administrar: {
        Args: { alvo: string; uid?: string }
        Returns: boolean
      }
      pode_editar: { Args: { alvo: string; uid?: string }; Returns: boolean }
      pode_expurgar: { Args: { p_slug: string }; Returns: boolean }
      possiveis_duplicados: {
        Args: { p_limite?: number; p_nome: string; p_whatsapp?: string }
        Returns: Json
      }
      processar_vencimentos: {
        Args: { dias_tolerancia?: number }
        Returns: {
          empresa_id: string
          situacao_nova: Database["public"]["Enums"]["situacao_assinatura"]
        }[]
      }
      registrar_metrica: {
        Args: {
          p_empresa?: string
          p_evento?: string
          p_pacote?: string
          p_referer?: string
          p_tipo: Database["public"]["Enums"]["tipo_metrica"]
          p_visitante?: string
        }
        Returns: undefined
      }
      remover_membro: {
        Args: { p_empresa: string; p_usuario: string }
        Returns: undefined
      }
      resumo_empresas: { Args: { ids: string[] }; Returns: Json }
      sem_acento: { Args: { texto: string }; Returns: string }
      servicos_das_categorias: {
        Args: { p_categorias: string[] }
        Returns: Json
      }
      slug_disponivel: {
        Args: { p_ignorar_empresa?: string; p_slug: string }
        Returns: boolean
      }
      slugs_ativos: { Args: never; Returns: Json }
      sou_admin: { Args: never; Returns: Json }
      sugerir_slug: { Args: { p_base: string }; Returns: string }
      sugestoes_busca: {
        Args: { p_limite?: number; p_termo: string }
        Returns: Json
      }
    }
    Enums: {
      ciclo_cobranca: "mensal" | "anual"
      origem_assinatura: "pagamento" | "cortesia"
      papel_admin: "superadmin" | "moderador"
      papel_membro: "dono" | "colaborador"
      plano_codigo: "free" | "premium"
      posicao_anuncio:
        | "home_topo"
        | "home_meio"
        | "busca_lateral"
        | "busca_lista"
        | "categoria_topo"
        | "perfil_meio"
        | "perfil_rodape"
      situacao_assinatura: "ativa" | "tolerancia" | "vencida" | "cancelada"
      situacao_empresa: "ativa" | "suspensa" | "excluida"
      situacao_fila: "aberta" | "aprovada" | "recusada"
      situacao_moderacao: "rascunho" | "aguardando" | "publicado" | "recusado"
      situacao_pagamento: "pendente" | "pago" | "expirado" | "cancelado"
      tipo_listagem: "empresa" | "profissional" | "hotel" | "restaurante"
      tipo_metrica:
        | "visita"
        | "clique_whatsapp"
        | "clique_instagram"
        | "clique_link"
        | "clique_rota"
        | "clique_telefone"
      tipo_sugestao_catalogo: "servico" | "recurso"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      ciclo_cobranca: ["mensal", "anual"],
      origem_assinatura: ["pagamento", "cortesia"],
      papel_admin: ["superadmin", "moderador"],
      papel_membro: ["dono", "colaborador"],
      plano_codigo: ["free", "premium"],
      posicao_anuncio: [
        "home_topo",
        "home_meio",
        "busca_lateral",
        "busca_lista",
        "categoria_topo",
        "perfil_meio",
        "perfil_rodape",
      ],
      situacao_assinatura: ["ativa", "tolerancia", "vencida", "cancelada"],
      situacao_empresa: ["ativa", "suspensa", "excluida"],
      situacao_fila: ["aberta", "aprovada", "recusada"],
      situacao_moderacao: ["rascunho", "aguardando", "publicado", "recusado"],
      situacao_pagamento: ["pendente", "pago", "expirado", "cancelado"],
      tipo_listagem: ["empresa", "profissional", "hotel", "restaurante"],
      tipo_metrica: [
        "visita",
        "clique_whatsapp",
        "clique_instagram",
        "clique_link",
        "clique_rota",
        "clique_telefone",
      ],
      tipo_sugestao_catalogo: ["servico", "recurso"],
    },
  },
} as const
