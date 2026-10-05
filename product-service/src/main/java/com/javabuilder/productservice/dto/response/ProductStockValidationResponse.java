package com.javabuilder.productservice.dto.response;

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
