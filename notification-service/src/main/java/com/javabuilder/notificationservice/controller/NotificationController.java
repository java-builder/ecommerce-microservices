package com.javabuilder.notificationservice.controller;

import com.javabuilder.notificationservice.dto.request.MarkReadRequest;
import com.javabuilder.notificationservice.dto.response.ApiResponse;
import com.javabuilder.notificationservice.dto.response.NotificationResponse;
import com.javabuilder.notificationservice.dto.response.SliceResponse;
import com.javabuilder.notificationservice.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    ApiResponse<SliceResponse<NotificationResponse>> getMyNotification(@AuthenticationPrincipal Jwt jwt,
                                                                       @RequestParam(name = "page", defaultValue = "1") int page,
                                                                       @RequestParam(name = "size", defaultValue = "10") int size) {
        var data = notificationService.myNotification(jwt.getSubject(), page, size);
        return ApiResponse.<SliceResponse<NotificationResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Notifications retrieved successfully")
                .data(data)
                .build();
    }

    @PutMapping("/mark-as-read")
    ApiResponse<Long> markAsRead(@RequestBody @Valid MarkReadRequest request) {
        var data = notificationService.markNotificationsAsRead(request);
        return ApiResponse.<Long>builder()
                .code(HttpStatus.OK.value())
                .message("Notifications marked as read successfully")
                .data(data)
                .build();
    }
}
