prod *ARGS:
  @docker compose {{ARGS}}

dev *ARGS:
  @docker compose -f docker-compose.dev.yaml {{ARGS}}

dev-up *ARGS:
  @just dev up --remove-orphans {{ARGS}}

dev-prisma *ARGS:
  @just dev exec app-dev pnpm prisma {{ARGS}}

dev-prisma-studio:
  @just dev-prisma studio --port 5555 --browser none
