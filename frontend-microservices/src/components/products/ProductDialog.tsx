'use client';

import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import StarIcon from '@mui/icons-material/Star';
import {
  Category,
  CreateProductRequest,
  Product,
  ProductStatus,
  UpdateProductRequest,
} from '@/types';
import { mediaService } from '@/services';
import { useNotification } from '@/hooks/useNotification';

const MAX_IMAGES = 10;

interface ImageItem {
  id?: string;
  file?: File;
  previewUrl: string;
  isRemote: boolean;
  isPrimary: boolean;
}

interface ProductDialogProps {
  open: boolean;
  product?: Product | null;
  categories: Category[];
  onClose: () => void;
  onSubmit: (data: CreateProductRequest | UpdateProductRequest) => Promise<void>;
}

export default function ProductDialog({
  open,
  product,
  categories,
  onClose,
  onSubmit,
}: ProductDialogProps) {
  const { showError } = useNotification();
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [quantity, setQuantity] = useState<number | string>('');
  const [status, setStatus] = useState<ProductStatus>('ACTIVE');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEdit = !!product;

  useEffect(() => {
    if (product) {
      setCategoryId(product.categoryId || '');
      setName(product.name || '');
      setDescription(product.description || '');
      setPrice(product.price);
      setQuantity(product.quantity);
      setStatus(product.status || 'ACTIVE');

      if (product.images && product.images.length > 0) {
        setImages(
          product.images.map((img, idx) => ({
            id: img.id,
            previewUrl: img.url,
            isRemote: true,
            isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
          }))
        );
      } else {
        setImages([]);
      }
    } else {
      setCategoryId(categories.length > 0 ? categories[0].id : '');
      setName('');
      setDescription('');
      setPrice('');
      setQuantity('');
      setStatus('ACTIVE');
      setImages([]);
    }
    setErrors({});
    setSubmitStep('');
  }, [product, open, categories]);

  // Chọn ảnh cục bộ, tạo preview và chờ submit mới upload qua presigned URL
  const handleSelectImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      showError(`Đã đạt giới hạn tối đa ${MAX_IMAGES} ảnh cho mỗi sản phẩm.`);
      e.target.value = '';
      return;
    }

    if (files.length > remainingSlots) {
      showError(`Chỉ có thể chọn thêm tối đa ${remainingSlots} ảnh (giới hạn ${MAX_IMAGES} ảnh/sản phẩm).`);
    }

    const selectedFiles = files.slice(0, remainingSlots);
    const newItems: ImageItem[] = selectedFiles.map((file, idx) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      isRemote: false,
      isPrimary: images.length === 0 && idx === 0,
    }));

    setImages((prev) => [...prev, ...newItems]);
    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => {
      const itemToRemove = prev[indexToRemove];
      if (!itemToRemove.isRemote && itemToRemove.previewUrl) {
        URL.revokeObjectURL(itemToRemove.previewUrl);
      }
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      if (itemToRemove.isPrimary && updated.length > 0) {
        updated[0].isPrimary = true;
      }
      return updated;
    });
  };

  const handleSetPrimary = (indexToPrimary: number) => {
    setImages((prev) =>
      prev.map((item, idx) => ({
        ...item,
        isPrimary: idx === indexToPrimary,
      }))
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Tên sản phẩm là bắt buộc';
    if (!categoryId) newErrors.categoryId = 'Vui lòng chọn danh mục';
    if (price === '' || Number(price) < 0) newErrors.price = 'Giá sản phẩm không hợp lệ (>= 0)';
    if (quantity === '' || Number(quantity) < 0) newErrors.quantity = 'Số lượng không hợp lệ (>= 0)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);

      // Bước 1: Upload các ảnh mới qua Presigned URL lên S3
      const newImagesCount = images.filter((img) => !img.isRemote).length;
      if (newImagesCount > 0) {
        setSubmitStep(`Đang tải ${newImagesCount} ảnh lên AWS S3...`);
      }

      const uploadedImages = await Promise.all(
        images.map(async (item) => {
          if (item.isRemote) {
            return {
              url: item.previewUrl,
              isPrimary: item.isPrimary,
            };
          }

          // 1. Gọi API lấy presigned URL từ Media Service
          const presigned = await mediaService.getPresignedUrl(item.file!.name);

          // 2. Upload binary file trực tiếp lên S3
          await mediaService.uploadToS3WithPresignedUrl(presigned.url, item.file!);

          // URL vĩnh viễn trên S3 sau khi loại bỏ query params chữ ký
          const cleanUrl = presigned.url.split('?')[0];
          return {
            url: cleanUrl,
            isPrimary: item.isPrimary,
          };
        })
      );

      // Đảm bảo ít nhất 1 ảnh làm ảnh chính nếu có ảnh
      if (uploadedImages.length > 0 && !uploadedImages.some((img) => img.isPrimary)) {
        uploadedImages[0].isPrimary = true;
      }

      // Bước 2: Gán danh sách URL vào request body và gọi API Product Service
      setSubmitStep('Đang lưu thông tin sản phẩm...');
      const payload: CreateProductRequest = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        quantity: Number(quantity),
        categoryId,
        status,
        images: uploadedImages,
      };

      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      showError(err.response?.data?.message || err.message || 'Thao tác sản phẩm thất bại');
    } finally {
      setSubmitting(false);
      setSubmitStep('');
    }
  };

  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {isEdit ? 'Chỉnh sửa Sản phẩm' : 'Thêm Sản phẩm Mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Tên sản phẩm *"
                size="small"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                disabled={submitting}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Danh mục *"
                size="small"
                fullWidth
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                error={!!errors.categoryId}
                helperText={errors.categoryId}
                disabled={submitting}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Giá bán (VNĐ) *"
                type="number"
                size="small"
                fullWidth
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                error={!!errors.price}
                helperText={errors.price}
                disabled={submitting}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Số lượng kho *"
                type="number"
                size="small"
                fullWidth
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                error={!!errors.quantity}
                helperText={errors.quantity}
                disabled={submitting}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Trạng thái *"
                size="small"
                fullWidth
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                disabled={submitting}
              >
                <MenuItem value="ACTIVE">ACTIVE (Kinh doanh)</MenuItem>
                <MenuItem value="DRAFT">DRAFT (Bản nháp)</MenuItem>
                <MenuItem value="INACTIVE">INACTIVE (Ngừng bán)</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Mô tả chi tiết sản phẩm"
                size="small"
                fullWidth
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={submitting}
              />
            </Grid>

            {/* Quản lý Hình ảnh sản phẩm (Tối đa 10 ảnh) */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Hình ảnh sản phẩm
                  </Typography>
                  <Chip
                    label={`${images.length}/${MAX_IMAGES} ảnh`}
                    size="small"
                    color={images.length >= MAX_IMAGES ? 'warning' : 'primary'}
                    variant={images.length > 0 ? 'filled' : 'outlined'}
                    sx={{ height: 22, fontSize: '0.75rem', fontWeight: 600 }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  * Tối đa 10 ảnh. Click vào ảnh để chọn làm ảnh chính.
                </Typography>
              </Box>

              {/* Grid hiển thị thumbnails & nút thêm ảnh */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1.5,
                  p: 1.5,
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                  border: '1px dashed #cbd5e1',
                  minHeight: 110,
                  alignItems: 'center',
                }}
              >
                {images.map((item, idx) => (
                  <Box
                    key={item.previewUrl + idx}
                    onClick={() => handleSetPrimary(idx)}
                    sx={{
                      position: 'relative',
                      width: 100,
                      height: 100,
                      borderRadius: 2,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: item.isPrimary ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      boxShadow: item.isPrimary ? '0 0 0 2px rgba(37,99,235,0.2)' : 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={item.previewUrl}
                      alt={`Ảnh ${idx + 1}`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />

                    {/* Badge Ảnh chính */}
                    {item.isPrimary ? (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 4,
                          left: 4,
                          bgcolor: '#2563eb',
                          color: '#fff',
                          px: 0.8,
                          py: 0.2,
                          borderRadius: 1,
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.3,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        }}
                      >
                        <StarIcon sx={{ fontSize: 11 }} />
                        Chính
                      </Box>
                    ) : (
                      <Tooltip title="Click để đặt làm ảnh chính">
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 4,
                            left: 4,
                            bgcolor: 'rgba(0,0,0,0.4)',
                            color: '#fff',
                            p: 0.3,
                            borderRadius: '50%',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            '&:hover': { bgcolor: '#2563eb' },
                            '.MuiBox-root:hover &': { opacity: 1 },
                          }}
                        >
                          <StarIcon sx={{ fontSize: 13 }} />
                        </Box>
                      </Tooltip>
                    )}

                    {/* Nút xóa ảnh */}
                    <IconButton
                      size="small"
                      disabled={submitting}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(idx);
                      }}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        p: 0.3,
                        '&:hover': { bgcolor: '#ef4444' },
                      }}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                ))}

                {/* Nút thêm ảnh nếu chưa đạt tối đa 10 ảnh */}
                {images.length < MAX_IMAGES && (
                  <Box
                    component="label"
                    sx={{
                      width: 100,
                      height: 100,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 2,
                      border: '2px dashed #94a3b8',
                      bgcolor: '#fff',
                      color: '#64748b',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      opacity: submitting ? 0.6 : 1,
                      '&:hover': {
                        borderColor: '#2563eb',
                        color: '#2563eb',
                        bgcolor: '#eff6ff',
                      },
                    }}
                  >
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/*"
                      onChange={handleSelectImages}
                      disabled={submitting}
                    />
                    <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 26, mb: 0.5 }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.72rem' }}>
                      + Thêm ảnh
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                      ({MAX_IMAGES - images.length} còn lại)
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {submitting && submitStep && (
              <>
                <CircularProgress size={16} />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {submitStep}
                </Typography>
              </>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button onClick={onClose} variant="outlined" color="inherit" size="small" disabled={submitting}>
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {isEdit ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
}
