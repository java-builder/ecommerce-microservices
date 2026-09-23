import { axiosClient, API_ENDPOINTS } from '@/api';
import {
  ApiResponse,
  CreateUserRequest,
  CreateUserResponse,
  UserDetailResponse,
} from '@/types';

export const userService = {
  /**
   * Tạo user mới (Tương ứng UserController.createUser(CreateUserRequest))
   */
  async createUser(payload: CreateUserRequest): Promise<CreateUserResponse> {
    const res = await axiosClient.post<ApiResponse<CreateUserResponse>>(
      API_ENDPOINTS.USER.REGISTER,
      payload
    );
    return res.data.data;
  },

  /**
   * Alias cho createUser
   */
  async register(payload: CreateUserRequest): Promise<CreateUserResponse> {
    return this.createUser(payload);
  },

  /**
   * Lấy thông tin user hiện tại (Tương ứng UserController.getMyInfo())
   */
  async getMyInfo(): Promise<UserDetailResponse> {
    try {
      const res = await axiosClient.get<ApiResponse<UserDetailResponse>>(API_ENDPOINTS.USER.ME);
      return res.data.data;
    } catch (e: any) {
      if (e.response?.status === 404) {
        const res = await axiosClient.get<ApiResponse<UserDetailResponse>>(API_ENDPOINTS.USER.MY_INFO);
        return res.data.data;
      }
      throw e;
    }
  },

  /**
   * Cập nhật avatar của user (User Service gọi sang Media Service qua HTTP Interface)
   */
  async updateAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await axiosClient.patch<ApiResponse<string>>(
      API_ENDPOINTS.USER.UPDATE_AVATAR,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res.data.data;
  },

  /**
   * Lấy danh sách tất cả users (dành cho Admin)
   */
  async getAllUsers(): Promise<UserDetailResponse[]> {
    const res = await axiosClient.get<ApiResponse<UserDetailResponse[]>>(
      API_ENDPOINTS.USER.ALL_USERS
    );
    return res.data.data;
  },
};
