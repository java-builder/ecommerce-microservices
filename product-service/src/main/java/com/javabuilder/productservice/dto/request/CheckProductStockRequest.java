package com.javabuilder.productservice.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CheckProductStockRequest(

        @NotEmpty(message = "Items cannot be empty")
        @Valid
        List<ProductStockItem> items
) {

    public record ProductStockItem(

            @NotBlank(message = "Product ID cannot be blank")
            String productId,

            @NotNull(message = "Quantity cannot be null")
            @Min(value = 1, message = "Quantity cannot be less than 1")
            Integer quantity
    ) {}
}
