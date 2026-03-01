package com.javabuilder.userservice.service.impl;

import com.javabuilder.userservice.entity.RedisToken;
import com.javabuilder.userservice.repository.RedisTokenRepository;
import com.javabuilder.userservice.service.RedisTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RedisTokenServiceImpl implements RedisTokenService {

    private final RedisTokenRepository redisTokenRepository;

    @Override
    public void saveToken(RedisToken token) {
        redisTokenRepository.save(token);
    }

    @Override
    public void deleteTokenByJwtId(String jwtId) {
        redisTokenRepository.findById(jwtId)
                .ifPresent(redisTokenRepository::delete);
    }

    @Override
    public boolean existsByJwtId(String jwtId) {
        return redisTokenRepository.existsById(jwtId);
    }
}
