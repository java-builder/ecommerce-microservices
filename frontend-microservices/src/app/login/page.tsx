'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isAdmin, isLoading } = useAuth();
  const { showSuccess } = useNotification();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isSubmitting = React.useRef(false);

  useEffect(() => {
    // Chỉ tự động điều hướng nếu đã đăng nhập từ trước và không phải đang bấm submit form
    if (!isLoading && isAuthenticated && !isSubmitting.current) {
      if (isAdmin) {
        router.replace('/admin');
      } else {
        router.replace('/');
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Vui lòng điền đầy đủ email và mật khẩu');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      isSubmitting.current = true;

      const result = await login({ email, password });
      showSuccess('Đăng nhập thành công!');

      // Nhận response login và check trực tiếp mảng roles
      const roles = result.roles || [];
      const hasAdmin = roles.some(
        (r: string) => r.toUpperCase() === 'ADMIN' || r.toUpperCase() === 'ROLE_ADMIN'
      );

      if (hasAdmin || result.isAdmin) {
        router.replace('/admin');
      } else {
        router.replace('/');
      }
    } catch (err: any) {
      isSubmitting.current = false;
      const msg =
        err.response?.data?.message ||
        'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 6,
      }}
    >
      <Card sx={{ maxWidth: 440, width: '100%', p: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mb: 1.5, width: 44, height: 44 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
              Đăng nhập Hệ thống
            </Typography>
          </Box>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 1 }}>
              {errorMsg}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email *"
              type="email"
              size="small"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@novacommerce.io"
              disabled={loading}
              InputLabelProps={{ shrink: true }}
              autoFocus
            />

            <TextField
              label="Mật khẩu *"
              type="password"
              size="small"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              InputLabelProps={{ shrink: true }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="medium"
              disabled={loading}
              sx={{ mt: 1, py: 1 }}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {loading ? 'Đang xác thực...' : 'Đăng nhập'}
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Chưa có tài khoản?{' '}
                <Typography
                  component={Link}
                  href="/register"
                  variant="body2"
                  color="primary"
                  sx={{ fontWeight: 600, textDecoration: 'none' }}
                >
                  Đăng ký ngay
                </Typography>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
