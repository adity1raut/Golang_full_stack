package main

import (
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"server/internal/auth"
	"server/internal/config"
	"server/internal/database"
	"server/internal/profile"
	"server/internal/todo"
	"time"
)

func main() {
	// Initialize configuration
	cfg := config.Load()

	// Initialize database
	db, err := database.Init(cfg.DatabasePath)
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	defer db.Close()

	// Initialize services
	authService := auth.NewService(db, cfg.JWTSecret)
	profileService := profile.NewService(db)
	todoService := todo.NewService(db)

	// Setup routes
	r := mux.NewRouter()

	// CORS middleware
	corsMiddleware := handlers.CORS(
		handlers.AllowedOrigins([]string{cfg.AllowedOrigin}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)

	// Authentication routes
	r.HandleFunc("/register", authService.RegisterHandler).Methods("POST")
	r.HandleFunc("/login", authService.LoginHandler).Methods("POST")
	r.HandleFunc("/logout", authService.AuthMiddleware(authService.LogoutHandler)).Methods("POST")

	// Profile routes
	r.HandleFunc("/profile", authService.AuthMiddleware(profileService.GetProfileHandler)).Methods("GET")
	r.HandleFunc("/profile", authService.AuthMiddleware(profileService.UpdateProfileHandler)).Methods("PUT")

	// Todo routes
	r.HandleFunc("/todos", authService.AuthMiddleware(todoService.GetTodosHandler)).Methods("GET")
	r.HandleFunc("/todos", authService.AuthMiddleware(todoService.CreateTodoHandler)).Methods("POST")
	r.HandleFunc("/todos/{id}", authService.AuthMiddleware(todoService.UpdateTodoHandler)).Methods("PUT")
	r.HandleFunc("/todos/{id}", authService.AuthMiddleware(todoService.DeleteTodoHandler)).Methods("DELETE")

	// Health check
	r.HandleFunc("/health", healthCheckHandler).Methods("GET")

	log.Printf("Server is running on port %s", cfg.Port)
	log.Fatal(http.ListenAndServe(":"+cfg.Port, corsMiddleware(r)))
}

func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"OK","time":"` + time.Now().Format(time.RFC3339) + `"}`))
}