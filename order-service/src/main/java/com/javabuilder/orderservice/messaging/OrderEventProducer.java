package com.javabuilder.orderservice.messaging;

import com.javabuilder.event.OrderCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j(topic = "ORDER-EVENT-PRODUCER")
public class OrderEventProducer {

    private static final String ORDER_CREATED_TOPIC = "order-created";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void send(OrderCreatedEvent event) {
        kafkaTemplate.send(ORDER_CREATED_TOPIC, event.getOrderId(), event)
                .whenComplete((_, ex) -> {
                    if (ex != null) {
                        log.error("Failed to send OrderCreatedEvent for orderId: {}", event.getOrderId(), ex);
                    } else {
                        log.info("OrderCreatedEvent sent successfully for orderId: {}", event.getOrderId());
                    }
                });
    }
}
