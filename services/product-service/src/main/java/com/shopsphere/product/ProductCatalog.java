package com.shopsphere.product;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Component
public class ProductCatalog {

    private final List<Product> products = List.of(
            new Product(
                    "sku-1001",
                    "Everyday Backpack",
                    "A lightweight backpack for work and travel.",
                    new BigDecimal("2499.00"),
                    "INR"
            ),
            new Product(
                    "sku-1002",
                    "Insulated Water Bottle",
                    "A reusable stainless-steel bottle.",
                    new BigDecimal("899.00"),
                    "INR"
            ),
            new Product(
                    "sku-1003",
                    "Desk Lamp",
                    "An adjustable LED lamp for a home office.",
                    new BigDecimal("1599.00"),
                    "INR"
            )
    );

    public List<Product> findAll() {
        return products;
    }

    public Optional<Product> findById(String id) {
        return products.stream()
                .filter(product -> product.id().equals(id))
                .findFirst();
    }
}
