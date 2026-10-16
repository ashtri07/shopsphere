package com.shopsphere.order;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        String id,
        String customerName,
        List<Item> items,
        BigDecimal total,
        String currency,
        String status,
        Instant createdAt
) {
    public record Item(String productId, String productName, int quantity, BigDecimal unitPrice, BigDecimal lineTotal) {}
}