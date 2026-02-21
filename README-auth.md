# Sonic Vista — Keycloak Auth (Docker + Postgres + Custom Theme)

This project runs Keycloak locally using Docker + PostgreSQL, **auto-provisions** the realm/client/users/roles, and **mounts a custom Keycloak theme** from the repo.

- Realm: `sonic-vista`
- Client: `sonic-vista-fe` (public + PKCE S256)
- Keycloak URL: `http://localhost:8080`
- Theme (repo): `public/sonic-vista-theme`
- Theme (container): `/opt/keycloak/themes/sonic-vista-theme`

---

## 1) Prerequisites

- Docker Desktop (includes `docker compose`)
- Node.js + npm

---

## 2) One-time setup

### A. Create `.env` in project root

Create a file named **`.env`** in the project root (same folder as `docker-compose.yml`):

```env
KC_DB_NAME=keycloak
KC_DB_USER=keycloak
KC_DB_PASSWORD=Passw0rd!

KC_ADMIN_USER=admin
KC_ADMIN_PASSWORD=Passw0rd!

# demo users in realm-export.json currently use this password value
DEMO_USER_PASSWORD=Passw0rd!

VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=sonic-vista
VITE_KEYCLOAK_CLIENT_ID=sonic-vista-fe
```

> Recommended: add `.env` to `.gitignore`.

### B. Start Keycloak + Postgres

```bash
chmod +x setup.sh
./setup.sh
```

This will start Docker Compose and wait until Keycloak is ready at:

- `http://localhost:8080/health/ready`

---

## 3) Everyday commands

```bash
# Start stack
npm run auth:start

# Stop stack
npm run auth:stop

# Reset stack (DROPS volumes -> re-imports realm from JSON)
npm run auth:reset
```

---

## 4) Realm auto-provisioning (no Admin Console steps)

Realm provisioning is driven by:

- `keycloak/realm-export.json`

Keycloak imports it automatically on startup via `--import-realm`.

It configures:

- Realm: `sonic-vista`
- Client: `sonic-vista-fe`
  - Public client
  - Authorization Code Flow
  - **PKCE S256** enabled
  - Redirect URIs:
    - `http://localhost:5173/*`
    - `http://127.0.0.1:5173/*`
  - Web origins:
    - `http://localhost:5173`
    - `http://127.0.0.1:5173`
- Realm roles: `USER`, `ADMIN`
- Demo users:
  - `user` / `Passw0rd!` (USER)
  - `admin` / `Passw0rd!` (USER + ADMIN)

---

## 5) Custom Theme

### Theme structure (repo)

```txt
public/
  sonic-vista-theme/
    login/
      resources/
      login.ftl
      login-reset-password.ftl
      theme.properties
```

### Mounted into Keycloak container

Docker mounts:

- `./public/sonic-vista-theme` -> `/opt/keycloak/themes/sonic-vista-theme`

### Activated for the realm automatically

`keycloak/realm-export.json` sets:

- `loginTheme: sonic-vista-theme`
- `emailTheme: sonic-vista-theme`
- `accountTheme: sonic-vista-theme`

So the realm uses the theme **immediately after import**.

---

## 6) Debugging the theme

### View Keycloak logs

```bash
docker logs -f sonic-vista-keycloak
```

### Common theme issues

- Folder name mismatch:
  - Realm references `sonic-vista-theme`
  - The theme directory must be `/opt/keycloak/themes/sonic-vista-theme`
- Missing `theme.properties` under `login/`
- Missing templates (e.g. `login.ftl`)

---

## 7) "Hot reload" theme in dev

Keycloak doesn’t truly hot-reload theme templates, but your workflow can be:

1. Edit theme files under `public/sonic-vista-theme/...`
2. Restart only Keycloak:

```bash
docker restart sonic-vista-keycloak
```

If you changed realm import JSON and want it to re-import cleanly:

```bash
npm run auth:reset
```

---

## 8) Frontend integration notes

- Keycloak JS client: `keycloak-js`
- PKCE S256 enabled (`src/config/keycloak.config.ts`)
- Silent SSO: `onLoad: 'check-sso'`
- Iframe login check disabled: `checkLoginIframe: false`
- Axios attaches Bearer token via `src/api/axios/axiosInstance.ts`

To run the UI:

```bash
npm i
npm run dev
```

---

## 9) Production recommendations (high level)

- Use HTTPS and set a real hostname (`KC_HOSTNAME`) behind a reverse proxy
- Do **not** run `start-dev` in production
- Restrict redirect URIs and web origins to production domains
- Rotate admin/demo credentials; remove demo users
- Keep tokens in memory (avoid localStorage/sessionStorage)
