'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Product } from '@/types';
import { productService } from '@/services';
import { PageHeader } from '@/components';
import { formatPrice } from '@/utils';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tìm thấy thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={36} />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Sản phẩm không tồn tại'}
        </Alert>
        <Button component={Link} href="/products" startIcon={<ArrowBackIcon />}>
          Quay lại danh sách sản phẩm
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title={product.name}
        subtitle={product.categoryName ? `Danh mục: ${product.categoryName}` : 'Thông tin chi tiết sản phẩm'}
        action={
          <Button
            component={Link}
            href="/products"
            variant="outlined"
            size="small"
            startIcon={<ArrowBackIcon />}
          >
            Quay lại
          </Button>
        }
      />

      <Grid container spacing={4}>
        {/* Product Image Gallery */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 2, border: '1px solid #e2e8f0' }}>
            <Box
              sx={{
                height: 360,
                backgroundColor: '#f8fafc',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                overflow: 'hidden',
                border: '1px solid #f1f5f9',
              }}
            >
              {product.images && product.images.length > 0 ? (
                <Box
                  component="img"
                  src={product.images[selectedImageIndex]?.url || product.images[0].url}
                  alt={product.name}
                  sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              ) : (
                <Inventory2Icon sx={{ fontSize: 72, color: '#94a3b8' }} />
              )}
            </Box>

            {/* Thumbnail Navigation Strip */}
            {product.images && product.images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto', pb: 0.5 }}>
                {product.images.map((img, idx) => (
                  <Box
                    key={img.id || idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    sx={{
                      width: 64,
                      height: 64,
                      flexShrink: 0,
                      borderRadius: 1.5,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      p: 0.5,
                      bgcolor: '#f8fafc',
                      border: selectedImageIndex === idx ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#3b82f6',
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={img.url}
                      alt={`Thumbnail ${idx + 1}`}
                      sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Card>
        </Grid>

        {/* Product Information */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                <Chip
                  label={product.status}
                  color={product.status === 'ACTIVE' ? 'success' : 'default'}
                  size="small"
                  sx={{ borderRadius: 0.5 }}
                />
                <Chip
                  label={`Danh mục: ${product.categoryName || product.categoryId}`}
                  size="small"
                  variant="outlined"
                  sx={{ borderRadius: 0.5 }}
                />
              </Box>

              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
                {product.name}
              </Typography>

              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700, mb: 3 }}>
                {formatPrice(product.price)}
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Tình trạng kho hàng
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <CheckCircleOutlineIcon color="success" fontSize="small" />
                  {product.quantity > 0 ? `${product.quantity} sản phẩm có sẵn` : 'Tạm hết hàng'}
                </Typography>
              </Box>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Mô tả chi tiết:
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  whiteSpace: 'pre-line',
                  lineHeight: 1.6,
                  p: 2,
                  bgcolor: '#f8fafc',
                  borderRadius: 1,
                  border: '1px solid #e2e8f0',
                }}
              >
                {product.description || 'Chưa có thông tin mô tả chi tiết cho sản phẩm này.'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
