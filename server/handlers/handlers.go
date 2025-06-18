package handlers

import (
	"database/sql"
	"encoding/json"
	
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
)

type Handlers struct {
	DB *sql.DB
}

func NewHandlers(db *sql.DB) *Handlers {
	return &Handlers{DB: db}
}

func (h *Handlers) RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var user struct {
		Username string `json:"username"`
		Password string `json:"password"`
		Email    string `json:"email"`
		Name     string `json:"name"`
	}

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if user.Username == "" || user.Password == "" || user.Email == "" {
		http.Error(w, "Username, password, and email are required", http.StatusBadRequest)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Could not hash password", http.StatusInternalServerError)
		return
	}

	result, err := h.DB.Exec(
		"INSERT INTO users (username, password, email, name) VALUES (?, ?, ?, ?)",
		user.Username, string(hashedPassword), user.Email, user.Name,
	)
	if err != nil {
		http.Error(w, "Username or email already exists", http.StatusConflict)
		return
	}

	userID, _ := result.LastInsertId()
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "User created successfully",
		"user_id": userID,
	})
}

func (h *Handlers) LoginHandler(w http.ResponseWriter, r *http.Request) {
	var credentials struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if credentials.Username == "" || credentials.Password == "" {
		http.Error(w, "Username and password are required", http.StatusBadRequest)
		return
	}

	var user struct {
		ID       int
		Username string
		Password string
	}
	err := h.DB.QueryRow(
		"SELECT id, username, password FROM users WHERE username = ?",
		credentials.Username,
	).Scan(&user.ID, &user.Username, &user.Password)
	if err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	if !CheckPasswordHash(credentials.Password, user.Password) {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	token, err := GenerateJWT(user.ID)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	expiresAt := time.Now().Add(24 * time.Hour)
	_, err = h.DB.Exec(
		"INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)",
		user.ID, token, expiresAt,
	)
	if err != nil {
		http.Error(w, "Failed to create session", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"token":   token,
		"message": "Logged in successfully",
	})
}

func (h *Handlers) LogoutHandler(w http.ResponseWriter, r *http.Request) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		http.Error(w, "Invalid authorization header", http.StatusBadRequest)
		return
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")
	_, err := h.DB.Exec("DELETE FROM sessions WHERE token = ?", token)
	if err != nil {
		http.Error(w, "Failed to logout", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Logged out successfully",
	})
}

