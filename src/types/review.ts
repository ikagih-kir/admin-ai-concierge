import { Product } from "./product";

type Site = {
  id: number;
  name: string;
};

export type Review = {
  id: number;
  product_id?: number | null;
  site_id?: number | null;
  user_name: string;
  rating: number;
  comment: string;
  admin_reply?: string | null;
  replied_at?: string | null;
  is_public: boolean;
  image_url?: string | null;
  helpful_count: number;
  created_at: string;
  site?: {
    id: number;
    name: string;
  } | null;
  product?: {
    id: number;
    name: string;
  } | null;
};