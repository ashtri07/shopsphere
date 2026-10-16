package com.shopsphere.order;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class OrderControllerTest {
    @Autowired MockMvc mvc;

    @Test
    void createsOrderAndCalculatesTotal() throws Exception {
        mvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"customerName":"Asha","items":[{"productId":"sku-1002","quantity":2}]}
                    """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.customerName").value("Asha"))
                .andExpect(jsonPath("$.total").value(1798.00))
                .andExpect(jsonPath("$.status").value("CREATED"));
    }

    @Test
    void rejectsUnknownProduct() throws Exception {
        mvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"customerName":"Asha","items":[{"productId":"sku-9999","quantity":1}]}
                    """))
                .andExpect(status().isBadRequest());
    }
}