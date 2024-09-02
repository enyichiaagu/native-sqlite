import database from './model.js';

const createUser = database.prepare(`
  INSERT INTO users (user_id, username, password, created_at)
  VALUES (?, ?, ?, ?)
  RETURNING user_id, username, created_at
`);

const getUserByUsername = database.prepare(`
  SELECT * FROM users WHERE username = ?
`);

const getUserById = database.prepare(`
  SELECT * FROM users WHERE user_id = ?
`);

const createTodo = database.prepare(`
  INSERT INTO todos (todo_id, todo_owner, title, created_at)
  VALUES (?, ?, ?, ?)
  RETURNING todo_id, title, checked, created_at
`);

const getTodosByUserId = database.prepare(`
  SELECT * FROM todos WHERE todo_owner = ?
`);

const getTodoById = database.prepare(`
  SELECT * FROM todos WHERE todo_id = ?
`);

const updateTodoCheckById = database.prepare(`
  UPDATE todos SET checked = ?, checked_at = ? WHERE todo_owner = ? AND todo_id = ? 
  RETURNING todo_id, title, checked_at, created_at
`);

const deleteTodo = database.prepare(`
  DELETE from todos WHERE todo_id = ? AND todo_owner = ?  
`);

export {
  createUser,
  getUserByUsername,
  getUserById,
  createTodo,
  getTodosByUserId,
  getTodoById,
  updateTodoCheckById,
  deleteTodo,
};
