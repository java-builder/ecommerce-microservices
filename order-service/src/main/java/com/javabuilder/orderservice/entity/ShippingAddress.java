package com.javabuilder.orderservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingAddress {

    @Column(name = "shipping_recipient_name", nullable = false)
    private String recipientName;

    @Column(name = "shipping_phone", nullable = false)
    private String phoneNumber;

    @Column(name = "shipping_province", nullable = false)
    private String province;

    @Column(name = "shipping_district", nullable = false)
    private String district;

    @Column(name = "shipping_ward", nullable = false)
    private String ward;

    @Column(name = "shipping_detail_address")
    private String detailAddress;
}

