# polling-kubernetes
study project for kubernetes

## Project structure

```
backend/
  package.json
  README.md
  src/
    index.js
    api/
      index.js
    business/
      index.js
    service/
      index.js
    db/
      index.js
  tests/
    api/
      example.test.js

frontend/
  package.json
  README.md
  src/
    index.js
    api/
      index.js
    components/
      common/
        index.js
      layout/
        index.js
      polls/
        index.js
```

## Getting started

- Backend: `cd backend && npm run start`
- Frontend: `cd frontend && npm run start`


## Purpose

This project is for practicing and learning about automation tools and Kubernetes using a simple polling app split into backend and frontend. The codebase is intentionally minimal to focus on workflows, tooling, and deployment patterns.

## Learning roadmap

- CI/CD automation
  - Add GitHub Actions: lint, test, build; cache dependencies; matrix for Node versions.
  - Build and push Docker images on main branch and tags.
- Containerization
  - Add `Dockerfile` for backend and frontend; multi-stage builds for small images.
  - Add `docker-compose.yml` for local dev wiring (app + DB).
- Kubernetes basics
  - Create manifests: Deployments, Services, ConfigMaps/Secrets, Ingress.
  - Add health probes, resource requests/limits, and rolling update strategy.
- Developer workflows
  - Use Skaffold or Tilt for live-reload inner loop on Kubernetes.
  - Add ESLint/Prettier and Husky pre-commit hooks.
- Observability
  - Expose app metrics; deploy Prometheus + Grafana; add basic dashboards.
  - Centralized logs (e.g., Loki) and structured logging in the app.
- Configuration & secrets
  - Externalize configuration via env vars; mount through ConfigMaps/Secrets.
  - Consider Sealed Secrets or External Secrets for cluster-safe secret management.
- Environments & GitOps
  - Create separate overlays (dev/stage/prod) with Kustomize or Helm.
  - Optional: GitOps with Argo CD or Flux for declarative deployments.
- Security & compliance
  - Image scanning (Trivy/Snyk) in CI; dependency audit.
  - Admission policies (OPA Gatekeeper/Kyverno) for cluster guardrails.
- Testing strategy
  - Unit tests (already started), add integration tests with in-memory or test DB.
  - Contract tests for API; e2e smoke tests in CI against ephemeral environment.
