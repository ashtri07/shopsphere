# Product Service

The Product Service is the first ShopSphere vertical slice. It exposes a small read-only catalog over HTTP. It intentionally stores the sample products in memory so we can learn the API and container/deployment path before adding database infrastructure.

## Requirements

- Java 21
- Maven 3.6.3 or newer

Spring Boot manages compatible library versions through the parent POM. The project uses Spring Boot 4.1.1 and the Spring MVC web starter.

## Run tests

From this directory:

```bash
mvn test
```

## Start the API

```bash
mvn spring-boot:run
```

The service listens on port 8080 by default.

## Try the endpoints

List all products:

```bash
curl -i http://localhost:8080/api/products
```

Fetch one product:

```bash
curl -i http://localhost:8080/api/products/sku-1002
```

Fetch a missing product (expected HTTP 404):

```bash
curl -i http://localhost:8080/api/products/sku-9999
```

## How the code fits together

- `ProductServiceApplication` is the process entry point. `@SpringBootApplication` enables component scanning and Spring Boot auto-configuration.
- `Product` is a Java record used as the JSON response model. `BigDecimal` avoids binary floating-point representation for prices.
- `ProductCatalog` owns the sample data and lookup behavior. `List.of` creates an unmodifiable list.
- `ProductController` maps HTTP GET requests to catalog methods. Constructor injection makes the dependency explicit.
- `ProductCatalogTest` checks that the sample data and lookups behave as expected.

## Current limitations (intentional)

- Products are in memory; changes would be lost on process restart.
- The API is read-only and has no authentication yet.
- There are no database, broker, gateway, Docker, or Kubernetes dependencies in this milestone.
