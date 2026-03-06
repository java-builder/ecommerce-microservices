package com.javabuilder.searchservice.dto.response;

import lombok.Builder;

@Builder
public record CategoryCount(
        String name,
        long count
) {
}
