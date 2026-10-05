package com.javabuilder.orderservice.client.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.util.List;

@Builder
public record CheckProductStockRequest(

        @NotEmpty(message = "Items cannot be empty")
        @Valid
        List<ProductStockItem> items
) {

    @Builder
    public record ProductStockItem(

            @NotBlank(message = "Product ID cannot be blank")
            String productId,

            @NotNull(message = "Quantity cannot be null")
            @Min(value = 1, message = "Quantity cannot be less than 1")
            Integer quantity
    ) {}
}
