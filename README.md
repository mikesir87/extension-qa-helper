# Extension Demo

## Development

### Spinning up Development

To get started, simply run:

```
make dev-up
```

This will do the following:

1. Build the current extension
1. Install the extension
1. Turn on debug logging and point the UI source to the running container
1. Spin up Docker Compose to run the frontend in development mode. This runs in the background, letting you use `docker compose logs`, etc.

### Stopping Development

When you're done, simply run the following to tear it all down and revert the UI-source to the last built version.

```
make dev-down
```

