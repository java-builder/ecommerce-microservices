'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';

const NAV_ITEMS = [
  { label: 'Trang chủ', path: '/' },
  { label: 'Sản phẩm', path: '/products' },
  { label: 'Quản trị', path: '/admin/products' },
];

export default function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { showSuccess } = useNotification();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const navItems = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Sản phẩm', path: '/products' },
    ...(isAdmin ? [{ label: 'Quản trị', path: '/admin/products' }] : []),
  ];

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleCloseUserMenu();
    await logout();
    showSuccess('Đã đăng xuất thành công');
    router.push('/login');
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 64 }}>
          {/* Logo & Brand */}
          <Box
            component={Link}
            href="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'text.primary',
              mr: 4,
            }}
          >
            <StorefrontIcon sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.5px',
                color: 'text.primary',
              }}
            >
              NovaCommerce
            </Typography>
          </Box>

          {/* Navigation Items (Customer Shopping vs Admin Management) */}
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
            {navItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? pathname === '/'
                  : item.path === '/admin/products'
                    ? pathname.startsWith('/admin')
                    : pathname.startsWith(item.path);

              const isAdminButton = item.path === '/admin/products';

              return (
                <Button
                  key={item.path}
                  component={Link}
                  href={item.path}
                  variant={isActive ? 'contained' : 'text'}
                  color={isAdminButton && !isActive ? 'secondary' : isActive ? 'primary' : 'inherit'}
                  size="small"
                  startIcon={isAdminButton ? <AdminPanelSettingsIcon fontSize="small" /> : undefined}
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#ffffff' : 'text.secondary',
                    '&:hover': {
                      backgroundColor: isActive ? 'primary.dark' : '#f1f5f9',
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          {/* Auth & User Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {isAuthenticated && user ? (
              <>
                <Box
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    mr: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                    {user.firstName || user.lastName
                      ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                      : user.email.split('@')[0]}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                    {user.email}
                  </Typography>
                </Box>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5 }}>
                  <Avatar
                    src={user.avatarUrl}
                    alt={user.email}
                    sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.9rem' }}
                  >
                    {user.email.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseUserMenu}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    sx: { minWidth: 220, mt: 1, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
                  }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {user.email}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Status: {user.userStatus}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem
                    component={Link}
                    href="/profile"
                    onClick={handleCloseUserMenu}
                    sx={{ py: 1, gap: 1.5 }}
                  >
                    <PersonIcon fontSize="small" color="action" />
                    Hồ sơ & Avatar
                  </MenuItem>
                  {isAdmin && [
                    <MenuItem
                      key="admin-products"
                      component={Link}
                      href="/admin/products"
                      onClick={handleCloseUserMenu}
                      sx={{ py: 1, gap: 1.5 }}
                    >
                      <Inventory2Icon fontSize="small" color="action" />
                      Quản lý Sản phẩm (Admin)
                    </MenuItem>,
                    <MenuItem
                      key="admin-categories"
                      component={Link}
                      href="/admin/categories"
                      onClick={handleCloseUserMenu}
                      sx={{ py: 1, gap: 1.5 }}
                    >
                      <CategoryIcon fontSize="small" color="action" />
                      Quản lý Danh mục (Admin)
                    </MenuItem>,
                  ]}
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ py: 1, gap: 1.5, color: 'error.main' }}>
                    <LogoutIcon fontSize="small" color="error" />
                    Đăng xuất
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  href="/login"
                  variant="outlined"
                  size="small"
                  color="primary"
                >
                  Đăng nhập
                </Button>
                <Button
                  component={Link}
                  href="/register"
                  variant="contained"
                  size="small"
                  color="primary"
                >
                  Đăng ký
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
