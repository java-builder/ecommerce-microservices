package com.javabuilder.productservice.dto.request;

public record UpdateCategoryRequest(
        String name,
        String description
) {
}
