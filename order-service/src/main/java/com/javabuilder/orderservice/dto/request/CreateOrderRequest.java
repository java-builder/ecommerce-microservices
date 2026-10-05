package com.javabuilder.orderservice.dto.request;

import com.javabuilder.orderservice.common.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record CreateOrderRequest(

        @NotEmpty(message = "Order items must not be empty")
        @Valid
        List<OrderDetailRequest> orderDetails,

        @NotNull(message = "Shipping address is required")
        @Valid
        ShippingAddressRequest shippingAddress,

        @NotNull(message = "Payment method is required")
        PaymentMethod paymentMethod,

        @Size(max = 200, message = "Delivery note must not exceed 200 characters")
        String deliveryNote
) { }
