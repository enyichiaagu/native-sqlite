import express from 'express';
import { nanoid } from 'nanoid';

const todosRouter = express.Router();

// Create a todo as a user
todosRouter.post('/', (req, res) => {
  const { title } = req.body;
});

export default todosRouter;

// List all todos of a user
// update the status of a todo
