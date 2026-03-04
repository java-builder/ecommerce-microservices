package com.javabuilder.productservice.service;

import com.javabuilder.productservice.dto.request.CreateCategoryRequest;
import com.javabuilder.productservice.dto.request.UpdateCategoryRequest;
import com.javabuilder.productservice.dto.response.CategoryDetailResponse;
import com.javabuilder.productservice.dto.response.CreateCategoryResponse;
import com.javabuilder.productservice.dto.response.UpdateCategoryResponse;
import java.util.List;

public interface CategoryService {
    CreateCategoryResponse createCategory(CreateCategoryRequest request);
    List<CategoryDetailResponse> getAllCategories();
    UpdateCategoryResponse updateCategory(String id, UpdateCategoryRequest request);
    void deleteCategory(String id);
}
