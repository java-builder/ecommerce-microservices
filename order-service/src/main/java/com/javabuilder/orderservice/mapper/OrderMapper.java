package com.javabuilder.orderservice.mapper;

import com.javabuilder.orderservice.dto.request.ShippingAddressRequest;
import com.javabuilder.orderservice.dto.response.CreateOrderResponse;
import com.javabuilder.orderservice.dto.response.OrderDetailResponse;
import com.javabuilder.orderservice.dto.response.ShippingAddressResponse;
import com.javabuilder.orderservice.entity.Order;
import com.javabuilder.orderservice.entity.OrderDetail;
import com.javabuilder.orderservice.entity.ShippingAddress;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrderMapper {

    public ShippingAddress toShippingAddress(ShippingAddressRequest request) {
        return ShippingAddress.builder()
                .recipientName(request.recipientName())
                .phoneNumber(request.phoneNumber())
                .province(request.province())
                .district(request.district())
                .ward(request.ward())
                .detailAddress(request.detailAddress())
                .build();
    }

    public CreateOrderResponse toCreateOrderResponse(Order order) {
        return CreateOrderResponse.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .subtotal(order.getSubtotal())
                .shippingCost(order.getShippingCost())
                .totalPrice(order.getTotalPrice())
                .deliveryNote(order.getDeliveryNote())
                .shippingAddress(toShippingAddressResponse(order.getShippingAddress()))
                .orderStatus(order.getOrderStatus())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .orderDetails(toOrderDetailsResponse(order.getOrderDetails()))
                .createdAt(order.getCreatedAt())
                .build();
    }

    private ShippingAddressResponse toShippingAddressResponse(ShippingAddress shippingAddress) {
        return ShippingAddressResponse.builder()
                .recipientName(shippingAddress.getRecipientName())
                .phoneNumber(shippingAddress.getPhoneNumber())
                .province(shippingAddress.getProvince())
                .district(shippingAddress.getDistrict())
                .ward(shippingAddress.getWard())
                .detailAddress(shippingAddress.getDetailAddress())
                .build();
    }

    private List<OrderDetailResponse> toOrderDetailsResponse(List<OrderDetail> orderDetails) {
        return orderDetails.stream()
                .map(orderDetail -> OrderDetailResponse.builder()
                        .id(orderDetail.getId())
                        .productId(orderDetail.getProductId())
                        .productName(orderDetail.getProductName())
                        .productThumbnail(orderDetail.getProductThumbnail())
                        .price(orderDetail.getPrice())
                        .quantity(orderDetail.getQuantity())
                        .build())
                .toList();
    }
}
