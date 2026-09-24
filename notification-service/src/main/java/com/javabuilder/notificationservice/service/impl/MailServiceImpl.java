package com.javabuilder.notificationservice.service.impl;

import com.javabuilder.notificationservice.service.MailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "MAIL-SERVICE")
public class MailServiceImpl implements MailService {

    @Value("${spring.mail.username}")
    private String from;

    private final JavaMailSender javaMailSender;
    private final TemplateEngine emailTemplateEngine;

    @Override
    public void sendEmail(String to, String subject, String templateName, Map<String, Object> params) {
        MimeMessage message = javaMailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, StandardCharsets.UTF_8.name());
            helper.setFrom(from, "NovaCommerce");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setSentDate(new Date());

            Context context = new Context();
            context.setVariables(params);

            String htmlContent = emailTemplateEngine.process(templateName, context);
            helper.setText(htmlContent, true);

            javaMailSender.send(message);
            log.info("Send email to email: {}", to);
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Send email error to email: {} {}", to, e.getMessage());
        }
    }
}