func (h *Handlers) GetProfileHandler(w http.ResponseWriter, r *http.Request) {
	userID, err := GetUserIDFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var profile struct {
		Username  string    `json:"username"`
		Name      string    `json:"name"`
		Email     string    `json:"email"`
		Bio       string    `json:"bio"`
		CreatedAt time.Time `json:"created_at"`
		TodoCount int       `json:"todo_count"`
	}
	var name, bio sql.NullString

	err = h.DB.QueryRow(`
		SELECT username, name, email, bio, created_at 
		FROM users WHERE id = ?
	`, userID).Scan(
		&profile.Username, &name, &profile.Email,
		&bio, &profile.CreatedAt,
	)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	if name.Valid {
		profile.Name = name.String
	}
	if bio.Valid {
		profile.Bio = bio.String
	}

	err = h.DB.QueryRow(`
		SELECT COUNT(*) FROM todos WHERE user_id = ?
	`, userID).Scan(&profile.TodoCount)
	if err != nil {
		http.Error(w, "Failed to get todo count", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(profile)
}

func (h *Handlers) UpdateProfileHandler(w http.ResponseWriter, r *http.Request) {
	userID, err := GetUserIDFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var update struct {
		Name *string `json:"name"`
		Bio  *string `json:"bio"`
	}
	if err := json.NewDecoder(r.Body).Decode(&update); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var query strings.Builder
	var args []interface{}
	query.WriteString("UPDATE users SET ")

	if update.Name != nil {
		query.WriteString("name = ?")
		args = append(args, *update.Name)
	}

	if update.Bio != nil {
		if len(args) > 0 {
			query.WriteString(", ")
		}
		query.WriteString("bio = ?")
		args = append(args, *update.Bio)
	}

	if len(args) == 0 {
		http.Error(w, "No fields to update", http.StatusBadRequest)
		return
	}

	query.WriteString(" WHERE id = ?")
	args = append(args, userID)

	_, err = h.DB.Exec(query.String(), args...)
	if err != nil {
		http.Error(w, "Failed to update profile", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Profile updated successfully",
	})
}

func (h *Handlers) GetTodosHandler(w http.ResponseWriter, r *http.Request) {
	userID, err := GetUserIDFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	rows, err := h.DB.Query(`
		SELECT id, task, status, created_at 
		FROM todos WHERE user_id = ? ORDER BY created_at DESC
	`, userID)
	if err != nil {
		http.Error(w, "Failed to fetch todos", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	type Todo struct {
		ID        int       `json:"id"`
		Task      string    `json:"task"`
		Status    bool      `json:"status"`
		CreatedAt time.Time `json:"created_at"`
	}
	var todos []Todo

	for rows.Next() {
		var todo Todo
		if err := rows.Scan(&todo.ID, &todo.Task, &todo.Status, &todo.CreatedAt); err != nil {
			http.Error(w, "Failed to read todos", http.StatusInternalServerError)
			return
		}
		todos = append(todos, todo)
	}

	if todos == nil {
		todos = []Todo{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todos)
}

func (h *Handlers) CreateTodoHandler(w http.ResponseWriter, r *http.Request) {
	userID, err := GetUserIDFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var todo struct {
		Task string `json:"task"`
	}
	if err := json.NewDecoder(r.Body).Decode(&todo); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	todo.Task = strings.TrimSpace(todo.Task)
	if todo.Task == "" {
		http.Error(w, "Task cannot be empty", http.StatusBadRequest)
		return
	}

	result, err := h.DB.Exec(`
		INSERT INTO todos (task, user_id) VALUES (?, ?)
	`, todo.Task, userID)
	if err != nil {
		http.Error(w, "Failed to create todo", http.StatusInternalServerError)
		return
	}

	id, _ := result.LastInsertId()
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":         id,
		"task":       todo.Task,
		"status":     false,
		"user_id":    userID,
		"created_at": time.Now(),
	})
}

func (h *Handlers) UpdateTodoHandler(w http.ResponseWriter, r *http.Request) {
	userID, err := GetUserIDFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	todoID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid todo ID", http.StatusBadRequest)
		return
	}

	var update struct {
		Task   *string `json:"task"`
		Status *bool   `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&update); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var exists bool
	err = h.DB.QueryRow(`
		SELECT EXISTS(SELECT 1 FROM todos WHERE id = ? AND user_id = ?)
	`, todoID, userID).Scan(&exists)
	if err != nil || !exists {
		http.Error(w, "Todo not found", http.StatusNotFound)
		return
	}

	var query strings.Builder
	var args []interface{}
	query.WriteString("UPDATE todos SET ")

	if update.Task != nil {
		taskTrimmed := strings.TrimSpace(*update.Task)
		if taskTrimmed == "" {
			http.Error(w, "Task cannot be empty", http.StatusBadRequest)
			return
		}
		query.WriteString("task = ?")
		args = append(args, taskTrimmed)
	}

	if update.Status != nil {
		if len(args) > 0 {
			query.WriteString(", ")
		}
		query.WriteString("status = ?")
		args = append(args, *update.Status)
	}

	if len(args) == 0 {
		http.Error(w, "No fields to update", http.StatusBadRequest)
		return
	}

	query.WriteString(" WHERE id = ?")
	args = append(args, todoID)

	_, err = h.DB.Exec(query.String(), args...)
	if err != nil {
		http.Error(w, "Failed to update todo", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Todo updated successfully",
	})
}

func (h *Handlers) DeleteTodoHandler(w http.ResponseWriter, r *http.Request) {
	userID, err := GetUserIDFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	todoID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid todo ID", http.StatusBadRequest)
		return
	}

	result, err := h.DB.Exec(`
		DELETE FROM todos WHERE id = ? AND user_id = ?
	`, todoID, userID)
	if err != nil {
		http.Error(w, "Failed to delete todo", http.StatusInternalServerError)
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "Todo not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Todo deleted successfully",
	})
}

func (h *Handlers) HealthCheckHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"status": "OK",
		"time":   time.Now().Format(time.RFC3339),
	})
}

// Helper functions that would be imported from auth package
func GenerateJWT(userID int) (string, error) {
	// Implementation would come from auth package
	return "", nil
}

func CheckPasswordHash(password, hash string) bool {
	// Implementation would come from auth package
	return false
}

func GetUserIDFromRequest(r *http.Request) (int, error) {
	// Implementation would come from auth package
	return 0, nil
}