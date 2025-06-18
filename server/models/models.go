package models

import (
	"database/sql"
	"time"
)

// User represents a user in the system
type User struct {
	ID        int            `json:"id"`
	Username  string         `json:"username"`
	Password  string         `json:"-"`
	Email     string         `json:"email"`
	Name      sql.NullString `json:"name"`
	Bio       sql.NullString `json:"bio"`
	CreatedAt time.Time      `json:"created_at"`
}

// Todo represents a todo item
type Todo struct {
	ID        int       `json:"id"`
	Task      string    `json:"task"`
	Status    bool      `json:"status"`
	UserID    int       `json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
}

// ProfileResponse represents the user profile data sent to clients
type ProfileResponse struct {
	Username  string    `json:"username"`
	Name      string    `json:"name,omitempty"`
	Email     string    `json:"email"`
	Bio       string    `json:"bio,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	TodoCount int       `json:"todo_count"`
}

// RegisterRequest represents the data needed to register a new user
type RegisterRequest struct {
	Username string `json:"username" validate:"required,min=3,max=50"`
	Password string `json:"password" validate:"required,min=8"`
	Email    string `json:"email" validate:"required,email"`
	Name     string `json:"name" validate:"max=100"`
}

// LoginRequest represents the data needed to log in a user
type LoginRequest struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

// UpdateProfileRequest represents the data needed to update a user profile
type UpdateProfileRequest struct {
	Name *string `json:"name" validate:"omitempty,max=100"`
	Bio  *string `json:"bio" validate:"omitempty,max=500"`
}

// CreateTodoRequest represents the data needed to create a new todo
type CreateTodoRequest struct {
	Task string `json:"task" validate:"required,min=1,max=500"`
}

// UpdateTodoRequest represents the data needed to update a todo
type UpdateTodoRequest struct {
	Task   *string `json:"task" validate:"omitempty,min=1,max=500"`
	Status *bool   `json:"status"`
}

// ErrorResponse represents a standardized error response
type ErrorResponse struct {
	Error string `json:"error"`
}

// SuccessResponse represents a standardized success response
type SuccessResponse struct {
	Message string `json:"message"`
}