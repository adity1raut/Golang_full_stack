package main

import (
	"log"
	"net/http"
	"github.com/gorilla/mux"
	"github.com/gorilla/handlers"
)

func main() {
	// Initialize database
	if err := InitDB(); err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	defer DB.Close()

	// Create router
	r := mux.NewRouter()

	// Add CORS middleware
	corsMiddleware := handlers.CORS(
		handlers.AllowedOrigins([]string{"http://localhost:5173"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)

	// Authentication routes
	r.HandleFunc("/register", RegisterHandler).Methods("POST")
	r.HandleFunc("/login", LoginHandler).Methods("POST")
	r.HandleFunc("/logout", AuthMiddleware(LogoutHandler)).Methods("POST")

	// Profile routes
	r.HandleFunc("/profile", AuthMiddleware(GetProfileHandler)).Methods("GET")
	r.HandleFunc("/profile", AuthMiddleware(UpdateProfileHandler)).Methods("PUT")
	r.HandleFunc("/profile/password", AuthMiddleware(ChangePasswordHandler)).Methods("PUT")

	// Todo routes
	r.HandleFunc("/todos", AuthMiddleware(GetTodosHandler)).Methods("GET")
	r.HandleFunc("/todos", AuthMiddleware(CreateTodoHandler)).Methods("POST")
	r.HandleFunc("/todos/{id}", AuthMiddleware(GetTodoHandler)).Methods("GET")
	r.HandleFunc("/todos/{id}", AuthMiddleware(UpdateTodoHandler)).Methods("PUT")
	r.HandleFunc("/todos/{id}", AuthMiddleware(DeleteTodoHandler)).Methods("DELETE")

	// Health check
	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	}).Methods("GET")

	log.Println("Server is running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", corsMiddleware(r)))
}