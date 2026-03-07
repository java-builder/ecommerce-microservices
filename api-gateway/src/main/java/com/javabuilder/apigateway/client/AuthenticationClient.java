package com.javabuilder.apigateway.client;

import com.javabuilder.apigateway.dto.request.IntrospectRequest;
import com.javabuilder.apigateway.dto.response.ApiResponse;
import com.javabuilder.apigateway.dto.response.IntrospectResponse;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import reactor.core.publisher.Mono;

@HttpExchange(url = "${user-service.url}")
public interface AuthenticationClient {

    @PostExchange("/api/v1/auth/introspect")
    Mono<ApiResponse<IntrospectResponse>> introspect(@RequestBody IntrospectRequest request);
}
