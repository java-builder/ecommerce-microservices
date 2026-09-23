'use client';

import React, { useEffect, useState } from 'react';
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
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import CategoryIcon from '@mui/icons-material/Category';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types';
import { categoryService } from '@/services';
import { useNotification } from '@/hooks/useNotification';
import { PageHeader, ConfirmDialog, CategoryDialog } from '@/components';

export default function AdminCategoriesPage() {
  const { showSuccess, showError } = useNotification();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Delete Confirm State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategories();
      setCategories(data || []);
    } catch (err: any) {
      showError(err.response?.data?.message || 'Không thể tải danh sách danh mục từ Product Service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleOpenDelete = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteConfirmOpen(true);
  };

  const handleSubmitCategory = async (data: CreateCategoryRequest | UpdateCategoryRequest) => {
    try {
      if (selectedCategory) {
        await categoryService.updateCategory(selectedCategory.id, data);
        showSuccess('Cập nhật danh mục thành công');
      } else {
        await categoryService.createCategory(data as CreateCategoryRequest);
        showSuccess('Tạo danh mục mới thành công');
      }
      fetchCategories();
    } catch (err: any) {
      showError(err.response?.data?.message || 'Thao tác danh mục thất bại');
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setDeleting(true);
      await categoryService.deleteCategory(categoryToDelete.id);
      showSuccess('Xóa danh mục thành công');
      setDeleteConfirmOpen(false);
      fetchCategories();
    } catch (err: any) {
      showError(err.response?.data?.message || 'Xóa danh mục thất bại');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Quản lý Danh mục"
        subtitle="Quản lý danh mục hàng hóa trên Product Service"
        action={
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={fetchCategories}
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
              Thêm Danh mục
            </Button>
          </Box>
        }
      />

        <Card>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={32} />
            </Box>
          ) : categories.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <CategoryIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 1 }} />
              <Typography variant="body1" color="text.secondary">
                Chưa có danh mục nào. Hãy tạo danh mục đầu tiên!
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleOpenCreate}
                sx={{ mt: 2 }}
              >
                Tạo Danh mục
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '35%' }}>Tên Danh mục</TableCell>
                    <TableCell sx={{ width: '50%' }}>Mô tả</TableCell>
                    <TableCell align="right" sx={{ width: '15%' }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.map((cat) => (
                    <TableRow key={cat.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{cat.name}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>
                        {cat.description || '—'}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenEdit(cat)}
                          title="Chỉnh sửa"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleOpenDelete(cat)}
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
          )}
        </Card>

        {/* Category Create/Edit Modal */}
        <CategoryDialog
          open={dialogOpen}
          category={selectedCategory}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleSubmitCategory}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteConfirmOpen}
          title="Xác nhận xóa Danh mục"
          content={`Bạn có chắc chắn muốn xóa danh mục "${categoryToDelete?.name}" không?`}
          confirmText="Xóa danh mục"
          confirmColor="error"
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleteConfirmOpen(false)}
        />
      </Box>
  );
}
