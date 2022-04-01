# Extension QA Helper

This project provides a small dashboard to view the available tags for an extension and provide an easy mechanism to switch between various tags. This can be super helpful for QA or acceptance testing, where testers may not want to drop into the CLI to change versions.

## Installation

In order to use this, you will need to have a version of Docker Desktop installed that supports extensions. Once you've done so, you can run the following to install the extension:

```
docker extension install mikesir87/extension-qa-helper
```


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
