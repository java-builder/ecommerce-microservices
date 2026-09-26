package com.javabuilder.notificationservice.dto.response;

import com.javabuilder.notificationservice.common.NotificationChannel;
import com.javabuilder.notificationservice.common.NotificationType;
import lombok.*;
import java.time.Instant;
import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class NotificationResponse {
    private String id;
    private String recipientId;
    private NotificationChannel channel;
    private NotificationType notificationType;
    private String title;
    private String content;
    private Map<String, Object> metadata;
    private Boolean isRead;
    private Instant createdAt;
    private Instant sentAt;
}
