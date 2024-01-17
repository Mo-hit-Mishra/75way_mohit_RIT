import express = require('express');
import { Request, Response, NextFunction } from 'express';
// import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import connectToDatabase from "./connection/db";
import { scheduleTask } from './controllers/taskController'; 
const jwt = require('jsonwebtoken');
import authenticateMiddleware from './authMiddleware/authenticateMiddleware';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// // Routes 
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Middleware for user authentication
// app.use(authenticateMiddleware);

// // Route for scheduling tasks
app.post('/schedule-task',authenticateMiddleware, scheduleTask);

// Start the server
app.listen(PORT, async() => {
    await connectToDatabase();
  console.log(`Server is running on http://localhost:${PORT}`);
});
