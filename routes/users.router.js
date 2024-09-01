import express from 'express';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { createUser, getUserByUsername } from '../data/model.js';

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

  const newUser = createUser.get(userId, username, hashedPassword, Date.now());

  return res.status(201).json({
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
  if (!registeredUser) return res.status(404).json({ error: 'User not found' });

  // Check for password
  const isCorrectPassword = await bcrypt.compare(
    password,
    registeredUser.password
  );
  if (!isCorrectPassword) {
    return res.status(400).json({ error: 'Incorrect Password' });
  }

  // Login Implementation
  return res.status(200).json({ message: 'Login Success' });
});

export default usersRouter;
