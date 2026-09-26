package com.javabuilder.notificationservice.repository;

import com.javabuilder.notificationservice.entity.Notification;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    Slice<Notification> findByRecipientId(String recipientId, Pageable pageable);

    @Query("{ '_id': { $in: ?0 } }")
    @Update("{ '$set': { 'isRead': true } }")
    long markAsReadByIds(List<String> ids);

    @Query("{ 'recipientId': ?0, 'isRead': false }")
    @Update("{ '$set': { 'isRead': true } }")
    long markAllAsReadByRecipientId(String recipientId);
}
