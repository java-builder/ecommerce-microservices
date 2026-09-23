'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';

export default function AdminTabs() {
  const pathname = usePathname();

  const currentTab = pathname.includes('/admin/categories') ? 1 : 0;

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs value={currentTab} textColor="primary" indicatorColor="primary">
        <Tab
          component={Link}
          href="/admin/products"
          icon={<Inventory2Icon fontSize="small" />}
          iconPosition="start"
          label="Quản lý Sản phẩm"
          sx={{ fontWeight: 600, textTransform: 'none' }}
        />
        <Tab
          component={Link}
          href="/admin/categories"
          icon={<CategoryIcon fontSize="small" />}
          iconPosition="start"
          label="Quản lý Danh mục"
          sx={{ fontWeight: 600, textTransform: 'none' }}
        />
      </Tabs>
    </Box>
  );
}
