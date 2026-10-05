package com.javabuilder.orderservice.dto.response;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record OrderDetailResponse(
        String id,
        String productId,
        String productName,
        String productThumbnail,
        BigDecimal price,
        Integer quantity
) {
}
