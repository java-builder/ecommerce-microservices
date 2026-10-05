package com.javabuilder.orderservice.client.dto;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record ProductStockValidationResponse(
        String productId,
        String productName,
        BigDecimal price,
        String productThumbnail,
        Integer stockQuantity,
        Boolean isAvailable
) {
}
