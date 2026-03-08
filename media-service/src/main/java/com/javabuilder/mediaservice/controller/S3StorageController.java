package com.javabuilder.mediaservice.controller;

import com.javabuilder.mediaservice.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/s3")
public class S3StorageController {

    private final StorageService storageService;
}
