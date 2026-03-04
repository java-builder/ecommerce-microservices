package com.javabuilder.productservice.service;

import com.javabuilder.productservice.dto.request.CreateProductRequest;
import com.javabuilder.productservice.dto.response.CreateProductResponse;
import com.javabuilder.productservice.dto.response.ProductDetailResponse;

import java.util.List;

public interface ProductService {
    CreateProductResponse createProduct(String sellerId, CreateProductRequest request);
    List<ProductDetailResponse> getAllProducts();
    ProductDetailResponse getProductById(String id);
    void deleteProduct(String sellerId, String id);
}
