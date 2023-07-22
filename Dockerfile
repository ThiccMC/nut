FROM debian:stable-slim as base

RUN useradd -md /app bao
WORKDIR /app
ENV PATH "/app/.bun/bin:$PATH"

FROM base as basenv
# please don't haunt me
RUN apt-get update && yes | apt-get install curl unzip nodejs

FROM basenv as init
RUN curl -fsSL https://bun.sh/install | bash

FROM basenv as benv

COPY --from=init --chown=bao /root /app
USER bao

FROM benv as build

COPY --chown=bao . .
RUN bun install \
  && bun run init \
  && bun run build

FROM base

COPY --from=init --chown=bao /root /app
COPY --from=build --chown=bao /app/package.json /app/dist ./
USER bao
# RUN bun install -p
CMD ["/app/.bun/bin/bun", "index.js"]