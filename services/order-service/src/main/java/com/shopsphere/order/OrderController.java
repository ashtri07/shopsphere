package com.shopsphere.order;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/orders")
public class OrderController {
    private static final List<CatalogItem> CATALOG = List.of(
            new CatalogItem("sku-1001", "Everyday Backpack", new BigDecimal("2499.00")),
            new CatalogItem("sku-1002", "Insulated Water Bottle", new BigDecimal("899.00")),
            new CatalogItem("sku-1003", "Desk Lamp", new BigDecimal("1599.00"))
    );

    private final List<OrderResponse> orders = new CopyOnWriteArrayList<>();

    @GetMapping
    public List<OrderResponse> listOrders() {
        return List.copyOf(orders);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(@RequestBody OrderRequest request) {
        if (request.customerName() == null || request.customerName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "customerName is required");
        }
        if (request.items() == null || request.items().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one order item is required");
        }

        List<OrderResponse.Item> items = request.items().stream().map(item -> {
            if (item.quantity() < 1 || item.quantity() > 100) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "quantity must be between 1 and 100");
            }
            CatalogItem product = CATALOG.stream()
                    .filter(candidate -> candidate.id().equals(item.productId()))
                    .findFirst()
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown product: " + item.productId()));
            BigDecimal lineTotal = product.price().multiply(BigDecimal.valueOf(item.quantity()));
            return new OrderResponse.Item(product.id(), product.name(), item.quantity(), product.price(), lineTotal);
        }).toList();

        BigDecimal total = items.stream().map(OrderResponse.Item::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        OrderResponse order = new OrderResponse(
                UUID.randomUUID().toString(), request.customerName().trim(), items, total,
                "INR", "CREATED", Instant.now()
        );
        orders.add(order);
        return order;
    }

    private record CatalogItem(String id, String name, BigDecimal price) {}
}