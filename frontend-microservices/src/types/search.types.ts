export interface SearchProductDocument {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity?: number;
  status?: string;
  categoryId?: string;
  categoryName?: string;
  thumbnail?: string;
  imageUrl?: string;
  inStock?: boolean;
  createdAt?: string | null;
}

export interface SearchProductParams {
  keyword?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  inStock?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

export interface SearchAggregations {
  categories?: { key: string; docCount: number }[];
  priceStats?: { min: number; max: number; avg: number };
}
