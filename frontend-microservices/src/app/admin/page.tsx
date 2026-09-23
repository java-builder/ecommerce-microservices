'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StorageIcon from '@mui/icons-material/Storage';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import { PageHeader } from '@/components';
import { productService, categoryService } from '@/services';

export default function AdminDashboardPage() {
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.allSettled([
          productService.getProducts({ page: 1, size: 1 }),
          categoryService.getCategories(),
        ]);

        if (prodRes.status === 'fulfilled') {
          setTotalProducts(prodRes.value.totalElements || 0);
        }
        if (catRes.status === 'fulfilled') {
          setTotalCategories(catRes.value.length || 0);
        }
      } catch (err) {
        // Handled silently
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box>
      <PageHeader
        title="Tổng quan Bảng điều khiển Quản trị"
        subtitle="Hệ thống quản lý tập trung kho hàng, phân loại danh mục và giám sát microservices"
      />

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  TỔNG SỐ LƯỢNG SẢN PHẨM
                </Typography>
                <Typography variant="h3" color="primary.main" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {loading ? <CircularProgress size={28} /> : totalProducts}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Sản phẩm trong cơ sở dữ liệu Product Service
                </Typography>
              </Box>
              <Inventory2Icon sx={{ fontSize: 48, color: 'primary.light' }} />
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                component={Link}
                href="/admin/products"
                variant="outlined"
                size="small"
                endIcon={<ArrowForwardIcon />}
              >
                Quản lý kho hàng
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  TỔNG SỐ DANH MỤC HÀNG HÓA
                </Typography>
                <Typography variant="h3" color="secondary.main" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {loading ? <CircularProgress size={28} /> : totalCategories}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Nhóm ngành hàng phục vụ phân loại sản phẩm
                </Typography>
              </Box>
              <CategoryIcon sx={{ fontSize: 48, color: 'secondary.light' }} />
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                component={Link}
                href="/admin/categories"
                variant="outlined"
                size="small"
                endIcon={<ArrowForwardIcon />}
              >
                Quản lý danh mục
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Backend Infrastructure Overview */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Hạ tầng Microservices kết nối
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Trạng thái kết nối các service thông qua Spring Cloud API Gateway (Port 9191)
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CloudQueueIcon color="primary" />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  API Gateway
                </Typography>
              </Box>
              <Chip label="Port 9191" size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Điểm tiếp nhận tập trung
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CheckCircleIcon color="success" />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Product Service
                </Typography>
              </Box>
              <Chip label="PostgreSQL JPA" size="small" color="success" sx={{ height: 20, fontSize: '0.7rem' }} />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Quản lý kho & danh mục
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <StorageIcon color="info" />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Search Service
                </Typography>
              </Box>
              <Chip label="Elasticsearch 8.x" size="small" color="info" sx={{ height: 20, fontSize: '0.7rem' }} />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Kafka sync & full-text search
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CheckCircleIcon color="success" />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Media Service
                </Typography>
              </Box>
              <Chip label="AWS S3" size="small" color="success" sx={{ height: 20, fontSize: '0.7rem' }} />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Upload ảnh sản phẩm & avatar
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
