# ShopSphere

ShopSphere is a hands-on DevOps learning project: a small e-commerce application built from first principles, then packaged, delivered, and operated on Kubernetes.

The goal is not to hide complexity behind a large sample application. Each service, container image, Kubernetes resource, Helm template, and CI/CD workflow will be introduced in small steps and documented so that the author can explain what each part does and why it exists.

## Learning goals

- Build and test a small Java/Spring Boot backend and React/Vite frontend.
- Understand service boundaries, HTTP APIs, configuration, and failure handling.
- Package applications in Docker images and publish them to Amazon ECR.
- Deploy to EKS with hand-written Kubernetes manifests, then package those manifests as a Helm chart.
- Build CI pipelines with GitHub Actions and use GitHub OIDC to obtain short-lived AWS credentials (no long-lived AWS access keys in repository secrets).
- Use Argo CD to practice GitOps reconciliation and safe rollout/rollback workflows.
- Reproduce and diagnose common failures: bad image tags, crash loops, broken probes, bad configuration, service discovery issues, and failing CI.
- Keep the infrastructure lean and make cost cleanup part of the project.

## Planned architecture

The architecture will grow incrementally. The first milestone will be a single, testable vertical slice—not all services at once.

```text
Browser
  |
  v
React + Vite frontend
  |
  v
Spring Boot API gateway
  |---------------------|
  v                     v
Product service     Order service
                         |
                         v
                 Notification service
```

Initial service responsibilities:

| Component | Responsibility | Initial data strategy |
|---|---|---|
| Frontend | Product list and simple order flow | Calls backend APIs |
| API gateway | Single backend entry point and routing | Stateless |
| Product service | List and retrieve products | In-memory sample catalog |
| Order service | Validate and create an order | In-memory orders |
| Notification service | Demonstrate a downstream action | Simple HTTP call/logging first |

The first version intentionally avoids a managed database, message broker, NAT Gateway, and observability stack. Those can be considered later as separate learning exercises with an explicit cost/complexity decision.

## Technology choices

- **Backend:** Java and Spring Boot, built with Maven
- **Frontend:** React and Vite, built with npm
- **Containerization:** Docker
- **Registry and runtime:** Amazon ECR and Amazon EKS in AWS Mumbai (`ap-south-1`)
- **Deployment:** Kubernetes manifests first, then a Helm chart
- **CI:** GitHub Actions
- **AWS federation:** GitHub Actions OIDC with narrowly scoped IAM permissions
- **GitOps:** Argo CD

Versions will be pinned or recorded as the project is implemented. The application and deployment files will be authored in this repository rather than copied wholesale from a complex reference application.

## Repository layout (planned)

```text
.
├── frontend/
├── services/
│   ├── api-gateway/
│   ├── product-service/
│   ├── order-service/
│   └── notification-service/
├── deploy/
│   ├── kubernetes/
│   ├── helm/
│   └── argocd/
├── .github/
│   └── workflows/
└── docs/
```

Directories will be added when they contain useful, working files; the repository will not be filled with placeholder manifests for components that do not exist yet.

## Delivery roadmap

1. **Foundation:** document the architecture, repository conventions, and learning sequence.
2. **First vertical slice:** implement the product API and a small frontend; add tests and local run instructions.
3. **Order flow:** add order creation and the notification demonstration, with clear API contracts.
4. **Containers:** write and understand a Dockerfile per deployable component; build and test images locally.
5. **Kubernetes:** deploy with hand-written manifests, Services, configuration, resource requests/limits, and health probes.
6. **ECR and EKS:** publish images and deploy to the existing learning cluster.
7. **Helm:** refactor the working manifests into a small chart and learn values/templates.
8. **CI with OIDC:** test and build on pull requests; publish images securely from approved branches.
9. **Argo CD:** introduce GitOps reconciliation after the manual deployment flow is understood.
10. **Failure drills:** deliberately introduce common deployment and pipeline faults, diagnose them, and document recovery.
11. **Cost and cleanup:** record what incurs charges and provide repeatable teardown/recovery instructions.

Milestones will be implemented one at a time. A roadmap item is not considered complete until its files, run commands, and verification steps are documented.

## Working principles

- Prefer the smallest working change that teaches one concept.
- Explain why every manifest field, dependency, and workflow permission exists.
- Keep secrets out of Git. Use workload identity/OIDC rather than static AWS credentials.
- Add resource requests and limits; avoid unnecessary replicas and always-on managed services in a budget-constrained lab.
- Include a verification step for each operational change.
- Document cleanup before creating any resource that can incur recurring charges.
- Never commit generated credentials, kubeconfig files, local environment files, or build outputs.

## Cost warning

Amazon EKS charges for the cluster control plane while the cluster exists, even when the application has no traffic. EC2 instances, EBS volumes, public IPv4 addresses, load balancers, and data transfer can add charges. Avoid leaving the lab running when it is not in use, and review the current AWS pricing and billing dashboard before enabling additional resources.

## Status

**Current milestone:** repository foundation. Application code, containers, manifests, Helm, CI, and GitOps will be added incrementally and verified as each milestone is reached.
