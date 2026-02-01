use axum::{Json, response::IntoResponse, http::StatusCode, Extension};
use sqlx::PgPool;
use crate::models::project::Project;

pub async fn get_projects(Extension(pool): Extension<PgPool>) -> impl IntoResponse {
    let projects = sqlx::query_as!(
        Project,
        "SELECT id, title, description, content, tech_stack, created_at FROM projects ORDER BY created_at DESC"
    )
    .fetch_all(&pool)
    .await;

    match projects {
        Ok(projects) => (StatusCode::OK, Json(projects)).into_response(),
        Err(e) => {
            tracing::error!("Failed to fetch projects: {:?}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, "Failed to fetch projects").into_response()
        }
    }
}

