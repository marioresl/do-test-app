## Setup

**App-Spec Beispiel (minimales Setup):**
```yaml
name: react-test-app
region: fra
static_sites:
  - build_command: npm run build
    environment_slug: node-js
    github:
      branch: main
      repo: marioresl/do-test-app
    name: do-test-app
    source_dir: /
    auto_deploy: true
```

## Deployment
```bash
doctl apps update <app-id> --spec .do/app.yaml
```

- Die App zieht sich immer den Stand vom GitHub-Repo.
- Lokale Dateien werden nicht verwendet.
- Änderungen am Code müssen zuerst gepusht werden, bevor das Deployment etwas ändert.