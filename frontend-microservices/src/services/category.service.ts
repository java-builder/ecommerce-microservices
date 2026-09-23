import { axiosClient, API_ENDPOINTS } from '@/api';
import {
  ApiResponse,
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/types';

export const categoryService = {
  /**
   * Lấy danh sách tất cả các danh mục
   */
  async getCategories(): Promise<Category[]> {
    const res = await axiosClient.get<ApiResponse<Category[]>>(
      API_ENDPOINTS.CATEGORY.BASE
    );
    return res.data.data;
  },

  /**
   * Tạo danh mục mới
   */
  async createCategory(payload: CreateCategoryRequest): Promise<Category> {
    const res = await axiosClient.post<ApiResponse<Category>>(
      API_ENDPOINTS.CATEGORY.BASE,
      payload
    );
    return res.data.data;
  },

  /**
   * Cập nhật danh mục
   */
  async updateCategory(id: string, payload: UpdateCategoryRequest): Promise<Category> {
    const res = await axiosClient.put<ApiResponse<Category>>(
      API_ENDPOINTS.CATEGORY.BY_ID(id),
      payload
    );
    return res.data.data;
  },

  /**
   * Xóa danh mục
   */
  async deleteCategory(id: string): Promise<void> {
    await axiosClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.CATEGORY.BY_ID(id)
    );
  },
};
