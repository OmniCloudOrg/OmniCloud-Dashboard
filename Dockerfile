# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.11.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base
# Set working directory for all build stages.
WORKDIR /usr/src/app

################################################################################
# Create a stage for installing production dependencies.
FROM base as deps
# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --force

################################################################################
# Create a stage for building the application.
FROM base as build
# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build. If you don't need this, remove this step.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --force
# Copy the rest of the source files into the image.
COPY . .
# Run the build script.
RUN npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
FROM base as final
# Use production node environment by default.
ENV NODE_ENV production
ENV HOST 0.0.0.0

# Create directory and set permissions before copying files
RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app

# Copy package.json and package-lock.json first
COPY --chown=node:node package.json package-lock.json ./

# Install dependencies as root first
RUN npm i -v --force
RUN npm install -v vite

# Copy the built application from the build stage
COPY --chown=node:node --from=build /usr/src/app/ ./
# COPY --chown=node:node --from=build /usr/src/app/vite.config.ts ./

# Switch to non-root user after all file operations
USER node

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD ["npm", "run", "start"]