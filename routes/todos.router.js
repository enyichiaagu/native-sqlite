import express from 'express';
import { nanoid } from 'nanoid';
import {
  getUserById,
  createTodo,
  getTodosByUserId,
  updateTodoCheckById,
  getTodoById,
  deleteTodo,
} from '../data/queries.js';

// No real login implementation will be used, this is only for the purpose of illustration

const todosRouter = express.Router();

const defaultUserId = 'CHANGE TO USER ID STRING';

// Create a todo as a user
todosRouter.post('/', (req, res) => {
  const { title } = req.body;

  if (!title) return res.status(400).json({ error: 'Missing Todo Title' });

  const fetchedUser = getUserById.get(defaultUserId);
  if (!fetchedUser) return res.status(400).json({ error: 'User not found' });

  const todoId = nanoid(6);
  const todoOwner = fetchedUser.user_id;
  const createdAt = Date.now();
  const addedTodo = createTodo.get(todoId, todoOwner, title, createdAt);

  return res.status(201).json({
    todoId,
    title,
    checked: Boolean(addedTodo.checked),
    joined: new Date(addedTodo.created_at).toISOString(),
  });
});

// List all todos of a user
todosRouter.get('/', (req, res) => {
  const fetchedUser = getUserById.get(defaultUserId);
  if (!fetchedUser) {
    return res.status(400).json({ error: 'Unauthenticated user' });
  }

  const todos = getTodosByUserId.all(defaultUserId);
  return res.status(200).json(
    todos.map(({ todo_id, title, checked, created_at }) => ({
      todoId: todo_id,
      title,
      checked: Boolean(checked),
      createdAt: new Date(created_at).toISOString(),
    }))
  );
});

// update the status of a todo
todosRouter.patch('/:id', (req, res) => {
  const { checked } = req.body;
  const todoId = req.params.id;

  const recordedTodo = getTodoById.get(todoId);

  if (!recordedTodo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  if (recordedTodo.todo_owner !== defaultUserId) {
    return res
      .status(401)
      .json({ error: 'User unauthorized to update this todo' });
  }

  const checkedAt = Date.now();

  const updatedCheck = checked ? 1 : 0;
  const { todo_id, title, checked_at, created_at } = updateTodoCheckById.get(
    updatedCheck,
    checkedAt,
    recordedTodo.todo_owner,
    todoId
  );

  return res.status(200).json({
    message: 'Successfully updated Todo',
    update: {
      todoId: todo_id,
      title,
      check: Boolean(updatedCheck),
      checkedAt: new Date(checked_at).toISOString(),
      createdAt: new Date(created_at).toISOString(),
    },
  });
});

todosRouter.delete('/:id', (req, res) => {
  const todoId = req.params.id;

  const recordedTodo = getTodoById.get(todoId);
  if (!recordedTodo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  if (recordedTodo.todo_owner !== defaultUserId) {
    return res
      .status(401)
      .json({ error: 'User unauthorized to delete this todo' });
  }

  deleteTodo.run(todoId, defaultUserId);
  return res.status(200).json({ message: 'Todo successfully deleted!' });
});

export default todosRouter;
