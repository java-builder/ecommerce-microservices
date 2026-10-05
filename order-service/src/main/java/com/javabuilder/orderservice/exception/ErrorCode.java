package com.javabuilder.orderservice.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    INTERNAL_ERROR(500, "Unexpected error occurred while processing request in backend service", HttpStatus.INTERNAL_SERVER_ERROR),
    UNAUTHORIZED(401, "Unauthorized", HttpStatus.UNAUTHORIZED),
    FORBIDDEN(403, "Forbidden", HttpStatus.FORBIDDEN),

    EXTERNAL_SERVICE_ERROR(502, "Failed to communicate with external service", HttpStatus.BAD_GATEWAY),

    PRODUCT_OUT_OF_STOCK(400, "One or more products are out of stock", HttpStatus.BAD_REQUEST),

    ;

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}
