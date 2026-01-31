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
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          price: number
          original_price: number | null
          rating: number
          review_count: number
          image: string
          images: string[] | null
          colors: string[]
          sizes: number[] | null
          category: string
          description: string | null
          details: string[] | null
          stock: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          original_price?: number | null
          rating?: number
          review_count?: number
          image: string
          images?: string[] | null
          colors: string[]
          sizes?: number[] | null
          category: string
          description?: string | null
          details?: string[] | null
          stock?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          original_price?: number | null
          rating?: number
          review_count?: number
          image?: string
          images?: string[] | null
          colors?: string[]
          sizes?: number[] | null
          category?: string
          description?: string | null
          details?: string[] | null
          stock?: number
          created_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          selected_color: string
          selected_size: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity?: number
          selected_color: string
          selected_size?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          selected_color?: string
          selected_size?: number | null
          created_at?: string
        }
      }
      wishlist_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          share_token: string
          is_public: boolean
          title: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          share_token?: string
          is_public?: boolean
          title?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          share_token?: string
          is_public?: boolean
          title?: string
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: string
          subtotal: number
          tax: number
          shipping: number
          total: number
          shipping_address: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: string
          subtotal: number
          tax?: number
          shipping?: number
          total: number
          shipping_address: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          subtotal?: number
          tax?: number
          shipping?: number
          total?: number
          shipping_address?: Json
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_snapshot: Json
          quantity: number
          selected_color: string
          selected_size: number | null
          price_at_purchase: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_snapshot: Json
          quantity: number
          selected_color: string
          selected_size?: number | null
          price_at_purchase: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_snapshot?: Json
          quantity?: number
          selected_color?: string
          selected_size?: number | null
          price_at_purchase?: number
        }
      }
    }
  }
}

// Helper types for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type CartItem = Database['public']['Tables']['cart_items']['Row']
export type WishlistItem = Database['public']['Tables']['wishlist_items']['Row']
export type Wishlist = Database['public']['Tables']['wishlists']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']

// Extended types with relations
export type CartItemWithProduct = CartItem & {
  product: Product
}

export type WishlistItemWithProduct = WishlistItem & {
  product: Product
}

export type OrderWithItems = Order & {
  order_items: OrderItem[]
}
