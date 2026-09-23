'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Category, Product, SearchProductDocument } from '@/types';
import { categoryService, productService, searchService } from '@/services';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/utils';

export default function HomePage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Gọi đồng thời Search Service và Category Service
        const [searchRes, catRes] = await Promise.allSettled([
          searchService.searchProducts({ page: 1, size: 6, status: 'ACTIVE' }),
          categoryService.getCategories(),
        ]);

        if (searchRes.status === 'fulfilled' && searchRes.value?.content) {
          const mapped: Product[] = searchRes.value.content.map((doc: SearchProductDocument) => ({
            id: doc.id,
            name: doc.name,
            description: doc.description,
            price: doc.price,
            quantity: doc.quantity ?? (doc.inStock ? 1 : 0),
            status: (doc.status as any) || 'ACTIVE',
            categoryId: doc.categoryId || '',
            categoryName: doc.categoryName,
            images: (doc.thumbnail || doc.imageUrl)
              ? [{ url: (doc.thumbnail || doc.imageUrl)!, isPrimary: true }]
              : [],
          }));
          setProducts(mapped);
        } else {
          // Fallback sang Product Service nếu Search Service chưa bật hoặc trả lỗi
          try {
            const fallbackProd = await productService.getProducts({ page: 1, size: 6, status: 'ACTIVE' });
            setProducts(fallbackProd.content || []);
          } catch {
            setProducts([]);
          }
        }

        if (catRes.status === 'fulfilled') {
          setCategories(catRes.value || []);
        }
      } catch (err) {
        // Handled silently
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      router.push(`/products?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <Box>
      {/* Hero Banner with Integrated Search */}
      <Box
        sx={{
          py: { xs: 4, md: 6 },
          px: { xs: 2, md: 4 },
          mb: 5,
          bgcolor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 1,
          textAlign: 'center',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 800,
            color: 'text.primary',
            mb: 1.5,
            fontSize: { xs: '1.75rem', md: '2.25rem' },
          }}
        >
          Nền tảng Mua sắm NovaCommerce
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto', mb: 3.5 }}
        >
          Hệ thống thương mại điện tử hiện đại kiến trúc Microservices, tích hợp tìm kiếm full-text thông minh Elasticsearch 8.x.
        </Typography>

        {/* Integrated Search Bar on Home */}
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            maxWidth: 620,
            mx: 'auto',
            display: 'flex',
            gap: 1,
            alignItems: 'center',
          }}
        >
          <TextField
            fullWidth
            size="medium"
            placeholder="Tìm kiếm sản phẩm (iPhone, Laptop, Bàn phím...)"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
              sx: { bgcolor: '#ffffff', borderRadius: 1 },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ px: 3, whiteSpace: 'nowrap', minHeight: 48 }}
          >
            Tìm kiếm
          </Button>
        </Box>

        {/* Quick Category Tags */}
        {categories.length > 0 && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center', mr: 0.5 }}>
              Gợi ý danh mục:
            </Typography>
            {categories.slice(0, 5).map((cat) => (
              <Chip
                key={cat.id}
                label={cat.name}
                size="small"
                clickable
                component={Link}
                href={`/products?keyword=${encodeURIComponent(cat.name)}`}
                sx={{ borderRadius: 0.5, bgcolor: '#ffffff', border: '1px solid #e2e8f0' }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Latest Products Section */}
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Sản phẩm Nổi bật Mới nhất
          </Typography>
          <Button component={Link} href="/products" size="small" endIcon={<ArrowForwardIcon />}>
            Xem tất cả
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={32} />
          </Box>
        ) : products.length === 0 ? (
          <Card sx={{ p: 5, textAlign: 'center', bgcolor: '#ffffff' }}>
            <Inventory2Icon sx={{ fontSize: 48, color: '#94a3b8', mb: 1 }} />
            <Typography variant="body1" color="text.secondary">
              Chưa có sản phẩm nào trong hệ thống.
            </Typography>
            {isAdmin && (
              <Button
                component={Link}
                href="/admin/products"
                variant="contained"
                size="small"
                sx={{ mt: 2 }}
              >
                Thêm sản phẩm trong Trang Quản trị
              </Button>
            )}
          </Card>
        ) : (
          <Grid container spacing={3}>
            {products.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.25s ease',
                    border: '1px solid #e2e8f0',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px -10px rgba(0, 0, 0, 0.12)',
                      borderColor: '#cbd5e1',
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 220,
                      backgroundColor: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 2,
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    {item.images?.[0]?.url ? (
                      <Box
                        component="img"
                        src={item.images[0].url}
                        alt={item.name}
                        sx={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.06)',
                          },
                        }}
                      />
                    ) : (
                      <Inventory2Icon sx={{ fontSize: 52, color: '#94a3b8' }} />
                    )}
                  </Box>
                  <CardContent sx={{ flex: 1, p: 2.5 }}>
                    <Chip
                      label={item.categoryName || 'Sản phẩm'}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 20, mb: 1, borderRadius: 0.5 }}
                    />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }} noWrap>
                      {item.name}
                    </Typography>
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                      {formatPrice(item.price)}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      component={Link}
                      href={`/products/${item.id}`}
                      size="small"
                      variant="outlined"
                      fullWidth
                    >
                      Chi tiết sản phẩm
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
