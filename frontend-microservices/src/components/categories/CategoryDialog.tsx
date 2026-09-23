'use client';

import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types';

interface CategoryDialogProps {
  open: boolean;
  category?: Category | null;
  onClose: () => void;
  onSubmit: (data: CreateCategoryRequest | UpdateCategoryRequest) => Promise<void>;
}

export default function CategoryDialog({
  open,
  category,
  onClose,
  onSubmit,
}: CategoryDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});

  const isEdit = !!category;

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setDescription(category.description || '');
    } else {
      setName('');
      setDescription('');
    }
    setErrors({});
  }, [category, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrors({ name: 'Tên danh mục không được để trống' });
      return;
    }

    try {
      setLoading(true);
      await onSubmit({ name: name.trim(), description: description.trim() });
      onClose();
    } catch (err) {
      // Error handled by parent with useNotification
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {isEdit ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục Mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              label="Tên danh mục *"
              size="small"
              fullWidth
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({});
              }}
              error={!!errors.name}
              helperText={errors.name}
              disabled={loading}
              autoFocus
            />
            <TextField
              label="Mô tả danh mục"
              size="small"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} variant="outlined" color="inherit" size="small" disabled={loading}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {isEdit ? 'Lưu thay đổi' : 'Tạo mới'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
