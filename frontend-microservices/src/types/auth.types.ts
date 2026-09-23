export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  roles?: string[];
}

export interface CreateUserRequest {
  email: string;
  password: string;
}

export interface CreateUserResponse {
  email: string;
}

export interface LogoutRequest {
  token?: string;
}
