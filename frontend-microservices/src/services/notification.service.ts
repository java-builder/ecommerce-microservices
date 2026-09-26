import { axiosClient, API_ENDPOINTS } from '@/api';
import {
  ApiResponse,
  SliceResponse,
  NotificationItem,
  NotificationPaginationParams,
} from '@/types';

export const notificationService = {
  async getMyNotifications(
    params?: NotificationPaginationParams
  ): Promise<SliceResponse<NotificationItem>> {
    const res = await axiosClient.get<ApiResponse<SliceResponse<NotificationItem>>>(
      API_ENDPOINTS.NOTIFICATION.BASE,
      {
        params: {
          page: params?.page ?? 1,
          size: params?.size ?? 10,
        },
      }
    );
    return res.data.data;
  },

  async markAsRead(ids: string[]): Promise<number> {
    const res = await axiosClient.put<ApiResponse<number>>(
      API_ENDPOINTS.NOTIFICATION.MARK_AS_READ,
      { ids }
    );
    return res.data.data;
  },

  async markAllAsRead(): Promise<number> {
    const res = await axiosClient.put<ApiResponse<number>>(
      API_ENDPOINTS.NOTIFICATION.MARK_ALL_AS_READ
    );
    return res.data.data;
  },
};
