# ShopSphere

ShopSphere is a hands-on DevOps learning project: a small e-commerce application built from first principles, then packaged, delivered, and operated on Kubernetes.

The goal is not to hide complexity behind a large sample application. Each service, container image, Kubernetes resource, Helm template, and CI/CD workflow will be introduced in small steps and documented so that the author can explain what each part does and why it exists.

## Current application milestone

The first runnable full-stack slice is now in the repository:

- **Product Service:** Java 21 + Spring Boot, with a small in-memory catalog.
- **Order Service:** Java 21 + Spring Boot, with validation and in-memory orders.
- **Frontend:** React + Vite storefront that calls both APIs.
- **Tests and CI:** Maven tests for the backend services; Product Service GitHub Actions workflow.

This is a learning/demo application, not a production commerce system. It has no authentication, payment handling, database, durable order storage, or real inventory reservation. Orders are lost when the Order Service restarts. The Order Service temporarily has its own copy of product IDs/prices so it can run independently; service-to-service integration is a later exercise.

## Run the full stack locally

Requirements: Java 21, Maven, Node.js 22 (or a supported LTS version), and npm.

Open three terminals from the repository root.

**Terminal 1 — Product Service**

```bash
cd services/product-service
mvn test
mvn spring-boot:run
```

API base URL: `http://localhost:8080`

**Terminal 2 — Order Service**

```bash
cd services/order-service
mvn test
SERVER_PORT=8081 mvn spring-boot:run
```

API base URL: `http://localhost:8081`

On Windows PowerShell, set the port with `$env:SERVER_PORT="8081"; mvn spring-boot:run`.

**Terminal 3 — Frontend**

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

## Try the APIs

List products:

```bash
curl -i http://localhost:8080/api/products
```

Create a demo order:

```bash
curl -i -X POST http://localhost:8081/api/orders \
  -H 'Content-Type: application/json' \
  -d '{"customerName":"Asha","items":[{"productId":"sku-1002","quantity":2}]}'
```

List orders created by the running Order Service:

```bash
curl -i http://localhost:8081/api/orders
```

## Learning goals

- Understand HTTP APIs, Java/Spring Boot, React, tests, and local configuration.
- Package applications in Docker images and publish them to Amazon ECR.
- Deploy to EKS with hand-written Kubernetes manifests, then package them as a Helm chart.
- Build CI pipelines with GitHub Actions and use GitHub OIDC for short-lived AWS credentials (no long-lived AWS access keys in repository secrets).
- Use Argo CD to practice GitOps reconciliation and safe rollout/rollback workflows.
- Reproduce and diagnose common failures: bad image tags, crash loops, broken probes, bad configuration, service discovery issues, and failing CI.
- Keep infrastructure lean and make cost cleanup part of the project.

## Planned architecture

```text
Browser
  |
  v
React + Vite frontend
  |-------------------------------|
  v                               v
Product Service               Order Service
(read catalog)                (create/list orders)
```

As the basics are understood, we'll introduce an API gateway and notification service as separate milestones rather than creating empty placeholder services now.

## Technology choices

- Backend: Java and Spring Boot, built with Maven
- Frontend: React and Vite, built with npm
- Containerization: Docker
- Registry and runtime: Amazon ECR and Amazon EKS in AWS Mumbai (`ap-south-1`)
- Deployment: Kubernetes manifests first, then a Helm chart
- CI: GitHub Actions
- AWS federation: GitHub Actions OIDC with narrowly scoped IAM permissions
- GitOps: Argo CD

## Next milestones

1. Add container build files and test images locally.
2. Add health endpoints, resource requests/limits, and hand-written Kubernetes manifests.
3. Publish images to ECR and deploy to the existing EKS cluster.
4. Package the working manifests as a Helm chart.
5. Add secure image-build/publish workflows using GitHub OIDC.
6. Introduce Argo CD after the manual deployment flow is understood.
7. Practice failure drills and document troubleshooting/cleanup.

## Cost warning

Amazon EKS charges for the cluster control plane while the cluster exists, even when the application has no traffic. EC2 instances, EBS volumes, public IPv4 addresses, load balancers, and data transfer can add charges. Avoid leaving the lab running when it is not in use, and review the AWS billing dashboard before enabling additional resources.
