export interface FileResponse {
  key: string;
  fileName: string;
  contentType: string;
  size: number;
  url: string;
}

export interface PresignedUrlResponse {
  url: string;
  key: string;
}
