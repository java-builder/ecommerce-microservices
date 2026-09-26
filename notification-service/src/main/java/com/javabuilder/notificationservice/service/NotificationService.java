package com.javabuilder.notificationservice.service;

import com.javabuilder.notificationservice.dto.response.NotificationResponse;
import com.javabuilder.notificationservice.dto.response.SliceResponse;
import com.javabuilder.notificationservice.entity.Notification;

public interface NotificationService {

    void saveNotification(Notification notification);

    SliceResponse<NotificationResponse> myNotification(String userId, int page, int size);
}
