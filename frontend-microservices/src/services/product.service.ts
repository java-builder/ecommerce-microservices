import { axiosClient, API_ENDPOINTS } from '@/api';
import {
  ApiResponse,
  PageResponse,
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductFilterParams,
} from '@/types';

export const productService = {
  /**
   * Lấy danh sách sản phẩm có phân trang, lọc và sắp xếp
   */
  async getProducts(params?: ProductFilterParams): Promise<PageResponse<Product>> {
    const res = await axiosClient.get<ApiResponse<PageResponse<Product>>>(
      API_ENDPOINTS.PRODUCT.BASE,
      { params }
    );
    return res.data.data;
  },

  /**
   * Lấy chi tiết sản phẩm theo ID
   */
  async getProductById(id: string): Promise<Product> {
    const res = await axiosClient.get<ApiResponse<Product>>(
      API_ENDPOINTS.PRODUCT.BY_ID(id)
    );
    return res.data.data;
  },

  /**
   * Tạo sản phẩm mới (chỉ SELLER hoặc ADMIN)
   */
  async createProduct(payload: CreateProductRequest): Promise<Product> {
    const res = await axiosClient.post<ApiResponse<Product>>(
      API_ENDPOINTS.PRODUCT.BASE,
      payload
    );
    return res.data.data;
  },

  /**
   * Cập nhật thông tin sản phẩm
   */
  async updateProduct(id: string, payload: UpdateProductRequest): Promise<Product> {
    const res = await axiosClient.put<ApiResponse<Product>>(
      API_ENDPOINTS.PRODUCT.BY_ID(id),
      payload
    );
    return res.data.data;
  },

  /**
   * Xóa sản phẩm
   */
  async deleteProduct(id: string): Promise<void> {
    await axiosClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.PRODUCT.BY_ID(id)
    );
  },
};
