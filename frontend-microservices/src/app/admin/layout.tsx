'use client';

import React from 'react';
import Box from '@mui/material/Box';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { ProtectedRoute } from '@/components';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3.5,
          alignItems: 'flex-start',
        }}
      >
        {/* Left Sticky Admin Sidebar */}
        <AdminSidebar />

        {/* Right Main Admin Content */}
        <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
          {children}
        </Box>
      </Box>
    </ProtectedRoute>
  );
}
