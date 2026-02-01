use sqlx::{postgres::{PgPoolOptions, PgConnectOptions}, Connection, Executor, PgConnection};
use std::env;
use std::str::FromStr;
use tokio::fs;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv().ok();
    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    
    // Parse the URL to get the base connection (without DB name) to create DB
    // Assuming format postgres://user:pass@host:port/dbname
    let options = PgConnectOptions::from_str(&db_url)?;
    let db_name = options.get_database().unwrap_or("portfolio_db");
    
    // Connect to 'postgres' db to create the new db
    let base_url = db_url.rsplit_once('/').map(|(base, _)| base).unwrap_or(&db_url);
    let postgres_url = format!("{}/postgres", base_url);

    println!("Connecting to {} to create database '{}'...", postgres_url, db_name);
    
    let mut conn = PgConnection::connect(&postgres_url).await?;
    
    let db_exists: bool = sqlx::query_scalar(
        "SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = $1)"
    )
    .bind(db_name)
    .fetch_one(&mut conn)
    .await?;

    if !db_exists {
        println!("Creating database {}...", db_name);
        conn.execute(format!("CREATE DATABASE \"{}\"", db_name).as_str()).await?;
    } else {
        println!("Database {} already exists.", db_name);
    }
    
    // Connect to the new DB and run migrations
    println!("Running migrations...");
    let pool = PgPoolOptions::new().connect(&db_url).await?;
    
    // Embedding SQL directly to bypass file reading issues
    let migration_sql = r#"
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS projects (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            content TEXT NOT NULL,
            tech_stack JSONB NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS contact_submissions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS analytics (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            path TEXT NOT NULL,
            user_agent TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    "#;
    
    println!("Executing migration...");
    pool.execute(migration_sql).await?;
    
    println!("Setup complete!");
    Ok(())
}
