package profile

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"

	"server/internal/models"
)

type Service struct {
	db *sql.DB
}

func NewService(db *sql.DB) *Service {
	return &Service{db: db}
}

func (s *Service) GetProfileHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(int)

	var profile models.ProfileResponse
	var todoCount int
	var name, bio sql.NullString

	// Get user info - handle NULL values properly
	err := s.db.QueryRow(`
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

	// Handle NULL values
	if name.Valid {
		profile.Name = name.String
	}
	if bio.Valid {
		profile.Bio = bio.String
	}

	// Get todo count
	err = s.db.QueryRow(`
		SELECT COUNT(*) FROM todos WHERE user_id = ?
	`, userID).Scan(&todoCount)
	if err != nil {
		http.Error(w, "Failed to get todo count", http.StatusInternalServerError)
		return
	}

	profile.TodoCount = todoCount

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(profile)
}

func (s *Service) UpdateProfileHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(int)

	var req models.UpdateProfileRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Build dynamic update query
	var query strings.Builder
	var args []interface{}
	query.WriteString("UPDATE users SET ")

	if req.Name != nil {
		query.WriteString("name = ?")
		args = append(args, *req.Name)
	}

	if req.Bio != nil {
		if len(args) > 0 {
			query.WriteString(", ")
		}
		query.WriteString("bio = ?")
		args = append(args, *req.Bio)
	}

	if len(args) == 0 {
		http.Error(w, "No fields to update", http.StatusBadRequest)
		return
	}

	query.WriteString(" WHERE id = ?")
	args = append(args, userID)

	_, err := s.db.Exec(query.String(), args...)
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