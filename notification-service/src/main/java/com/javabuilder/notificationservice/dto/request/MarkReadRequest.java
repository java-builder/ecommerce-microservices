package com.javabuilder.notificationservice.dto.request;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record MarkReadRequest(
        @NotEmpty(message = "Ids cannot be empty")
        List<String> ids
) {
}
