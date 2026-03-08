package com.javabuilder.mediaservice.service.impl;

import com.javabuilder.mediaservice.dto.response.FileResponse;
import com.javabuilder.mediaservice.service.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import java.io.IOException;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "S3-STORAGE")
public class S3StorageService implements StorageService {

    @Value( "${aws.s3.bucket}")
    private String BUCKET_NAME;

    @Value( "${aws.region.static}")
    private String REGION;

    private final S3Client s3Client;

    @Override
    public FileResponse uploadFile(MultipartFile file) throws IOException {
        String key = file.getOriginalFilename() + "-" + System.currentTimeMillis();

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(BUCKET_NAME)
                .key(key)
                .build();

        RequestBody requestBody = RequestBody.fromInputStream(file.getInputStream(), file.getSize());

        s3Client.putObject(putObjectRequest, requestBody);

        String url = String.format("https://%s.s3.%s.amazonaws.com/%s", BUCKET_NAME, REGION, key);

        return FileResponse.builder()
                .key(key)
                .fileName(file.getOriginalFilename())
                .contentType(file.getContentType())
                .size(file.getSize())
                .url(url)
                .build();
    }

    @Override
    public void deleteFile(String fileKey) {

    }

    @Override
    public String generatePresignedUrl(String fileKey) {
        return "";
    }

}
