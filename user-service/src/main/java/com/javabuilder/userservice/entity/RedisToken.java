package com.javabuilder.userservice.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;
import java.util.concurrent.TimeUnit;

@RedisHash("redis_token")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class RedisToken {

    @Id
    private String jwtId;

    @TimeToLive(unit = TimeUnit.SECONDS)
    private Long expiration;
}
