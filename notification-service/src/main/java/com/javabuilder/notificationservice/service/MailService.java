package com.javabuilder.notificationservice.service;

import java.util.Map;

public interface MailService {

    void sendEmail(String to, String subject, String templateName, Map<String, Object> params);
}
