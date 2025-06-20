package todo

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"server/internal/models"
)

type Service struct {
	db *sql.DB
}

func NewService(db *sql.DB) *Service {
	return &Service{db: db}
}

func (s *Service) GetTodosHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(int)

	rows, err := s.db.Query(`
		SELECT id, task, status, created_at 
		FROM todos WHERE user_id = ? ORDER BY created_at DESC
	`, userID)
	if err != nil {
		http.Error(w, "Failed to fetch todos", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var todos []models.Todo
	for rows.Next() {
		var todo models.Todo
		if err := rows.Scan(&todo.ID, &todo.Task, &todo.Status, &todo.CreatedAt); err != nil {
			http.Error(w, "Failed to read todos", http.StatusInternalServerError)
			return
		}
		todo.UserID = userID
		todos = append(todos, todo)
	}

	// Return empty array instead of null if no todos
	if todos == nil {
		todos = []models.Todo{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todos)
}

func (s *Service) CreateTodoHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(int)

	var req models.CreateTodoRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	req.Task = strings.TrimSpace(req.Task)
	if req.Task == "" {
		http.Error(w, "Task cannot be empty", http.StatusBadRequest)
		return
	}

	result, err := s.db.Exec(`
		INSERT INTO todos (task, user_id) VALUES (?, ?)
	`, req.Task, userID)
	if err != nil {
		http.Error(w, "Failed to create todo", http.StatusInternalServerError)
		return
	}

	id, _ := result.LastInsertId()
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":         id,
		"task":       req.Task,
		"status":     false,
		"user_id":    userID,
		"created_at": time.Now(),
	})
}

func (s *Service) UpdateTodoHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(int)
	vars := mux.Vars(r)
	todoID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid todo ID", http.StatusBadRequest)
		return
	}

	var req models.UpdateTodoRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Verify the todo belongs to the user
	var exists bool
	err = s.db.QueryRow(`
		SELECT EXISTS(SELECT 1 FROM todos WHERE id = ? AND user_id = ?)
	`, todoID, userID).Scan(&exists)
	if err != nil || !exists {
		http.Error(w, "Todo not found", http.StatusNotFound)
		return
	}

	// Build dynamic update query
	var query strings.Builder
	var args []interface{}
	query.WriteString("UPDATE todos SET ")

	if req.Task != nil {
		taskTrimmed := strings.TrimSpace(*req.Task)
		if taskTrimmed == "" {
			http.Error(w, "Task cannot be empty", http.StatusBadRequest)
			return
		}
		query.WriteString("task = ?")
		args = append(args, taskTrimmed)
	}

	if req.Status != nil {
		if len(args) > 0 {
			query.WriteString(", ")
		}
		query.WriteString("status = ?")
		args = append(args, *req.Status)
	}

	if len(args) == 0 {
		http.Error(w, "No fields to update", http.StatusBadRequest)
		return
	}

	query.WriteString(" WHERE id = ?")
	args = append(args, todoID)

	_, err = s.db.Exec(query.String(), args...)
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

func (s *Service) DeleteTodoHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(int)
	vars := mux.Vars(r)
	todoID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid todo ID", http.StatusBadRequest)
		return
	}

	result, err := s.db.Exec(`
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