package com.javabuilder.notificationservice.entity;

import com.javabuilder.notificationservice.common.NotificationChannel;
import com.javabuilder.notificationservice.common.NotificationStatus;
import com.javabuilder.notificationservice.common.NotificationType;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;
import java.time.Instant;
import java.util.Map;

@Document(collection = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @MongoId
    private String id;

    private String userId;

    private String recipientId;

    private NotificationChannel channel;

    private NotificationType notificationType;

    private String title;

    private String content;

    private Map<String, Object> metadata;

    private boolean isRead = false;

    private NotificationStatus status;

    private Instant createdAt;

    private Instant sentAt;
}
