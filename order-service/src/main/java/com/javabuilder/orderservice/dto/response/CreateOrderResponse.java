package com.javabuilder.orderservice.dto.response;

import com.javabuilder.orderservice.common.OrderStatus;
import com.javabuilder.orderservice.common.PaymentMethod;
import com.javabuilder.orderservice.common.PaymentStatus;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Builder
public record CreateOrderResponse(
        String id,
        String orderCode,
        BigDecimal subtotal,
        BigDecimal shippingCost,
        BigDecimal totalPrice,
        String deliveryNote,
        ShippingAddressResponse shippingAddress,
        OrderStatus orderStatus,
        PaymentMethod paymentMethod,
        PaymentStatus paymentStatus,
        List<OrderDetailResponse> orderDetails,
        Instant createdAt
) {
}
