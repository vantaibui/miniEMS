#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$ROOT_DIR"

echo "=== Sonic Vista: Keycloak Auth Setup ==="

if ! command -v docker >/dev/null 2>&1; then
  echo "ERROR: docker not found. Please install Docker Desktop." >&2
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "ERROR: docker compose not available. Please update Docker." >&2
  exit 1
fi

if [ ! -f ".env" ]; then
  echo "ERROR: .env file not found in project root." >&2
  echo "Create .env (see README-auth.md) then re-run this script." >&2
  exit 1
fi

if [ ! -d "public/sonic-vista-theme" ]; then
  echo "ERROR: Theme folder not found: public/sonic-vista-theme" >&2
  echo "Expected structure: public/sonic-vista-theme/login/theme.properties" >&2
  exit 1
fi

if [ ! -f "keycloak/realm-export.json" ]; then
  echo "ERROR: Missing realm export: keycloak/realm-export.json" >&2
  exit 1
fi

echo "Starting Keycloak + Postgres via docker compose..."

npm run auth:start

echo "Waiting for Keycloak readiness (http://localhost:8080/health/ready) ..."

max_attempts=60
for ((i=1; i<=max_attempts; i++)); do
  if curl -fsS http://localhost:8080/health/ready >/dev/null 2>&1; then
    echo "Keycloak is ready."
    break
  fi

  if [ "$i" -eq "$max_attempts" ]; then
    echo "ERROR: Keycloak did not become ready in time." >&2
    echo "Check logs: docker logs -f sonic-vista-keycloak" >&2
    exit 1
  fi

  sleep 2
  echo "  still waiting... ($i/$max_attempts)"
done

echo "Done."
echo "- Keycloak: http://localhost:8080"
echo "- Realm: sonic-vista"
echo "- Client: sonic-vista-fe"
echo "- Theme: sonic-vista-theme (mounted from public/sonic-vista-theme)"
