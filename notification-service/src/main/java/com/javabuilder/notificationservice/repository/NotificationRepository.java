package com.javabuilder.notificationservice.repository;

import com.javabuilder.notificationservice.entity.Notification;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    Slice<Notification> findByRecipientId(String recipientId, Pageable pageable);
}
