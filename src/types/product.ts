export type ProductStatus = "draft" | "public" | "private";

export type ProductCreate = {
  category_id?: number | null;

  name: string;
  label?: string | null;
  description?: string | null;
  body?: string | null;

  status?: ProductStatus;
  is_active?: boolean;

  publish_start_at?: string | null;
  publish_end_at?: string | null;

  sold_out?: boolean;
  sold_out_at?: string | null;

  race_count?: number | null;
  race_date?: string | null;
  ticket_type?: string | null;

  expected_return?: number | null;
  max_return?: number | null;

  recommended_amount?: string | null;
  recommended_race_count?: number | null;
  capacity?: number | null;

  price: number;
};

export type ProductUpdate = Partial<ProductCreate>;

export type Product = {
  id: number;
  category_id?: number | null;

  name: string;
  label?: string | null;
  description?: string | null;
  body?: string | null;

  status: ProductStatus;
  is_active: boolean;

  publish_start_at?: string | null;
  publish_end_at?: string | null;

  sold_out: boolean;
  sold_out_at?: string | null;

  race_count?: number | null;
  race_date?: string | null;
  ticket_type?: string | null;

  expected_return?: number | null;
  max_return?: number | null;

  recommended_amount?: string | null;
  recommended_race_count?: number | null;
  capacity?: number | null;

  price: number;
};

export type ProductForm = {
  name: string;
  price: number;
  description: string;
  body: string;

  is_active: boolean;

  publish_from: string;
  publish_to: string;
  is_sold_out: boolean;
  sold_out_after: string;
};

export type ProductOption = {
  id: number;
  name: string;
};