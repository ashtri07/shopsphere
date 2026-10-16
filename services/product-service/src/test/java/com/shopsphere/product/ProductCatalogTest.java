package com.shopsphere.product;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ProductCatalogTest {

    private final ProductCatalog catalog = new ProductCatalog();

    @Test
    void returnsThreeSampleProducts() {
        assertEquals(3, catalog.findAll().size());
    }

    @Test
    void findsProductById() {
        var product = catalog.findById("sku-1002");

        assertTrue(product.isPresent());
        assertEquals("Insulated Water Bottle", product.orElseThrow().name());
    }

    @Test
    void returnsEmptyWhenProductDoesNotExist() {
        assertFalse(catalog.findById("sku-9999").isPresent());
    }
}
