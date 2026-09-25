export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number | string;
  totalProducts: number;
  totalUsers: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    totalAmount: number | string;
    status: string;
    paymentStatus: string;
    createdAt: string;
    user: {
      name: string;
    };
  }>;
  lowStockProducts: Array<{
    id: string;
    nameId: string;
    stock: number;
    sku?: string | null;
  }>;
  orderStatusBreakdown: Record<string, number>;
}

export interface AdminProductPayload {
  nameId: string;
  nameEn: string;
  descriptionId: string;
  descriptionEn: string;
  price: number;
  comparePrice?: number;
  stock: number;
  sku?: string;
  categoryId: string;
  images: string[];
  isFeatured?: boolean;
  weight?: number;
}

export interface AdminBlogPayload {
  titleId: string;
  titleEn: string;
  contentId: string;
  contentEn: string;
  excerpt?: string;
  coverImage?: string;
  author: string;
  category: string;
  tags?: string[];
  isPublished?: boolean;
}
