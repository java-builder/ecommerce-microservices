package com.javabuilder.mediaservice.service.impl;

import com.javabuilder.mediaservice.service.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "S3-STORAGE")
public class S3StorageService implements StorageService {

    @Override
    public String uploadFile(MultipartFile file) {
        return "";
    }

    @Override
    public void deleteFile(String fileKey) {

    }

    @Override
    public String generatePresignedUrl(String fileKey) {
        return "";
    }

}
