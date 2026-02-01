# Builder stage
FROM rust:1.81-slim-bullseye as builder

WORKDIR /app

# Install build dependencies (OpenSSL is often required)
RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*

# Copy manifests first for caching
COPY Cargo.toml Cargo.lock ./

# Create a dummy main.rs to build dependencies
# This is a common pattern to cache dependencies
RUN mkdir src && \
    echo "fn main() {println!(\"if you see this, the build broke\")}" > src/main.rs && \
    cargo build --release --bin backend && \
    rm -rf src

# Now copy the actual source code
COPY . .

# Build the application
# We need to touch the main.rs to force a rebuild of the application code
RUN touch src/main.rs && cargo build --release --bin backend

# Runtime stage
FROM debian:bullseye-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y libssl-dev ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy the binary from builder
COPY --from=builder /app/target/release/backend /app/backend

# Copy static configuration or migrations if needed
# COPY migrations ./migrations
# We can run migrations on startup or via a separate command. 
# For simplicity in this guide, we'll assume the app might run them or we run a separate job.
# But our current setup_db.rs is a separate binary. 
# Let's copy the setup_db binary too if we want to run it manually, 
# but usually production apps run migrations on startup programmatically.
# For this guide, I'll recommend running the migration via the app or a release command.

# Expose port
EXPOSE 3001

# Run the binary
CMD ["./backend"]
