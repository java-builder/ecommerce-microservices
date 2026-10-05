package com.javabuilder.productservice.service;

import com.javabuilder.productservice.dto.request.CheckProductStockRequest;
import com.javabuilder.productservice.dto.request.CreateProductRequest;
import com.javabuilder.productservice.dto.request.SearchRequest;
import com.javabuilder.productservice.dto.response.CreateProductResponse;
import com.javabuilder.productservice.dto.response.PageResponse;
import com.javabuilder.productservice.dto.response.ProductDetailResponse;
import com.javabuilder.productservice.dto.response.ProductStockValidationResponse;

import java.util.List;

public interface ProductService {
    CreateProductResponse createProduct(String sellerId, CreateProductRequest request);
    PageResponse<ProductDetailResponse> getAllProducts(int page, int size, SearchRequest request);
    ProductDetailResponse getProductById(String id);
    void deleteProduct(String id);

    List<ProductStockValidationResponse> validateProductStock(CheckProductStockRequest request);
}
