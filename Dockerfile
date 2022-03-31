FROM golang:1.17-alpine AS builder
ENV CGO_ENABLED=0
RUN apk add --update make
WORKDIR /backend
COPY go.* .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go mod download
COPY . .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    make bin

FROM node:14.17-alpine3.13 AS client-builder-base
WORKDIR /ui

FROM client-builder-base AS client-dev
CMD ["npm", "run", "dev"]

FROM client-builder-base AS client-builder
# cache packages in layer
COPY ui/package.json /ui/package.json
COPY ui/package-lock.json /ui/package-lock.json
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
# install
COPY ui /ui
RUN npm run build

FROM alpine
LABEL org.opencontainers.image.title="Extensions QA Switcher" \
    org.opencontainers.image.description="PoC of QA Switching" \
    org.opencontainers.image.vendor="Michael Irwin" \
    com.docker.desktop.extension.api.version=">= 0.2.0"
COPY --from=builder /backend/bin/service /
COPY docker-compose.extension.yaml .
COPY metadata.json .
COPY docker.svg .
COPY --from=client-builder /ui/build ui
CMD /service -socket /run/guest-services/app.sock
