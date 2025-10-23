# DigitalOcean App Platform + Functions Integration

Demo-App die zeigt, wie eine DO App Platform App eine DO Function aufruft.

## Setup

### 1. Function deployen

Zuerst die Function aus dem `do-test-functions` Projekt deployen:

```bash
cd ../do-test-functions
doctl serverless deploy .
```

Function URL abrufen:
```bash
doctl serverless functions get sample/hello --url
```

Die URL sieht so aus:
```
https://faas-fra1-123456789.doserverless.co/api/v1/web/sample/hello
```

### 2. Environment Variable setzen

**Lokal (für Development):**
```bash
# .env Datei erstellen
cp .env.example .env

# VITE_FUNCTION_URL mit deiner Function URL setzen
```

**In App Platform (für Production):**

Die Function URL muss als Environment Variable in der App Platform gesetzt werden:

**Option 1: Via UI (DigitalOcean Dashboard)**
1. App Platform > Deine App > Settings
2. App-Level Environment Variables
3. Variable hinzufügen:
   - Key: `VITE_FUNCTION_URL`
   - Value: `https://faas-fra1-xxx.doserverless.co/api/v1/web/sample/hello`
4. Save & Redeploy

**Option 2: Via app.yaml**

```yaml
static_sites:
  - name: do-test-app
    # ... andere configs ...
    envs:
      - key: VITE_FUNCTION_URL
        value: https://faas-fra1-afec6ce7.doserverless.co/api/v1/web/fn-4917e19c-d940-4672-917a-3dcb98bfc84c/sample/hello
        scope: BUILD_TIME
```

**Wichtig:** Bei Vite müssen Build-Zeit Variablen mit `VITE_` prefixed sein und `scope: BUILD_TIME` haben!

App Spec updaten:
```bash
doctl apps update <app-id> --spec .do/app.yaml
```

### 3. App deployen

**Via Git Push (Auto-Deploy):**
```bash
git add .
git commit -m "Add Function integration"
git push
```

Die App deployed automatisch bei Push auf den main Branch.

**Manuell via doctl:**
```bash
doctl apps create-deployment <app-id>
```

## App-Spec Erklärung

```yaml
name: react-test-app           # App Name
region: fra                    # Frankfurt Region
static_sites:                  # Für statische Sites (React, Vue, etc.)
  - build_command: npm run build      # Build Command
    environment_slug: node-js          # Node.js Environment
    github:
      branch: main                     # Git Branch
      repo: marioresl/do-test-app     # GitHub Repo
      deploy_on_push: true             # Auto-Deploy bei Push
    name: do-test-app                  # Component Name
    source_dir: /                      # Root Directory
    envs:                              # Environment Variables
      - key: VITE_FUNCTION_URL         # Variable Name
        value: https://...             # Function URL
        scope: BUILD_TIME              # Für Vite Build-Zeit Variablen!
```

### Environment Variable Scopes

- **BUILD_TIME**: Während `npm run build` verfügbar (für Vite `VITE_*` Variablen)
- **RUN_TIME**: Zur Laufzeit verfügbar (bei statischen Sites meist nicht nutzbar)

**Für Vite/React:** Immer `BUILD_TIME` verwenden!

### URL Verwaltung

**Problem:** Die Function URL ändert sich nicht, aber du willst flexibel sein.

**Lösung 1: Environment Variables (recommended)**
- Lokal: `.env` Datei
- Production: App Platform Environment Variables
- Vorteil: Keine Code-Änderungen nötig

**Lösung 2: Custom Domain**
- Setze eine Custom Domain für deine Functions
- URL bleibt stabil: `https://api.deine-domain.com/hello`

### GitHub Integration

```yaml
github:
  branch: main
  repo: marioresl/do-test-app
  deploy_on_push: true
```

**Wichtig:**
- Die App zieht sich **immer** den Stand vom GitHub-Repo
- Lokale Dateien werden **nicht** verwendet
- Änderungen müssen erst gepusht werden
- Bei `deploy_on_push: true` erfolgt Auto-Deployment

## Development Workflow

```bash
# Lokal testen
npm run dev

# Pushen (triggert Auto-Deploy)
git push

# Deployment Status checken
doctl apps list
doctl apps get <app-id>

# Logs anschauen
doctl apps logs <app-id> --type build
doctl apps logs <app-id> --type deploy
```

## Deployment Commands

```bash
# App erstellen (einmalig)
doctl apps create --spec .do/app.yaml

# App updaten
doctl apps update <app-id> --spec .do/app.yaml
```