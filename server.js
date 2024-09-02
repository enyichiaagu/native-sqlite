import express from 'express';
import usersRouter from './routes/users.router.js';
import todosRouter from './routes/todos.router.js';

const PORT = 5000;
const app = express();

app.use(express.json());

// Routes
app.use('/api/users', usersRouter);
app.use('/api/todos', todosRouter);

app.listen(PORT, () => console.log('Listening'));
