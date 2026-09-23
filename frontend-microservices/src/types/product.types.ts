export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE';

export interface ProductImage {
  id?: string;
  url: string;
  isPrimary?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  status: ProductStatus;
  categoryId: string;
  categoryName?: string;
  sellerId?: string;
  images?: ProductImage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  categoryId: string;
  status: ProductStatus;
  images?: { url: string; isPrimary?: boolean }[];
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  categoryId?: string;
  status?: ProductStatus;
  images?: { url: string; isPrimary?: boolean }[];
}

export interface ProductFilterParams {
  page?: number;
  size?: number;
  sort?: string;
  keyword?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: ProductStatus;
}
