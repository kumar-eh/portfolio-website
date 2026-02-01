use axum::{Json, response::IntoResponse, http::StatusCode};
use crate::models::user::{LoginRequest, AuthResponse};

pub async fn login(Json(payload): Json<LoginRequest>) -> impl IntoResponse {
    // TODO: Implement actual DB lookup and password verification
    if payload.username == "admin" && payload.password == "password" {
        return (StatusCode::OK, Json(AuthResponse { token: "fake-jwt-token".to_string() })).into_response();
    }
    (StatusCode::UNAUTHORIZED, "Invalid credentials").into_response()
}

