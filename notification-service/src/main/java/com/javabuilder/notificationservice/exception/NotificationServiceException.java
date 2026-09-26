package com.javabuilder.notificationservice.exception;

import lombok.Getter;

@Getter
public class NotificationServiceException extends RuntimeException {

    private final ErrorCode errorCode;

    public NotificationServiceException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
