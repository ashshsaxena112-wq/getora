export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      stores: {
        Row: {
          id: string;
          name: string;
          slug: string;
          tagline: string | null;
          category_id: string | null;
          logo_url: string | null;
          banner_url: string | null;
          rating: number;
          review_count: number;
          open_time: string;
          close_time: string;
          is_open: boolean;
          address: string;
          locality: string;
          lat: number;
          lng: number;
          distance_km: number;
          delivery_eta_min: number;
          delivery_fee: number;
          free_delivery_threshold: number;
          featured: boolean;
          created_at: string;
        };
      };
      products: {
        Row: {
          id: string;
          store_id: string;
          category_id: string | null;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          mrp: number;
          discount_percent: number;
          in_stock: boolean;
          stock_quantity: number;
          unit: string;
          pack_info: string | null;
          images: string[];
          features: Json;
          is_popular: boolean;
          rating: number;
          review_count: number;
          created_at: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          store_id: string;
          status: 'confirmed' | 'preparing' | 'ready_for_pickup' | 'picked_up' | 'out_for_delivery' | 'delivered' | 'cancelled';
          subtotal: number;
          delivery_fee: number;
          platform_fee: number;
          discount: number;
          grand_total: number;
          coupon_code: string | null;
          payment_method: 'UPI' | 'CARD' | 'NETBANKING' | 'COD';
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
          delivery_address: Json;
          delivery_instructions: string | null;
          delivery_partner_name: string;
          delivery_partner_phone: string;
          delivery_partner_vehicle: string;
          delivery_partner_rating: number;
          estimated_delivery_time: string | null;
          delivered_at: string | null;
          created_at: string;
        };
      };
    };
  };
}
