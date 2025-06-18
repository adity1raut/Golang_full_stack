package main

import (
	"encoding/json"
	"net/http"
	"strconv"
	"github.com/gorilla/mux"
)

func GetTodosHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(int)
	rows, err := DB.Query("SELECT id, task, status, created_at FROM todos WHERE user_id = ?", userID)
	if err != nil {
		http.Error(w, "Failed to fetch todos", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var todos []Todo
	for rows.Next() {
		var todo Todo
		if err := rows.Scan(&todo.ID, &todo.Task, &todo.Status, &todo.CreatedAt); err != nil {
			http.Error(w, "Failed to read todos", http.StatusInternalServerError)
			return
		}
		todos = append(todos, todo)
	}

	json.NewEncoder(w).Encode(todos)
}

func CreateTodoHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(int)
	
	var todo struct {
		Task string `json:"task"`
	}
	if err := json.NewDecoder(r.Body).Decode(&todo); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if todo.Task == "" {
		http.Error(w, "Task cannot be empty", http.StatusBadRequest)
		return
	}

	result, err := DB.Exec(
		"INSERT INTO todos (task, user_id) VALUES (?, ?)",
		todo.Task, userID,
	)
	if err != nil {
		http.Error(w, "Failed to create todo", http.StatusInternalServerError)
		return
	}

	id, _ := result.LastInsertId()
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":     id,
		"task":   todo.Task,
		"status": false,
	})
}

func GetTodoHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(int)
	todoID, _ := strconv.Atoi(mux.Vars(r)["id"])

	var todo Todo
	err := DB.QueryRow(
		"SELECT id, task, status, created_at FROM todos WHERE id = ? AND user_id = ?",
		todoID, userID,
	).Scan(&todo.ID, &todo.Task, &todo.Status, &todo.CreatedAt)

	if err != nil {
		http.Error(w, "Todo not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(todo)
}

func UpdateTodoHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(int)
	todoID, _ := strconv.Atoi(mux.Vars(r)["id"])

	var update struct {
		Task   *string `json:"task"`
		Status *bool   `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&update); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Verify todo belongs to user
	var exists bool
	DB.QueryRow(
		"SELECT EXISTS(SELECT 1 FROM todos WHERE id = ? AND user_id = ?)",
		todoID, userID,
	).Scan(&exists)
	if !exists {
		http.Error(w, "Todo not found", http.StatusNotFound)
		return
	}

	// Build update query
	query := "UPDATE todos SET "
	var args []interface{}

	if update.Task != nil {
		query += "task = ?"
		args = append(args, *update.Task)
	}

	if update.Status != nil {
		if len(args) > 0 {
			query += ", "
		}
		query += "status = ?"
		args = append(args, *update.Status)
	}

	if len(args) == 0 {
		http.Error(w, "No fields to update", http.StatusBadRequest)
		return
	}

	query += " WHERE id = ?"
	args = append(args, todoID)

	if _, err := DB.Exec(query, args...); err != nil {
		http.Error(w, "Failed to update todo", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func DeleteTodoHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(int)
	todoID, _ := strconv.Atoi(mux.Vars(r)["id"])

	result, err := DB.Exec(
		"DELETE FROM todos WHERE id = ? AND user_id = ?",
		todoID, userID,
	)
	if err != nil {
		http.Error(w, "Failed to delete todo", http.StatusInternalServerError)
		return
	}

	if rows, _ := result.RowsAffected(); rows == 0 {
		http.Error(w, "Todo not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
}