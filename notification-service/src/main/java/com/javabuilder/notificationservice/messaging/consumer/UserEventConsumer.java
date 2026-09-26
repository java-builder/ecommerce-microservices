package com.javabuilder.notificationservice.messaging.consumer;

import com.javabuilder.event.UserCreatedEvent;
import com.javabuilder.notificationservice.common.NotificationChannel;
import com.javabuilder.notificationservice.common.NotificationStatus;
import com.javabuilder.notificationservice.common.NotificationType;
import com.javabuilder.notificationservice.entity.Notification;
import com.javabuilder.notificationservice.service.MailService;
import com.javabuilder.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j(topic = "USER-EVENT-CONSUMER")
public class UserEventConsumer {

    private final MailService mailService;
    private final NotificationService notificationService;

    @KafkaListener(topics = "user-created", groupId = "notification-service-consumer")
    public void handleUserCreated(UserCreatedEvent event) {
        mailService.sendEmail(
                event.getEmail(),
                "Chào mừng bạn đến với JavaBuilder",
                "welcome",
                Map.of("email", event.getEmail())
        );

        Notification notification = Notification.builder()
                .recipientId(event.getUserId())
                .channel(NotificationChannel.EMAIL)
                .notificationType(NotificationType.WELCOME_USER)
                .title("Chào mừng bạn đến với JavaBuilder")
                .content("Tài khoản của bạn đã được kích hoạt thành công. Hãy bắt đầu khám phá hệ sinh thái NovaCommerce ngay hôm nay!")
                .isRead(false)
                .status(NotificationStatus.PENDING)
                .createdAt(Instant.now())
                .sentAt(Instant.now())
                .build();

        notificationService.saveNotification(notification);
    }
}
