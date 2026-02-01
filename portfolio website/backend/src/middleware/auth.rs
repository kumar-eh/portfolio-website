use axum::{
    http::{Request, StatusCode},
    middleware::Next,
    response::Response,
};

pub async fn require_auth(req: Request<axum::body::Body>, next: Next) -> Result<Response, StatusCode> {
    // TODO: Validate JWT from Authorization header
    // For now, allow everything or check for a specific header
    Ok(next.run(req).await)
}

