export const API_ENDPOINTS = {
  // Auth & User Service (qua Gateway route /api/v1/auth & /api/v1/users)
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

  // Category & Product Service (qua Gateway route /api/v1/categories & /api/v1/products)
  CATEGORY: {
    BASE: '/api/v1/categories',
    BY_ID: (id: string) => `/api/v1/categories/${id}`,
  },
  PRODUCT: {
    BASE: '/api/v1/products',
    BY_ID: (id: string) => `/api/v1/products/${id}`,
  },

  // Search Service (qua Gateway route /api/v1/search)
  SEARCH: {
    PRODUCTS: '/api/v1/search/products',
    AGGREGATIONS: '/api/v1/search/aggregations',
  },

  // Media Service (qua Gateway route /api/v1/s3)
  MEDIA: {
    UPLOAD: '/api/v1/s3/upload',
    PRESIGNED_URL: '/api/v1/s3/presigned-url',
  },
};
