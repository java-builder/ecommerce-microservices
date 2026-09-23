export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

// Khớp chính xác com.javabuilder.userservice.dto.response.UserDetailResponse và User Entity
export interface UserDetailResponse {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  avatarKey?: string;
  gender?: Gender;
  birthDate?: string;
  userStatus?: UserStatus;
  roles?: string[];
}

export type User = UserDetailResponse;
