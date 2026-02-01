use axum::{Json, response::IntoResponse, http::StatusCode, Extension};
use sqlx::PgPool;
use crate::models::project::{CreateProjectRequest, Project};

pub async fn create_project(
    Extension(pool): Extension<PgPool>,
    Json(payload): Json<CreateProjectRequest>,
) -> impl IntoResponse {
    let rec = sqlx::query_as!(
        Project,
        r#"
        INSERT INTO projects (title, description, content, tech_stack)
        VALUES ($1, $2, $3, $4)
        RETURNING id, title, description, content, tech_stack, created_at
        "#,
        payload.title,
        payload.description,
        payload.content,
        serde_json::to_value(payload.tech_stack).unwrap()
    )
    .fetch_one(&pool)
    .await;

    match rec {
        Ok(project) => (StatusCode::CREATED, Json(project)).into_response(),
        Err(e) => {
            tracing::error!("Failed to create project: {:?}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, "Failed to create project").into_response()
        }
    }
}

