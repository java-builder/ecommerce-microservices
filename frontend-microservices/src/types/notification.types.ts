export type NotificationChannel = 'EMAIL' | 'SMS' | 'PUSH';

export type NotificationType =
  | 'WELCOME_USER'
  | 'ORDER_CREATED'
  | 'ORDER_CONFIRMED'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED';

export interface NotificationItem {
  id: string;
  recipientId: string;
  channel: NotificationChannel;
  notificationType: NotificationType;
  title: string;
  content: string;
  metadata?: Record<string, any> | null;
  isRead: boolean;
  createdAt: string;
  sentAt?: string;
}

export interface NotificationPaginationParams {
  page?: number;
  size?: number;
}

export interface MarkReadRequest {
  ids: string[];
}

