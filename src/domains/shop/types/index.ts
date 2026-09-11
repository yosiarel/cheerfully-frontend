export interface Category {
  id: string;
  slug: string;
  nameId: string;
  nameEn: string;
  descriptionId?: string | null;
  descriptionEn?: string | null;
  image?: string | null;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  slug: string;
  nameId: string;
  nameEn: string;
  descriptionId: string;
  descriptionEn: string;
  price: number | string;
  comparePrice?: number | string | null;
  stock: number;
  sku?: string | null;
  images: string[];
  category: {
    id: string;
    slug: string;
    nameId: string;
    nameEn: string;
  };
  isActive: boolean;
  isFeatured: boolean;
  weight?: number | string | null;
  reviews?: Array<{
    id: string;
    rating: number;
    comment?: string | null;
    user: {
      name: string;
      avatar?: string | null;
    };
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilterParams {
  category?: string;
  search?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  sort?: 'newest' | 'price_asc' | 'price_desc' | string;
  page?: number;
  limit?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductListResponse {
  data: Product[];
  pagination: Pagination;
}
