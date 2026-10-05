package com.javabuilder.event;

import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class OrderCreatedEvent {
    private String orderId;
    private List<OrderItemEvent> items;

    @NoArgsConstructor
    @AllArgsConstructor
    @Getter
    @Setter
    @Builder
    public static class OrderItemEvent {
        private String productId;
        private Integer quantity;
    }
}
