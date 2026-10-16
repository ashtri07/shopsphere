package com.shopsphere.order;

import java.util.List;

public record OrderRequest(String customerName, List<OrderItemRequest> items) {
    public record OrderItemRequest(String productId, int quantity) {}
}