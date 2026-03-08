package com.javabuilder.mediaservice.service;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    String uploadFile(MultipartFile file);
    void deleteFile(String fileKey);
    String generatePresignedUrl(String fileKey);
}
