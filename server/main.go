package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"server/auth"
	"server/database"
	myhandlers "server/handlers" // Renamed local handlers package

	gorillaHandlers "github.com/gorilla/handlers" // Renamed gorilla handlers
	"github.com/gorilla/mux"
)

func main() {
	// Initialize database
	database.InitDB()
	defer database.DB.Close()

	// Create handlers instance
	appHandlers := myhandlers.NewHandlers(database.DB)

	// Initialize router
	router := mux.NewRouter()

	// CORS configuration
	cors := gorillaHandlers.CORS(
		gorillaHandlers.AllowedOrigins([]string{os.Getenv("ALLOWED_ORIGINS")}),
		gorillaHandlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		gorillaHandlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
		gorillaHandlers.AllowCredentials(),
	)

	// API routes
	api := router.PathPrefix("/api").Subrouter()

	// Authentication routes
	api.HandleFunc("/register", appHandlers.RegisterHandler).Methods("POST")
	api.HandleFunc("/login", appHandlers.LoginHandler).Methods("POST")
	api.HandleFunc("/logout", auth.AuthMiddleware(database.DB, appHandlers.LogoutHandler)).Methods("POST")

	// Profile routes
	api.HandleFunc("/profile", auth.AuthMiddleware(database.DB, appHandlers.GetProfileHandler)).Methods("GET")
	api.HandleFunc("/profile", auth.AuthMiddleware(database.DB, appHandlers.UpdateProfileHandler)).Methods("PUT")

	// Todo routes
	api.HandleFunc("/todos", auth.AuthMiddleware(database.DB, appHandlers.GetTodosHandler)).Methods("GET")
	api.HandleFunc("/todos", auth.AuthMiddleware(database.DB, appHandlers.CreateTodoHandler)).Methods("POST")
	api.HandleFunc("/todos/{id:[0-9]+}", auth.AuthMiddleware(database.DB, appHandlers.UpdateTodoHandler)).Methods("PUT")
	api.HandleFunc("/todos/{id:[0-9]+}", auth.AuthMiddleware(database.DB, appHandlers.DeleteTodoHandler)).Methods("DELETE")

	// Health check
	router.HandleFunc("/health", appHandlers.HealthCheckHandler).Methods("GET")

	// Logger middleware
	loggedRouter := gorillaHandlers.LoggingHandler(os.Stdout, router)

	// Server configuration
	server := &http.Server{
		Addr:         ":" + os.Getenv("PORT"),
		Handler:      cors(loggedRouter),
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server
	log.Printf("Server starting on %s", server.Addr)
	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}