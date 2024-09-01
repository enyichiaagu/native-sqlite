import express from 'express';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { createUser, getUserByUsername } from '../data/queries.js';

const usersRouter = express.Router();

const saltRounds = 10;

usersRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  // Minimal Input Validation
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing required property' });
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const userId = nanoid();

  const recordedUser = getUserByUsername.get(username);

  if (recordedUser)
    return res.status(400).json({ error: 'Username already exists' });

  const newUser = createUser.get(userId, username, hashedPassword, Date.now());

  return res.status(201).json({
    userId: newUser.user_id,
    username: newUser.username,
    joined: new Date(newUser.created_at).toISOString(),
  });
});

usersRouter.post('/session', async (req, res) => {
  const { username, password } = req.body;

  // Minimal Input Validation
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing required property' });
  }

  const registeredUser = getUserByUsername.get(username);
  if (!registeredUser) return res.status(400).json({ error: 'User not found' });

  // Check for password
  const isCorrectPassword = await bcrypt.compare(
    password,
    registeredUser.password
  );
  if (!isCorrectPassword) {
    return res.status(400).json({ error: 'Incorrect Password' });
  }

  // Login Implementation
  return res
    .status(200)
    .json({ message: 'Login Success', user: registeredUser.username });
});

export default usersRouter;
