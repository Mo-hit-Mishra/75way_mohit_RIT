// taskController.ts
import { Request, Response } from 'express';
import { Task, sendEmail } from '../models/task.model'; 

export const scheduleTask = async (req: Request, res: Response) => {
  try {
    // Extract task data from the request body
    const { title, description, startTime, endTime, recurring, interval, priority } = req.body;

    // Create a new task
    const task = new Task({ title, description, startTime, endTime, recurring, interval, priority });

    // Save the task to the database
    await task.save();

    // Send email notification
    await sendEmail(task);

    // Respond with a success message or the created task details
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

