import apiClient from "@api/client";
import { Product, ProductCreate, ProductUpdate } from "@/types/product";

export const fetchProducts = async (): Promise<Product[]> => {
  const res = await apiClient.get<Product[]>("/admin/products");
  return res.data;
};

export const createProduct = async (
  data: ProductCreate
): Promise<Product> => {
  const res = await apiClient.post<Product>("/admin/products", data);
  return res.data;
};

export const updateProduct = async (
  id: number,
  data: ProductUpdate
): Promise<Product> => {
  const res = await apiClient.put<Product>(`/admin/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id: number) => {
  await apiClient.delete(`/admin/products/${id}`);
};

