package database

import (
	"database/sql"
	"log"
	_ "modernc.org/sqlite"
)

var DB *sql.DB

func InitDB() {
	var err error
	DB, err = sql.Open("sqlite", "./todos.db")
	if err != nil {
		log.Fatal(err)
	}

	_, err = DB.Exec("PRAGMA foreign_keys = ON")
	if err != nil {
		log.Fatal(err)
	}

	queries := []string{
		`CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT NOT NULL UNIQUE,
			password TEXT NOT NULL,
			email TEXT NOT NULL UNIQUE,
			name TEXT,
			bio TEXT,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS todos (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			task TEXT NOT NULL,
			status BOOLEAN NOT NULL DEFAULT 0,
			user_id INTEGER NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
		);`,
		`CREATE TABLE IF NOT EXISTS sessions (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER NOT NULL,
			token TEXT NOT NULL UNIQUE,
			expires_at DATETIME NOT NULL,
			FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
		);`,
		"CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);",
	}

	for _, query := range queries {
		_, err = DB.Exec(query)
		if err != nil {
			log.Fatal(err)
		}
	}
}