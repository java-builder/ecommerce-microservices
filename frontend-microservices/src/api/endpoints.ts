export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH: '/api/v1/auth/refresh-token',
  },
  USER: {
    REGISTER: '/api/v1/users',
    ME: '/api/v1/users/me',
    MY_INFO: '/api/v1/users/my-info',
    UPDATE_AVATAR: '/api/v1/users/avatar',
    ALL_USERS: '/api/v1/users',
  },
  CATEGORY: {
    BASE: '/api/v1/categories',
    BY_ID: (id: string) => `/api/v1/categories/${id}`,
  },
  PRODUCT: {
    BASE: '/api/v1/products',
    BY_ID: (id: string) => `/api/v1/products/${id}`,
  },
  SEARCH: {
    PRODUCTS: '/api/v1/search/products',
    AGGREGATIONS: '/api/v1/search/aggregations',
  },
  MEDIA: {
    UPLOAD: '/api/v1/s3/upload',
    PRESIGNED_URL: '/api/v1/s3/presigned-url',
  },
  NOTIFICATION: {
    BASE: '/api/v1/notifications',
    MARK_AS_READ: '/api/v1/notifications/mark-as-read',
    MARK_ALL_AS_READ: '/api/v1/notifications/mark-all-as-read',
  },
};
