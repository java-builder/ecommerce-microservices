package com.javabuilder.productservice.dto.request;

import com.javabuilder.productservice.common.ProductStatus;
import java.math.BigDecimal;

public record SearchRequest(
        String categoryId,
        String name,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        ProductStatus status,
        Boolean inStock
) {
}
