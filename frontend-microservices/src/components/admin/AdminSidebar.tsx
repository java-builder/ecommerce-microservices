'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuth } from '@/hooks/useAuth';

const ADMIN_LINKS = [
  { label: 'Tổng quan Admin', path: '/admin', icon: <DashboardIcon fontSize="small" />, exact: true },
  { label: 'Quản lý Sản phẩm', path: '/admin/products', icon: <Inventory2Icon fontSize="small" /> },
  { label: 'Quản lý Danh mục', path: '/admin/categories', icon: <CategoryIcon fontSize="small" /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <Card
      sx={{
        width: { xs: '100%', md: 260 },
        flexShrink: 0,
        height: 'fit-content',
        position: { md: 'sticky' },
        top: { md: 80 },
      }}
    >
      {/* Sidebar Header */}
      <Box sx={{ p: 2.5, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <AdminPanelSettingsIcon color="primary" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Quản trị Hệ thống
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          Bảng điều khiển quản lý Microservices
        </Typography>
      </Box>

      <Divider />

      {/* Main Admin Navigation */}
      <List sx={{ px: 1, py: 1.5 }}>
        {ADMIN_LINKS.map((item) => {
          const isActive = item.exact ? pathname === item.path : pathname.startsWith(item.path);

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.path}
                selected={isActive}
                sx={{
                  borderRadius: 1,
                  py: 1,
                  px: 1.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: '#ffffff',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: '#ffffff',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isActive ? '#ffffff' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ my: 1 }} />

      {/* Secondary Navigation */}
      <List sx={{ px: 1, pb: 1.5 }}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            component={Link}
            href="/profile"
            sx={{
              borderRadius: 1,
              py: 0.75,
              px: 1.5,
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Hồ sơ cá nhân"
              primaryTypographyProps={{ fontSize: '0.85rem' }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            href="/"
            sx={{
              borderRadius: 1,
              py: 0.75,
              px: 1.5,
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
              <StorefrontIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Về trang Cửa hàng"
              primaryTypographyProps={{ fontSize: '0.85rem' }}
            />
          </ListItemButton>
        </ListItem>
      </List>

      {/* Footer Info in Sidebar */}
      {user && (
        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }} noWrap>
            {user.email}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
            <Chip label="Admin Portal" size="small" color="primary" variant="outlined" sx={{ height: 18, fontSize: '0.65rem' }} />
          </Box>
        </Box>
      )}
    </Card>
  );
}
