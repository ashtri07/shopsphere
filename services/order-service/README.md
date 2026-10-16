# Order Service

A small in-memory order API. It validates a customer name, product IDs, and quantities; calculates totals using `BigDecimal`; and returns a created order.

## Run

Requires Java 21 and Maven.

```bash
mvn test
mvn spring-boot:run
```

The service listens on port 8080 by default. To run Product Service and Order Service simultaneously on one machine, start this service with `SERVER_PORT=8081 mvn spring-boot:run`.

## API

Create an order:

```bash
curl -i -X POST http://localhost:8081/api/orders \
  -H 'Content-Type: application/json' \
  -d '{"customerName":"Asha","items":[{"productId":"sku-1002","quantity":2}]}'
```

List orders created since this process started:

```bash
curl -i http://localhost:8081/api/orders
```

## Learning note

Orders are held in memory, so they disappear on restart and are not shared between replicas. The product list is temporarily duplicated here so the service can run independently; a later milestone will introduce a deliberate service-to-service contract.