'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';
import { PageHeader, ProtectedRoute } from '@/components';
import { userService } from '@/services';
import { UserDetailResponse } from '@/types';

export default function ProfilePage() {
  const { user: authUser, updateAvatar, refreshProfile } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [profile, setProfile] = useState<UserDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Gọi trực tiếp API getMyInfo (@GetMapping("/me")) khi vào trang
  const fetchMyInfo = async () => {
    try {
      const data = await userService.getMyInfo();
      setProfile(data);
    } catch (err: any) {
      showError(err.response?.data?.message || 'Không thể tải thông tin người dùng.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyInfo();
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('Dung lượng ảnh vượt quá 5MB. Vui lòng chọn ảnh nhỏ hơn.');
      return;
    }

    try {
      setUploading(true);
      const newAvatarUrl = await updateAvatar(file);
      setProfile((prev) => (prev ? { ...prev, avatarUrl: newAvatarUrl } : null));
      showSuccess('Cập nhật Avatar thành công!');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Không thể cập nhật avatar.';
      showError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMyInfo();
    await refreshProfile();
    showSuccess('Đã làm mới thông tin tài khoản');
  };

  const currentUser = profile || authUser;

  const formatGender = (gender?: string) => {
    if (!gender) return 'Chưa cập nhật';
    switch (gender.toUpperCase()) {
      case 'MALE':
        return 'Nam';
      case 'FEMALE':
        return 'Nữ';
      default:
        return 'Khác';
    }
  };

  return (
    <ProtectedRoute>
      <Box>
        <PageHeader
          title="Thông tin Tài khoản & Hồ sơ"
          subtitle="Xem và quản lý thông tin tài khoản cá nhân của bạn"
          action={
            <Button
              variant="outlined"
              size="small"
              startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshIcon />}
              onClick={handleRefresh}
              disabled={refreshing || loading}
            >
              Làm mới
            </Button>
          }
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={36} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Avatar & Summary Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar
                    src={currentUser?.avatarUrl}
                    alt={currentUser?.email}
                    sx={{
                      width: 120,
                      height: 120,
                      mb: 2,
                      border: '3px solid #e2e8f0',
                      fontSize: '2.5rem',
                      bgcolor: 'primary.main',
                    }}
                  >
                    {currentUser?.email?.charAt(0).toUpperCase()}
                  </Avatar>

                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {currentUser?.firstName || currentUser?.lastName
                      ? `${currentUser?.lastName || ''} ${currentUser?.firstName || ''}`.trim()
                      : currentUser?.email?.split('@')[0]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {currentUser?.email}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                    <Chip
                      label={currentUser?.userStatus || 'ACTIVE'}
                      color={currentUser?.userStatus === 'ACTIVE' ? 'success' : 'default'}
                      size="small"
                      icon={<CheckCircleIcon />}
                      sx={{ borderRadius: 0.5 }}
                    />
                  </Box>

                  <Divider sx={{ width: '100%', mb: 3 }} />

                  <Button
                    component="label"
                    variant="contained"
                    color="primary"
                    size="small"
                    disabled={uploading}
                    startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />}
                  >
                    {uploading ? 'Đang tải lên...' : 'Đổi ảnh đại diện'}
                    <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* User Details Card */}
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Chi tiết Thông tin Người dùng
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={2.5}>
                    {/* Email */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Địa chỉ Email
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                        {currentUser?.email || '—'}
                      </Typography>
                    </Grid>

                    {/* Số điện thoại */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Số điện thoại
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                        {currentUser?.phone || 'Chưa cập nhật'}
                      </Typography>
                    </Grid>

                    {/* Họ và tên đệm */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Họ và tên đệm (Last Name)
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                        {currentUser?.lastName || 'Chưa cập nhật'}
                      </Typography>
                    </Grid>

                    {/* Tên */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Tên (First Name)
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                        {currentUser?.firstName || 'Chưa cập nhật'}
                      </Typography>
                    </Grid>

                    {/* Giới tính */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Giới tính (Gender)
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                        {formatGender(currentUser?.gender)}
                      </Typography>
                    </Grid>

                    {/* Ngày sinh */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Ngày sinh (Birth Date)
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                        {currentUser?.birthDate || 'Chưa cập nhật'}
                      </Typography>
                    </Grid>

                    {/* Trạng thái tài khoản */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Trạng thái hoạt động (User Status)
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <Chip
                          label={currentUser?.userStatus || 'ACTIVE'}
                          color={currentUser?.userStatus === 'ACTIVE' ? 'success' : 'default'}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: 0.5 }}
                        />
                      </Box>
                    </Grid>

                    {/* Roles */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Vai trò hệ thống (Roles)
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                        {currentUser?.roles && currentUser.roles.length > 0 ? (
                          currentUser.roles.map((r, i) => (
                            <Chip
                              key={i}
                              label={r}
                              size="small"
                              variant="outlined"
                              color={r.includes('ADMIN') ? 'secondary' : 'default'}
                              sx={{ borderRadius: 0.5 }}
                            />
                          ))
                        ) : (
                          <Chip label="ROLE_CUSTOMER" size="small" variant="outlined" sx={{ borderRadius: 0.5 }} />
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </ProtectedRoute>
  );
}
