package config

import (
	"os"
)

type Config struct {
	Port          string
	DatabasePath  string
	JWTSecret     []byte
	AllowedOrigin string
}

func Load() *Config {
	return &Config{
		Port:          getEnv("PORT", "8080"),
		DatabasePath:  getEnv("DATABASE_PATH", "./todo.db"),
		JWTSecret:     []byte(getEnv("JWT_SECRET", "your-secret-key-change-in-production")),
		AllowedOrigin: getEnv("ALLOWED_ORIGIN", "http://localhost:5173"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
