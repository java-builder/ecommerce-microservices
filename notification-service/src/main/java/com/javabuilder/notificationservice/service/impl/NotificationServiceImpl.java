package com.javabuilder.notificationservice.service.impl;

import com.javabuilder.notificationservice.common.NotificationStatus;
import com.javabuilder.notificationservice.entity.Notification;
import com.javabuilder.notificationservice.repository.NotificationRepository;
import com.javabuilder.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "NOTIFICATION-SERVICE")
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

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
}
