package com.javabuilder.apigateway.configuration;

import com.javabuilder.apigateway.client.AuthenticationClient;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.service.registry.HttpServiceGroup;
import org.springframework.web.service.registry.ImportHttpServices;

@Configuration
@ImportHttpServices(types = AuthenticationClient.class, clientType = HttpServiceGroup.ClientType.WEB_CLIENT)
public class HttpServiceClientConfiguration {
}
