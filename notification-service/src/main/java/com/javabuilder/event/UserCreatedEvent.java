package com.javabuilder.event;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UserCreatedEvent {
    private String userId;
    private String email;
}
