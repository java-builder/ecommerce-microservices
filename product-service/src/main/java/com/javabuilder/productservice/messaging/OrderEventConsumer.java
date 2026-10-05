package com.javabuilder.productservice.messaging;

import com.javabuilder.event.OrderCreatedEvent;
import com.javabuilder.productservice.exception.ErrorCode;
import com.javabuilder.productservice.exception.ProductServiceException;
import com.javabuilder.productservice.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.BackOff;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.RetryableTopic;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j(topic = "ORDER-EVENT-CONSUMER")
public class OrderEventConsumer {

    private final ProductRepository productRepository;

    @Transactional(rollbackFor = Exception.class)
    @KafkaListener(topics = "order-created", groupId = "product-service-consumer")
    @RetryableTopic(attempts = "4", backOff = @BackOff(delay = 1000, multiplier = 2), numPartitions = "3")
    public void consumeOrderCreatedEvent(OrderCreatedEvent event) {
        event.getItems().forEach(item -> {
            int result = productRepository.deductStock(item.getProductId(), item.getQuantity());
            if(result == 0) {
                log.error("Failed to deduct stock for order item: {}", item);
                throw new ProductServiceException(ErrorCode.PRODUCT_OUT_OF_STOCK);
            }
        });
        log.info("Stock deducted successfully for orderId: {}", event.getOrderId());
    }

}
