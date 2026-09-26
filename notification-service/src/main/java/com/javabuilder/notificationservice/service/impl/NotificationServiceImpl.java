package com.javabuilder.notificationservice.service.impl;

import com.javabuilder.notificationservice.common.NotificationStatus;
import com.javabuilder.notificationservice.dto.request.MarkReadRequest;
import com.javabuilder.notificationservice.dto.response.NotificationResponse;
import com.javabuilder.notificationservice.dto.response.SliceResponse;
import com.javabuilder.notificationservice.entity.Notification;
import com.javabuilder.notificationservice.mapper.NotificationMapper;
import com.javabuilder.notificationservice.repository.NotificationRepository;
import com.javabuilder.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "NOTIFICATION-SERVICE")
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    @Override
    public void saveNotification(Notification notification) {
       try {
           notification.setStatus(NotificationStatus.SENT);
           notificationRepository.save(notification);
           log.info("Notification saved successfully: {}", notification);
       } catch (Exception e) {
           log.error("Failed to save notification: {}", notification, e);
           notification.setStatus(NotificationStatus.FAILED);
           notificationRepository.save(notification);
       }
    }

    @Override
    public SliceResponse<NotificationResponse> myNotification(String userId, int page, int size) {
        Sort sort = Sort.by(Notification::getCreatedAt).descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Slice<Notification> notificationsSlice = notificationRepository.findByRecipientId(userId, pageable);
        List<NotificationResponse> content = notificationsSlice.getContent()
                .stream()
                .map(notificationMapper::toNotificationResponse)
                .toList();

        return SliceResponse.<NotificationResponse>builder()
                .currentPage(page)
                .pageSize(notificationsSlice.getSize())
                .hasNext(notificationsSlice.hasNext())
                .isLast(notificationsSlice.isLast())
                .content(content)
                .build();
    }

    @Override
    public Long markNotificationsAsRead(MarkReadRequest request) {
        long modifiedCount = notificationRepository.markAsReadByIds(request.ids());
        log.info("Marked {} notifications as read", modifiedCount);
        return modifiedCount;
    }

    @Override
    public Long markAllAsRead(String userId) {
        long modifiedCount = notificationRepository.markAllAsReadByRecipientId(userId);
        log.info("Marked all ({}) notifications as read for user {}", modifiedCount, userId);
        return modifiedCount;
    }
}
