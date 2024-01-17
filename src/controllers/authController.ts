import { Request, Response } from 'express';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import User from '../models/user.model';

const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email,role:user}, process.env.SECRET_KEY as string, {
        expiresIn: '1d', // Token expiration time (adjust as needed)
      });
      // Set the token as an HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 3600000, // Cookie expiration time in milliseconds (1 hour in this case)
        });
        // res.json({ user, });

        res.json({ token });
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export {login,register};
