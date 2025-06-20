package models

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type User struct {
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	
	Password  string    `json:"-"`
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	Bio       string    `json:"bio"`
	CreatedAt time.Time `json:"created_at"`
}

type Todo struct {
	ID        int       `json:"id"`
	Task      string    `json:"task"`
	Status    bool      `json:"status"`
	UserID    int       `json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
}

type ProfileResponse struct {
	Username  string    `json:"username"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Bio       string    `json:"bio"`
	CreatedAt time.Time `json:"created_at"`
	TodoCount int       `json:"todo_count"`
}

type Claims struct {
	UserID int `json:"user_id"`
	jwt.RegisteredClaims
}

type RegisterRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
	Name     string `json:"name"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type CreateTodoRequest struct {
	Task string `json:"task"`
}

type UpdateTodoRequest struct {
	Task   *string `json:"task"`
	Status *bool   `json:"status"`
}

type UpdateProfileRequest struct {
	Name *string `json:"name"`
	Bio  *string `json:"bio"`
}