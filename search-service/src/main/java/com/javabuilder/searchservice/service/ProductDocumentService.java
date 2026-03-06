package com.javabuilder.searchservice.service;

import com.javabuilder.searchservice.document.ProductDocument;

public interface ProductDocumentService {
    void saveProductDocument(ProductDocument document);
    void deleteProductDocument(String id);
}
