package com.javabuilder.productservice.dto.response;

import com.javabuilder.productservice.common.ProductStatus;
import com.javabuilder.productservice.entity.ProductImage;
import lombok.Builder;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Builder
public record CreateProductResponse(
        String id,
        String name,
        String description,
        BigDecimal price,
        Integer quantity,
        List<ProductImage> images,
        ProductStatus status,
        Instant createdAt
) {
}
