'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Chip from '@mui/material/Chip';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Category, Product } from '@/types';
import { categoryService, productService, searchService } from '@/services';
import { useDebounce } from '@/hooks/useDebounce';
import { PageHeader } from '@/components';
import { formatPrice } from '@/utils';

export default function ProductsCatalogPage() {
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get('keyword') || '';

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [keyword, setKeyword] = useState(initialKeyword);
  const [categoryId, setCategoryId] = useState('');
  const [minPrice, setMinPrice] = useState<number | string>('');
  const [maxPrice, setMaxPrice] = useState<number | string>('');
  const [inStock, setInStock] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const debouncedKeyword = useDebounce(keyword, 400);

  // Load categories
  useEffect(() => {
    categoryService
      .getCategories()
      .then((cats) => setCategories(cats || []))
      .catch(() => {});
  }, []);

  // Fetch / Search Products (Luôn gọi Search Service trực tiếp)
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      try {
        const searchRes = await searchService.searchProducts({
          keyword: debouncedKeyword.trim() || undefined,
          categoryId: categoryId || undefined,
          minPrice: minPrice !== '' ? Number(minPrice) : undefined,
          maxPrice: maxPrice !== '' ? Number(maxPrice) : undefined,
          inStock: inStock ? true : undefined,
          page,
          size: pageSize,
        });

        // Map SearchProductDocument (với thumbnail từ Search Service) sang Product model
        const mapped: Product[] = (searchRes.content || []).map((doc) => ({
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
        setTotalPages(searchRes.totalPages || 1);
        setTotalElements(searchRes.totalElements || 0);
        return;
      } catch (searchErr) {
        console.warn('Search Service không phản hồi, fallback sang Product Service:', searchErr);
      }

      // Fallback gọi Product Service nếu Search Service chưa chạy
      const res = await productService.getProducts({
        page,
        size: pageSize,
        keyword: debouncedKeyword.trim() || undefined,
        categoryId: categoryId || undefined,
        status: 'ACTIVE',
      });

      setProducts(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      setProducts([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, categoryId, minPrice, maxPrice, inStock, page, pageSize]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleResetFilters = () => {
    setKeyword('');
    setCategoryId('');
    setMinPrice('');
    setMaxPrice('');
    setInStock(false);
    setPage(1);
  };

  return (
    <Box>
      <PageHeader
        title="Danh mục Sản phẩm"
        subtitle="Khám phá và tìm kiếm các mặt hàng với công nghệ tìm kiếm thông minh Elasticsearch"
      />

      {/* Search & Filter Toolbar */}
      <Card sx={{ p: 2.5, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search Input Bar (Elasticsearch full-text search) */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm kiếm sản phẩm (tên, mô tả, từ khóa...)"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(1);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Category Dropdown */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Danh mục"
              size="small"
              fullWidth
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="">Tất cả danh mục</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Price Range Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                placeholder="Giá từ"
                type="number"
                size="small"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPage(1);
                }}
              />
              <Typography variant="body2" color="text.secondary">
                -
              </Typography>
              <TextField
                placeholder="Đến"
                type="number"
                size="small"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
              />
            </Box>
          </Grid>

          {/* In Stock toggle & Reset button */}
          <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={inStock}
                  onChange={(e) => {
                    setInStock(e.target.checked);
                    setPage(1);
                  }}
                  size="small"
                  color="primary"
                />
              }
              label={<Typography variant="caption">Còn hàng</Typography>}
            />
            <Button size="small" onClick={handleResetFilters} sx={{ fontSize: '0.75rem' }}>
              Đặt lại
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Products Showcase Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={36} />
        </Box>
      ) : products.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center', bgcolor: '#ffffff' }}>
          <Inventory2Icon sx={{ fontSize: 48, color: '#94a3b8', mb: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Không tìm thấy sản phẩm nào
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Hãy thử đổi từ khóa tìm kiếm hoặc điều chỉnh lại các tiêu chí bộ lọc.
          </Typography>
        </Card>
      ) : (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Hiển thị <strong>{products.length}</strong> trên tổng số <strong>{totalElements}</strong> sản phẩm
            </Typography>
          </Box>

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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Chip
                        label={item.categoryName || 'Sản phẩm'}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 20, borderRadius: 0.5 }}
                      />
                      {item.quantity > 0 && (
                        <Typography
                          variant="caption"
                          color="success.main"
                          sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}
                        >
                          <CheckCircleOutlineIcon sx={{ fontSize: 14 }} /> Còn hàng ({item.quantity})
                        </Typography>
                      )}
                    </Box>

                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 0.5, lineHeight: 1.3 }}
                      noWrap
                    >
                      {item.name}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mb: 2,
                        minHeight: 36,
                      }}
                    >
                      {item.description || 'Chưa có thông tin mô tả cho sản phẩm này.'}
                    </Typography>

                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                      {formatPrice(item.price)}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      component={Link}
                      href={`/products/${item.id}`}
                      variant="outlined"
                      size="small"
                      fullWidth
                      endIcon={<ArrowForwardIcon />}
                    >
                      Xem chi tiết
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, val) => setPage(val)}
                color="primary"
                shape="rounded"
                size="small"
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
