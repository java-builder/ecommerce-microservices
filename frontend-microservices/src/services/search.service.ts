import { axiosClient, API_ENDPOINTS } from '@/api';
import {
  ApiResponse,
  PageResponse,
  SearchAggregations,
  SearchProductDocument,
  SearchProductParams,
} from '@/types';

export const searchService = {
  /**
   * Tìm kiếm sản phẩm full-text qua Search Service (Elasticsearch)
   */
  async searchProducts(
    params: SearchProductParams
  ): Promise<PageResponse<SearchProductDocument>> {
    const res = await axiosClient.get<ApiResponse<PageResponse<SearchProductDocument>>>(
      API_ENDPOINTS.SEARCH.PRODUCTS,
      { params }
    );
    return res.data.data;
  },

  /**
   * Lấy dữ liệu Aggregations / Facets từ Elasticsearch
   */
  async getAggregations(): Promise<SearchAggregations> {
    const res = await axiosClient.get<ApiResponse<SearchAggregations>>(
      API_ENDPOINTS.SEARCH.AGGREGATIONS
    );
    return res.data.data;
  },
};
