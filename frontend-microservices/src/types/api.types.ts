export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PageResponse<T = any> {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  content: T[];
}

export interface SliceResponse<T = any> {
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  isLast?: boolean;
  last?: boolean;
  content: T[];
}

export interface ApiError {
  code: number;
  message: string;
  details?: Record<string, string>;
}
