mod config;
mod handlers;
mod models;
mod middleware;

use axum::{
    routing::{get, post},
    Router, Extension,
};
use std::net::SocketAddr;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use sqlx::postgres::PgPoolOptions;

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "debug".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    config::init();
    let config = config::get();

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&config.database_url)
        .await
        .expect("Failed to connect to DB");

    let app = Router::new()
        .route("/", get(|| async { "Backend is running!" }))
        .route("/health", get(|| async { "OK" }))
        .route("/api/auth/login", post(handlers::auth::login))
        .route("/api/projects", get(handlers::public::get_projects))
        // Admin routes (todo: add middleware)
        .route("/api/admin/projects", post(handlers::admin::create_project))
        .layer(Extension(pool))
        .layer(
            tower_http::cors::CorsLayer::new()
                .allow_origin(tower_http::cors::Any)
                .allow_methods([axum::http::Method::GET, axum::http::Method::POST, axum::http::Method::PUT, axum::http::Method::DELETE])
                .allow_headers([axum::http::header::CONTENT_TYPE, axum::http::header::AUTHORIZATION]),
        );

    let addr: SocketAddr = format!("{}:{}", config.host, config.port).parse().unwrap();
    tracing::info!("listening on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
