package com.javabuilder.notificationservice.messaging.consumer;

import com.javabuilder.event.UserCreatedEvent;
import com.javabuilder.notificationservice.service.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j(topic = "USER-EVENT-CONSUMER")
public class UserEventConsumer {

    private final MailService mailService;

    @KafkaListener(topics = "user-created", groupId = "notification-service-consumer")
    public void handleUserCreated(UserCreatedEvent event) {
        mailService.sendEmail(
                event.getEmail(),
                "Chào mừng bạn đến với JavaBuilder",
                "welcome",
                Map.of("email", event.getEmail())
        );
    }
}
