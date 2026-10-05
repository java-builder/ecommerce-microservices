package com.javabuilder.orderservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ShippingAddressRequest(

        @NotBlank(message = "Recipient name is required")
        String recipientName,

        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^(0|\\+84)[35789]\\d{8}$", message = "Phone number is invalid")
        String phoneNumber,

        @NotBlank(message = "Province is required")
        String province,

        @NotBlank(message = "District is required")
        String district,

        @NotBlank(message = "Ward is required")
        String ward,

        @NotBlank(message = "Detail address is required")
        String detailAddress

) {}
