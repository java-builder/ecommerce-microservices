package com.javabuilder.userservice.service.impl;

import com.javabuilder.userservice.entity.Role;
import com.javabuilder.userservice.repository.RoleRepository;
import com.javabuilder.userservice.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public Role createRole(String roleName) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(
                        Role.builder()
                                .name(roleName)
                                .build())
                );
    }
}
