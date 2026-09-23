'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import {
  Category,
  CreateProductRequest,
  Product,
  ProductFilterParams,
  ProductStatus,
  UpdateProductRequest,
} from '@/types';
import { categoryService, productService } from '@/services';
import { useNotification } from '@/hooks/useNotification';
import { useDebounce } from '@/hooks/useDebounce';
import { PageHeader, ConfirmDialog, ProductDialog } from '@/components';
import { formatPrice } from '@/utils';

export default function AdminProductsPage() {
  const { showSuccess, showError } = useNotification();

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filter states
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState<ProductStatus | ''>('');

  const debouncedKeyword = useDebounce(keyword, 400);

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch Categories for dropdown
  useEffect(() => {
    categoryService
      .getCategories()
      .then((cats) => setCategories(cats || []))
      .catch(() => {});
  }, []);

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params: ProductFilterParams = {
        page,
        size: pageSize,
      };
      if (debouncedKeyword) params.keyword = debouncedKeyword;
      if (categoryId) params.categoryId = categoryId;
      if (status) params.status = status;

      const res = await productService.getProducts(params);
      setProducts(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err: any) {
      showError(err.response?.data?.message || 'Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedKeyword, categoryId, status, showError]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setSelectedProduct(prod);
    setDialogOpen(true);
  };

  const handleOpenDelete = (prod: Product) => {
    setProductToDelete(prod);
    setDeleteConfirmOpen(true);
  };

  const handleSubmitProduct = async (data: CreateProductRequest | UpdateProductRequest) => {
    try {
      if (selectedProduct) {
        await productService.updateProduct(selectedProduct.id, data);
        showSuccess('Cập nhật sản phẩm thành công');
      } else {
        await productService.createProduct(data as CreateProductRequest);
        showSuccess('Tạo sản phẩm mới thành công');
      }
      fetchProducts();
    } catch (err: any) {
      showError(err.response?.data?.message || 'Thao tác sản phẩm thất bại');
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      setDeleting(true);
      await productService.deleteProduct(productToDelete.id);
      showSuccess('Xóa sản phẩm thành công');
      setDeleteConfirmOpen(false);
      fetchProducts();
    } catch (err: any) {
      showError(err.response?.data?.message || 'Xóa sản phẩm thất bại');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusChip = (st: ProductStatus) => {
    switch (st) {
      case 'ACTIVE':
        return <Chip label="ACTIVE" color="success" size="small" sx={{ borderRadius: 0.5 }} />;
      case 'DRAFT':
        return <Chip label="DRAFT" color="warning" size="small" sx={{ borderRadius: 0.5 }} />;
      case 'INACTIVE':
        return <Chip label="INACTIVE" color="default" size="small" sx={{ borderRadius: 0.5 }} />;
      default:
        return <Chip label={st} size="small" sx={{ borderRadius: 0.5 }} />;
    }
  };

  return (
    <Box>
      <PageHeader
        title="Quản lý Sản phẩm"
        subtitle="Quản lý kho hàng, tạo mới và chỉnh sửa thông tin sản phẩm"
        action={
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={fetchProducts}
              disabled={loading}
            >
              Làm mới
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
            >
              Thêm Sản phẩm
            </Button>
          </Box>
        }
      />

        {/* Filters Bar */}
        <Card sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <TextField
                label="Tìm kiếm sản phẩm"
                size="small"
                fullWidth
                placeholder="Nhập tên sản phẩm..."
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPage(1);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
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
                <MenuItem value="">-- Tất cả danh mục --</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                select
                label="Trạng thái"
                size="small"
                fullWidth
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as ProductStatus | '');
                  setPage(1);
                }}
              >
                <MenuItem value="">-- Tất cả trạng thái --</MenuItem>
                <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                <MenuItem value="DRAFT">DRAFT</MenuItem>
                <MenuItem value="INACTIVE">INACTIVE</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Card>

        {/* Products Table */}
        <Card>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={32} />
            </Box>
          ) : products.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Inventory2Icon sx={{ fontSize: 48, color: '#94a3b8', mb: 1 }} />
              <Typography variant="body1" color="text.secondary">
                Chưa có sản phẩm nào. Hãy tạo sản phẩm đầu tiên!
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleOpenCreate}
                sx={{ mt: 2 }}
              >
                Tạo Sản phẩm Mới
              </Button>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: '80px' }}>Ảnh</TableCell>
                      <TableCell>Tên sản phẩm</TableCell>
                      <TableCell>Danh mục</TableCell>
                      <TableCell align="right">Đơn giá</TableCell>
                      <TableCell align="center">Kho</TableCell>
                      <TableCell align="center">Trạng thái</TableCell>
                      <TableCell align="right">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              backgroundColor: '#f8fafc',
                              borderRadius: 1,
                              border: '1px solid #e2e8f0',
                              overflow: 'hidden',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              p: 0.5,
                            }}
                          >
                            {item.images?.[0]?.url ? (
                              <Box
                                component="img"
                                src={item.images[0].url}
                                alt={item.name}
                                sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                              />
                            ) : (
                              <Inventory2Icon sx={{ color: '#94a3b8', fontSize: 24 }} />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {item.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {item.categoryName || 'Chung'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', whiteSpace: 'nowrap' }}>
                          {formatPrice(item.price)}
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {item.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">{getStatusChip(item.status)}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            component={Link}
                            href={`/products/${item.id}`}
                            size="small"
                            color="info"
                            title="Xem trang sản phẩm"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenEdit(item)}
                            title="Chỉnh sửa"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOpenDelete(item)}
                            title="Xóa"
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination footer */}
              <Box
                sx={{
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #e2e8f0',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Tổng cộng <strong>{totalElements}</strong> sản phẩm — Trang {page}/{totalPages}
                </Typography>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, val) => setPage(val)}
                  color="primary"
                  shape="rounded"
                  size="small"
                />
              </Box>
            </>
          )}
        </Card>

        {/* Product Create/Edit Dialog */}
        <ProductDialog
          open={dialogOpen}
          product={selectedProduct}
          categories={categories}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleSubmitProduct}
        />

        {/* Delete Confirmation */}
        <ConfirmDialog
          open={deleteConfirmOpen}
          title="Xác nhận xóa Sản phẩm"
          content={`Bạn có chắc muốn xóa sản phẩm "${productToDelete?.name}"?`}
          confirmText="Xóa sản phẩm"
          confirmColor="error"
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleteConfirmOpen(false)}
        />
      </Box>
  );
}
