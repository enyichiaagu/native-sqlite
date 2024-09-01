import { DatabaseSync } from 'node:sqlite';

const database = new DatabaseSync(`${import.meta.dirname}/main.db`);

const createTables = `
CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
  
CREATE TABLE IF NOT EXISTS todos (
  todo_id TEXT PRIMARY KEY,
  todo_owner TEXT NOT NULL, 
  title TEXT NOT NULL,
  checked INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  checked_at INTEGER,
  FOREIGN KEY (todo_owner) REFERENCES users (user_id)
);
`;
database.exec(createTables);

const createUser = database.prepare(`
  INSERT INTO users (user_id, username, password, created_at) 
  VALUES (?, ?, ?, ?)
  RETURNING username, created_at
`);

const getUserByUsername = database.prepare(`
  SELECT * FROM users WHERE username = ?
`);

const createTodo = database.prepare(`
  INSERT INTO todos (todo_id, todo_owner, title)
  VALUES (?, ?, ?)
  RETURNING title, checked, created_at
`);

export { createUser, getUserByUsername };
