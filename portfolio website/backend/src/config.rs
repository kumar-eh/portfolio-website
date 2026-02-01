use std::env;
use std::sync::OnceLock;
use dotenvy::dotenv;

#[derive(Debug)]
pub struct Config {
    pub database_url: String,
    pub jwt_secret: String,
    pub host: String,
    pub port: u16,
}

pub static CONFIG: OnceLock<Config> = OnceLock::new();

pub fn init() {
    dotenv().ok();
    
    let config = Config {
        database_url: env::var("DATABASE_URL").expect("DATABASE_URL must be set"),
        jwt_secret: env::var("JWT_SECRET").expect("JWT_SECRET must be set"),
        host: env::var("HOST").unwrap_or_else(|_| "127.0.0.1".to_string()),
        port: env::var("PORT").unwrap_or_else(|_| "3000".to_string()).parse().expect("PORT must be a number"),
    };

    CONFIG.set(config).expect("Config already initialized");
}

pub fn get() -> &'static Config {
    CONFIG.get().expect("Config not initialized")
}
