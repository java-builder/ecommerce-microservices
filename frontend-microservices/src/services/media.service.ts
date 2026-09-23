import { axiosClient, API_ENDPOINTS } from '@/api';
import { ApiResponse, FileResponse, PresignedUrlResponse } from '@/types';
import axios from 'axios';

export const mediaService = {
  /**
   * Upload file trực tiếp lên Media Service (Media Service upload lên S3)
   */
  async uploadFile(file: File): Promise<FileResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await axiosClient.post<ApiResponse<FileResponse>>(
      API_ENDPOINTS.MEDIA.UPLOAD,
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
   * Tạo Presigned URL để upload file trực tiếp từ browser lên S3
   */
  async getPresignedUrl(fileName: string): Promise<PresignedUrlResponse> {
    try {
      // Backend Media Service exposes @GetMapping("/presigned-url") with @RequestParam("filename")
      const res = await axiosClient.get<ApiResponse<PresignedUrlResponse>>(
        API_ENDPOINTS.MEDIA.PRESIGNED_URL,
        { params: { filename: fileName } }
      );
      return res.data.data;
    } catch (err: any) {
      if (err.response?.status === 405) {
        // Fallback nếu backend map POST
        const res = await axiosClient.post<ApiResponse<PresignedUrlResponse>>(
          API_ENDPOINTS.MEDIA.PRESIGNED_URL,
          { fileName, filename: fileName }
        );
        return res.data.data;
      }
      throw err;
    }
  },

  /**
   * Đẩy file trực tiếp lên S3 sử dụng Presigned URL
   */
  async uploadToS3WithPresignedUrl(presignedUrl: string, file: File): Promise<void> {
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
      },
    });
  },
};
