package com.javabuilder.orderservice.service.impl;

import com.javabuilder.orderservice.client.ProductClient;
import com.javabuilder.orderservice.client.dto.CheckProductStockRequest;
import com.javabuilder.orderservice.client.dto.ProductStockValidationResponse;
import com.javabuilder.orderservice.common.OrderStatus;
import com.javabuilder.orderservice.common.PaymentStatus;
import com.javabuilder.orderservice.dto.request.CreateOrderRequest;
import com.javabuilder.orderservice.dto.request.OrderDetailRequest;
import com.javabuilder.orderservice.dto.response.CreateOrderResponse;
import com.javabuilder.orderservice.entity.Order;
import com.javabuilder.orderservice.entity.OrderDetail;
import com.javabuilder.orderservice.entity.ShippingAddress;
import com.javabuilder.orderservice.exception.ErrorCode;
import com.javabuilder.orderservice.exception.OrderServiceException;
import com.javabuilder.orderservice.mapper.OrderMapper;
import com.javabuilder.orderservice.repository.OrderRepository;
import com.javabuilder.orderservice.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "ORDER-SERVICE")
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductClient productClient;
    private final OrderMapper orderMapper;

    @Transactional(rollbackFor = Exception.class)
    @Override
    public CreateOrderResponse createOrder(String userId, CreateOrderRequest request) {
        var items = request.orderDetails().stream()
                .map(orderDetailRequest -> CheckProductStockRequest.ProductStockItem.builder()
                        .productId(orderDetailRequest.productId())
                        .quantity(orderDetailRequest.quantity())
                        .build())
                .toList();

        var stockRequest = CheckProductStockRequest.builder()
                .items(items)
                .build();

        var validateProductStock = productClient.validateProductStock(stockRequest);
        if(validateProductStock == null || validateProductStock.code() != 200 || validateProductStock.data() == null) {
            throw new OrderServiceException(ErrorCode.EXTERNAL_SERVICE_ERROR);
        }

        List<ProductStockValidationResponse> productResponses = validateProductStock.data();
        productResponses.forEach(productResponse -> {
            if(!productResponse.isAvailable()) {
                log.warn("Product out of stock: {}", productResponse.productId());
                throw new OrderServiceException(ErrorCode.PRODUCT_OUT_OF_STOCK);
            }
        });

        Map<String, ProductStockValidationResponse> productMap = productResponses.stream()
                .collect(Collectors.toMap(ProductStockValidationResponse::productId, Function.identity()));

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderDetail> orderDetails = new ArrayList<>();
        for (OrderDetailRequest itemRequest : request.orderDetails()) {
            ProductStockValidationResponse product = productMap.get(itemRequest.productId());
            BigDecimal itemTotal = product.price().multiply(BigDecimal.valueOf(itemRequest.quantity()));
            subtotal = subtotal.add(itemTotal);
            OrderDetail detail = OrderDetail.builder()
                    .productId(product.productId())
                    .productName(product.productName())
                    .productThumbnail(product.productThumbnail())
                    .price(product.price())
                    .quantity(itemRequest.quantity())
                    .build();
            orderDetails.add(detail);
        }

        BigDecimal shippingCost = BigDecimal.valueOf(30000);
        BigDecimal totalPrice = subtotal.add(shippingCost);

        String orderCode = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        ShippingAddress shippingAddress = orderMapper.toShippingAddress(request.shippingAddress());

        Order order = Order.builder()
                .userId(userId)
                .orderCode(orderCode)
                .subtotal(subtotal)
                .shippingCost(shippingCost)
                .totalPrice(totalPrice)
                .deliveryNote(request.deliveryNote())
                .shippingAddress(shippingAddress)
                .orderStatus(OrderStatus.PENDING)
                .paymentMethod(request.paymentMethod())
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        orderDetails.forEach(order::addOrderDetail);

        orderRepository.save(order);
        log.info("Order created successfully: {}", order.getId());

        return orderMapper.toCreateOrderResponse(order);
    }

}
