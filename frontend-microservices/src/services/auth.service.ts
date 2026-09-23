import { axiosClient, API_ENDPOINTS } from '@/api';
import { ApiResponse, LoginRequest, LoginResponse } from '@/types';

export const authService = {
  /**
   * Đăng nhập với email và password
   */
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const res = await axiosClient.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      payload
    );
    return res.data.data;
  },

  /**
   * Đăng xuất - vô hiệu hóa token trong Redis
   */
  async logout(): Promise<void> {
    await axiosClient.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.LOGOUT);
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const res = await axiosClient.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    return res.data.data;
  },
};
