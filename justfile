prod *ARGS:
  @docker compose {{ARGS}}

dev *ARGS:
  @docker compose -f docker-compose.dev.yaml {{ARGS}}
