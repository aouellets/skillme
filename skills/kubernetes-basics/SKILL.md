---
name: Kubernetes Basics
description: Write production-ready Kubernetes manifests.
---

# Kubernetes Basics

Write manifests that are safe, observable, and self-healing.

## Core objects

- Deployment: manages replica Pods and rolling updates.
- Service: stable network endpoint for a set of Pods.
- ConfigMap/Secret: configuration and credentials, injected as env or files.
- Ingress: HTTP routing into the cluster.

## A solid Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata: { name: api }
spec:
  replicas: 3
  selector: { matchLabels: { app: api } }
  template:
    metadata: { labels: { app: api } }
    spec:
      containers:
        - name: api
          image: registry/api:1.4.2
          resources:
            requests: { cpu: "100m", memory: "128Mi" }
            limits:   { cpu: "500m", memory: "256Mi" }
          readinessProbe:
            httpGet: { path: /healthz, port: 8080 }
            initialDelaySeconds: 5
          livenessProbe:
            httpGet: { path: /healthz, port: 8080 }
```

## Health checks

- Readiness: gate traffic until the pod can serve. Without it, rollouts route to cold pods.
- Liveness: restart a hung pod. Keep it cheap and dependency-free.
- Startup probe for slow-booting apps so liveness doesn't kill them early.

## Rules

- Always set resource requests and limits — without requests the scheduler can't place pods well; without limits one pod can starve the node.
- Pin image tags by digest or immutable version; never `:latest` in production.
- Set `replicas >= 2` and a PodDisruptionBudget for availability during node drains.
- Store secrets in a Secret (or external secrets manager), never in the image or ConfigMap.

## Rollouts

- Use `RollingUpdate` with `maxUnavailable` and `maxSurge` tuned for capacity.
- Keep deployments idempotent and declarative; apply via GitOps.

## Edge cases

- Graceful shutdown: handle SIGTERM and respect `terminationGracePeriodSeconds`; drain connections.
- Zero-downtime: readiness probe + preStop sleep so the endpoint is removed before the process exits.
- Config changes: ConfigMap updates don't restart pods — roll the deployment or use a checksum annotation.
