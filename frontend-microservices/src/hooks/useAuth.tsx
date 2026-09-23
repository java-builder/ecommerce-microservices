'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User, LoginRequest, CreateUserRequest } from '@/types';
import { authService, userService } from '@/services';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  hasRole: (roleName: string) => boolean;
  login: (payload: LoginRequest) => Promise<{ roles: string[]; isAdmin: boolean }>;
  register: (payload: CreateUserRequest) => Promise<void>;
  createUser: (payload: CreateUserRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateAvatar: (file: File) => Promise<string>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function extractRolesFromJwt(token: string): string[] {
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return [];
    const jsonStr = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(jsonStr);
    if (Array.isArray(payload.roles)) return payload.roles;
    return [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userInfo = await userService.getMyInfo();
        const storedRoles = localStorage.getItem('roles');
        const tokenRoles = extractRolesFromJwt(token);

        let finalRoles: string[] = [];
        if (userInfo.roles && userInfo.roles.length > 0) {
          finalRoles = userInfo.roles;
        } else if (storedRoles) {
          try {
            finalRoles = JSON.parse(storedRoles);
          } catch {
            finalRoles = tokenRoles;
          }
        } else {
          finalRoles = tokenRoles;
        }

        setUser({ ...userInfo, roles: finalRoles });
      } catch (error) {
        console.warn('Phiên đăng nhập không hợp lệ hoặc đã hết hạn');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('roles');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (payload: LoginRequest) => {
    const loginData = await authService.login(payload);
    // Lưu accessToken vào localStorage
    localStorage.setItem('accessToken', loginData.accessToken);

    const tokenRoles = extractRolesFromJwt(loginData.accessToken);
    const resolvedRoles = loginData.roles && loginData.roles.length > 0 ? loginData.roles : tokenRoles;
    localStorage.setItem('roles', JSON.stringify(resolvedRoles));

    const checkIsAdmin = resolvedRoles.some((r) => {
      const u = r.toUpperCase();
      return u === 'ADMIN' || u === 'ROLE_ADMIN';
    });

    setUser({
      email: payload.email,
      roles: resolvedRoles,
    });

    userService.getMyInfo().then((userInfo) => {
      setUser({
        ...userInfo,
        roles: userInfo.roles && userInfo.roles.length > 0 ? userInfo.roles : resolvedRoles,
      });
    }).catch(() => {
      // Giữ nguyên basic user
    });

    return { roles: resolvedRoles, isAdmin: checkIsAdmin };
  };

  const createUser = async (payload: CreateUserRequest) => {
    await userService.createUser(payload);
  };

  const register = createUser;

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // Dù API logout có lỗi thì client vẫn dọn dẹp token
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('roles');
      setUser(null);
    }
  };

  const updateAvatar = async (file: File): Promise<string> => {
    const newAvatarUrl = await userService.updateAvatar(file);
    if (user) {
      setUser({ ...user, avatarUrl: newAvatarUrl });
    }
    return newAvatarUrl;
  };

  const refreshProfile = async () => {
    const userInfo = await userService.getMyInfo();
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const tokenRoles = token ? extractRolesFromJwt(token) : [];
    setUser({
      ...userInfo,
      roles: userInfo.roles && userInfo.roles.length > 0 ? userInfo.roles : (user?.roles || tokenRoles),
    });
  };

  const hasRole = (roleName: string): boolean => {
    if (!user || !user.roles || !Array.isArray(user.roles)) return false;
    const target = roleName.toUpperCase();
    return user.roles.some((r) => {
      const upper = r.toUpperCase();
      return upper === target || upper === `ROLE_${target}` || `ROLE_${upper}` === target;
    });
  };

  const isAdmin = hasRole('ADMIN');

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAdmin,
        hasRole,
        login,
        register,
        createUser,
        logout,
        updateAvatar,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
