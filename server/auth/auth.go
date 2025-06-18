package auth

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"
	"encoding/json"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var (
	JWTKey = []byte("your-secret-key") // Should be set via config in production
)

type Claims struct {
	UserID int `json:"user_id"`
	jwt.RegisteredClaims
}

// GenerateJWT creates a new JWT token for the given user ID
func GenerateJWT(userID int) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "todo-app",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(JWTKey)
}

// CheckPasswordHash compares a password with a bcrypt hash
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// HashPassword creates a bcrypt hash of the password
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// AuthMiddleware verifies JWT token and checks session
func AuthMiddleware(db *sql.DB, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			respondWithError(w, http.StatusUnauthorized, "Authorization header missing")
			return
		}

		if !strings.HasPrefix(authHeader, "Bearer ") {
			respondWithError(w, http.StatusUnauthorized, "Invalid authorization format")
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		claims := &Claims{}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return JWTKey, nil
		})

		if err != nil || !token.Valid {
			respondWithError(w, http.StatusUnauthorized, "Invalid token")
			return
		}

		// Check session in database
		var exists bool
		err = db.QueryRow(`
			SELECT EXISTS(
				SELECT 1 FROM sessions 
				WHERE token = ? AND user_id = ? AND expires_at > datetime('now')
			)`, tokenString, claims.UserID).Scan(&exists)

		if err != nil || !exists {
			respondWithError(w, http.StatusUnauthorized, "Invalid or expired session")
			return
		}

		// Add userID to context
		ctx := context.WithValue(r.Context(), "userID", claims.UserID)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

// GetUserIDFromRequest extracts user ID from request context
func GetUserIDFromRequest(r *http.Request) (int, error) {
	userID, ok := r.Context().Value("userID").(int)
	if !ok {
		return 0, errors.New("user ID not found in context")
	}
	return userID, nil
}

func respondWithError(w http.ResponseWriter, code int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}