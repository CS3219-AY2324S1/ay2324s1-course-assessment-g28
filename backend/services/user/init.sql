-- this script will be run during initialisation

CREATE TABLE IF NOT EXISTS Users (
    email TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS Attempts (
    id serial PRIMARY KEY,
    email TEXT REFERENCES Users(email),
    question_id INT NOT NULL,
    question_title TEXT NOT NULL,
    attempt_date TIMESTAMP NOT NULL DEFAULT NOW(),
    attempt_details TEXT NOT NULL
);