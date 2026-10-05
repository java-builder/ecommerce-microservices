package com.javabuilder.orderservice.dto.response;

import lombok.Builder;

@Builder
public record ShippingAddressResponse(
        String recipientName,
        String phoneNumber,
        String province,
        String district,
        String ward,
        String detailAddress
) {}
