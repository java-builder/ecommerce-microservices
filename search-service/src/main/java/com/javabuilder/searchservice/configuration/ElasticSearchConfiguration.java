package com.javabuilder.searchservice.configuration;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.json.JsonMapper;

@Configuration
@RequiredArgsConstructor
public class ElasticSearchConfiguration {

    private String serverUrl;
    private String apiKey;

    private final JsonMapper jsonMapper;

    @Bean
    ElasticsearchClient elasticsearchClient() {
        return null;
    }
}
