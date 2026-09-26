'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CelebrationOutlinedIcon from '@mui/icons-material/CelebrationOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsOffOutlinedIcon from '@mui/icons-material/NotificationsOffOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import DoneAllIcon from '@mui/icons-material/DoneAll';

import { notificationService } from '@/services/notification.service';
import { NotificationItem, NotificationType } from '@/types';
import { formatRelativeTime, formatDateTime } from '@/utils/format';
import { useAuth } from '@/hooks/useAuth';

const PAGE_SIZE = 10;

const getNotificationTypeConfig = (type: NotificationType | string) => {
  switch (type) {
    case 'WELCOME_USER':
      return {
        icon: <CelebrationOutlinedIcon fontSize="small" />,
        bgColor: '#e0f2fe',
        color: '#0284c7',
        label: 'Chào mừng',
      };
    case 'ORDER_CREATED':
      return {
        icon: <ShoppingBagOutlinedIcon fontSize="small" />,
        bgColor: '#fef3c7',
        color: '#d97706',
        label: 'Đơn hàng mới',
      };
    case 'ORDER_CONFIRMED':
      return {
        icon: <LocalShippingOutlinedIcon fontSize="small" />,
        bgColor: '#e0e7ff',
        color: '#4f46e5',
        label: 'Xác nhận đơn',
      };
    case 'PAYMENT_SUCCESS':
      return {
        icon: <CheckCircleOutlineIcon fontSize="small" />,
        bgColor: '#dcfce7',
        color: '#16a34a',
        label: 'Thanh toán thành công',
      };
    case 'PAYMENT_FAILED':
      return {
        icon: <ErrorOutlineIcon fontSize="small" />,
        bgColor: '#fee2e2',
        color: '#dc2626',
        label: 'Thanh toán thất bại',
      };
    default:
      return {
        icon: <NotificationsActiveIcon fontSize="small" />,
        bgColor: '#f1f5f9',
        color: '#475569',
        label: 'Thông báo',
      };
  }
};

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [markingAll, setMarkingAll] = useState<boolean>(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const fetchInitialNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const data = await notificationService.getMyNotifications({ page: 1, size: PAGE_SIZE });
      setNotifications(data.content || []);
      setPage(1);
      setHasNext(Boolean(data.hasNext));
    } catch (err) {
      console.error('Lỗi khi tải thông báo:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchInitialNotifications();
    } else {
      setNotifications([]);
      setHasNext(false);
      setPage(1);
    }
  }, [isAuthenticated, fetchInitialNotifications]);

  const markUnreadNotificationsAsRead = async (items: NotificationItem[]) => {
    const unreadIds = items.filter((n) => !n.isRead).map((n) => n.id);
    if (unreadIds.length === 0) return;

    setNotifications((prev) =>
      prev.map((n) => (unreadIds.includes(n.id) ? { ...n, isRead: true } : n))
    );

    try {
      await notificationService.markAsRead(unreadIds);
    } catch (err) {
      console.error('Lỗi khi đánh dấu thông báo đã đọc:', err);
    }
  };

  const handleOpen = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    if (notifications.length === 0) {
      try {
        setLoading(true);
        const data = await notificationService.getMyNotifications({ page: 1, size: PAGE_SIZE });
        const items = data.content || [];
        setNotifications(items);
        setPage(1);
        setHasNext(Boolean(data.hasNext));
        markUnreadNotificationsAsRead(items);
      } catch (err) {
        console.error('Lỗi khi tải thông báo:', err);
      } finally {
        setLoading(false);
      }
    } else {
      markUnreadNotificationsAsRead(notifications);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasNext) return;
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const data = await notificationService.getMyNotifications({
        page: nextPage,
        size: PAGE_SIZE,
      });

      const newItems = data.content || [];
      setNotifications((prev) => [...prev, ...newItems]);
      setPage(nextPage);
      setHasNext(Boolean(data.hasNext));

      markUnreadNotificationsAsRead(newItems);
    } catch (err) {
      console.error('Lỗi khi tải thêm thông báo:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleNotificationClick = async (item: NotificationItem) => {
    setSelectedNotification(item);

    if (!item.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
      );
      setSelectedNotification({ ...item, isRead: true });

      try {
        await notificationService.markAsRead([item.id]);
      } catch (err) {
        console.error('Lỗi khi đánh dấu thông báo đã đọc:', err);
      }
    }
  };

  const handleMarkSingleAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await notificationService.markAsRead([id]);
    } catch (err) {
      console.error('Lỗi khi đánh dấu thông báo đã đọc:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (markingAll || unreadCount === 0) return;
    try {
      setMarkingAll(true);
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
      await notificationService.markAllAsRead();
    } catch (err) {
      console.error('Lỗi khi đánh dấu tất cả đã đọc:', err);
      fetchInitialNotifications();
    } finally {
      setMarkingAll(false);
    }
  };

  const isOpen = Boolean(anchorEl);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Tooltip title="Thông báo">
        <IconButton
          onClick={handleOpen}
          aria-label="Thông báo"
          sx={{
            p: 1,
            color: isOpen ? 'primary.main' : 'text.secondary',
            backgroundColor: isOpen ? '#f1f5f9' : 'transparent',
            '&:hover': {
              backgroundColor: '#f1f5f9',
            },
          }}
        >
          <Badge
            badgeContent={unreadCount}
            color="error"
            max={99}
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.7rem',
                height: 18,
                minWidth: 18,
                fontWeight: 600,
              },
            }}
          >
            <NotificationsNoneIcon sx={{ fontSize: 24 }} />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: { xs: 340, sm: 400 },
            maxHeight: 520,
            display: 'flex',
            flexDirection: 'column',
            mt: 1.5,
            borderRadius: 2,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f1f5f9',
            backgroundColor: '#ffffff',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Thông báo
            </Typography>
            {unreadCount > 0 && (
              <Chip
                label={`${unreadCount} mới`}
                size="small"
                color="primary"
                sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600 }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {unreadCount > 0 && (
              <Tooltip title="Đánh dấu tất cả đã đọc">
                <span>
                  <IconButton
                    size="small"
                    onClick={handleMarkAllAsRead}
                    disabled={markingAll}
                    sx={{
                      color: 'text.secondary',
                      '&:hover': { color: 'primary.main', bgcolor: '#f1f5f9' },
                    }}
                  >
                    {markingAll ? (
                      <CircularProgress size={16} />
                    ) : (
                      <DoneAllIcon fontSize="small" />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            )}
            <Tooltip title="Làm mới">
              <IconButton
                size="small"
                onClick={fetchInitialNotifications}
                disabled={loading}
                sx={{ color: 'text.secondary' }}
              >
                <RefreshIcon
                  fontSize="small"
                  sx={{
                    animation: loading ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            backgroundColor: '#ffffff',
          }}
        >
          {loading && notifications.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                gap: 1.5,
              }}
            >
              <CircularProgress size={28} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Đang tải thông báo...
              </Typography>
            </Box>
          ) : notifications.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 5,
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.5,
                  color: 'text.secondary',
                }}
              >
                <NotificationsOffOutlinedIcon sx={{ fontSize: 30 }} />
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Chưa có thông báo nào
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
                Bạn sẽ nhận được thông báo khi có hoạt động mới trên tài khoản.
              </Typography>
            </Box>
          ) : (
            <Box component="div">
              {notifications.map((item, index) => {
                const config = getNotificationTypeConfig(item.notificationType);
                const isUnread = !item.isRead;

                return (
                  <React.Fragment key={item.id || index}>
                    <Box
                      onClick={() => handleNotificationClick(item)}
                      sx={{
                        p: 1.75,
                        display: 'flex',
                        gap: 1.5,
                        alignItems: 'flex-start',
                        cursor: 'pointer',
                        backgroundColor: isUnread ? '#f8fafc' : '#ffffff',
                        position: 'relative',
                        transition: 'background-color 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#f1f5f9',
                        },
                      }}
                    >
                      {isUnread && (
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 6,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: 'primary.main',
                          }}
                        />
                      )}

                      <Avatar
                        sx={{
                          bgcolor: config.bgColor,
                          color: config.color,
                          width: 36,
                          height: 36,
                          mt: 0.25,
                        }}
                      >
                        {config.icon}
                      </Avatar>

                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: isUnread ? 700 : 500,
                              color: 'text.primary',
                              fontSize: '0.85rem',
                              lineHeight: 1.3,
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.secondary',
                                fontSize: '0.7rem',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {formatRelativeTime(item.createdAt)}
                            </Typography>
                            {isUnread && (
                              <Tooltip title="Đánh dấu đã đọc">
                                <IconButton
                                  size="small"
                                  onClick={(e) => handleMarkSingleAsRead(item.id, e)}
                                  sx={{
                                    p: 0.25,
                                    color: 'primary.main',
                                    '&:hover': { bgcolor: 'rgba(2, 132, 199, 0.1)' },
                                  }}
                                >
                                  <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.8rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.4,
                            mb: 0.75,
                          }}
                        >
                          {item.content}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            icon={<EmailOutlinedIcon sx={{ '&&': { fontSize: 12 } }} />}
                            label={item.channel}
                            size="small"
                            variant="outlined"
                            sx={{
                              height: 18,
                              fontSize: '0.65rem',
                              color: 'text.secondary',
                              borderColor: '#e2e8f0',
                            }}
                          />
                          <Chip
                            label={config.label}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.65rem',
                              bgcolor: config.bgColor,
                              color: config.color,
                              fontWeight: 500,
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                    {index < notifications.length - 1 && (
                      <Divider sx={{ borderColor: '#f1f5f9' }} />
                    )}
                  </React.Fragment>
                );
              })}

              {hasNext && (
                <Box sx={{ p: 1.5, textAlign: 'center', bgcolor: '#ffffff' }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    sx={{
                      width: '100%',
                      fontWeight: 600,
                      color: 'primary.main',
                      textTransform: 'none',
                    }}
                  >
                    {loadingMore ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} />
                        <span>Đang tải thêm...</span>
                      </Box>
                    ) : (
                      'Xem thông báo cũ hơn'
                    )}
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Popover>

      <Dialog
        open={Boolean(selectedNotification)}
        onClose={() => setSelectedNotification(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2, p: 1 },
        }}
      >
        {selectedNotification && (
          <>
            <DialogTitle
              sx={{
                m: 0,
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                {selectedNotification.title}
              </Typography>
              <IconButton
                aria-label="close"
                onClick={() => setSelectedNotification(null)}
                size="small"
                sx={{ color: 'text.secondary' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Chip
                  label={selectedNotification.isRead ? 'Đã đọc' : 'Chưa đọc'}
                  size="small"
                  color={selectedNotification.isRead ? 'default' : 'warning'}
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', fontWeight: 600 }}
                />
                <Chip
                  label={`Kênh: ${selectedNotification.channel}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
                <Chip
                  label={`Loại: ${selectedNotification.notificationType}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary', alignSelf: 'center' }}>
                  Thời gian: {formatDateTime(selectedNotification.createdAt)}
                </Typography>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.primary',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                  backgroundColor: '#f8fafc',
                  p: 2,
                  borderRadius: 1.5,
                  border: '1px solid #e2e8f0',
                }}
              >
                {selectedNotification.content}
              </Typography>

              {selectedNotification.metadata &&
                Object.keys(selectedNotification.metadata).length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 0.5 }}
                    >
                      Dữ liệu mở rộng (Metadata):
                    </Typography>
                    <Box
                      component="pre"
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        bgcolor: '#0f172a',
                        color: '#f8fafc',
                        fontSize: '0.75rem',
                        overflowX: 'auto',
                      }}
                    >
                      {JSON.stringify(selectedNotification.metadata, null, 2)}
                    </Box>
                  </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 2.5, pb: 2 }}>
              <Button
                variant="contained"
                onClick={() => setSelectedNotification(null)}
                size="small"
              >
                Đóng
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
