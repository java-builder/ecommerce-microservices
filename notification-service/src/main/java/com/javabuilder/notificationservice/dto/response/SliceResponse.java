package com.javabuilder.notificationservice.dto.response;

import lombok.*;

import java.util.Collections;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SliceResponse<T>{
    private int currentPage;
    private int pageSize;
    private boolean hasNext;
    private boolean isLast;

    @Builder.Default
    private List<T> content = Collections.emptyList();
}
