'use client';

import React, { useState } from 'react';
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
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import Avatar from '@mui/material/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { showSuccess } = useNotification();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Vui lòng điền đầy đủ email và mật khẩu');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Mật khẩu phải chứa ít nhất 8 ký tự');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      // Gọi đúng chuẩn CreateUserRequest(email, password) của User Service
      await register({
        email,
        password,
      });
      showSuccess('Đăng ký tài khoản thành công! Hãy đăng nhập.');
      router.push('/login');
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.';
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
              <PersonAddAlt1Icon />
            </Avatar>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
              Đăng ký Tài khoản
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
              placeholder="example@novacommerce.io"
              disabled={loading}
              InputLabelProps={{ shrink: true }}
              autoFocus
            />

            <TextField
              label="Mật khẩu (Tối thiểu 8 ký tự) *"
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
              {loading ? 'Đang tạo tài khoản...' : 'Đăng ký ngay'}
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Đã có tài khoản?{' '}
                <Typography
                  component={Link}
                  href="/login"
                  variant="body2"
                  color="primary"
                  sx={{ fontWeight: 600, textDecoration: 'none' }}
                >
                  Đăng nhập
                </Typography>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
