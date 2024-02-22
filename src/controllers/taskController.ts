import { Request, Response } from 'express';
import { Users, IUser,sendEmail,scheduleTasksWithPriority ,scheduleEmail} from '../models/task.model';
import { Task, ITask } from '../models/task.model';
import { time } from 'console';

// Controller for handling user-related tasks
export const UserController = {
  // Create a new user
  createUser: async (req: Request, res: Response) => {
    try {
      // Assuming request body contains username, email, and password
      const { username, email, password ,scheduleTime, timeZone} = req.body;

      // Create a new user instance
      const newUser: IUser = new Users({ username, email, password });

      // Save the user to the database
      await newUser.save();

      // // Schedule the welcome email at the specified time
      if (scheduleTime && timeZone) {
        scheduleEmail(newUser, scheduleTime, timeZone);
      }

      // Send welcome email to the user
      await sendEmail(newUser);

      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get user by ID
  getUserById: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;

      // Find user by ID in the database
      const user = await Users.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // // Schedule the welcome email at the specified time
      const scheduleTime = "2024-01-18T17:30:00"; // Replace with the desired time
      const timeZone = "Asia/Kolkata"; // Replace with the desired time zone

      // Call the scheduleEmail function
      // scheduleEmail(user, scheduleTime, timeZone);

      res.status(200).json({ user });
    } catch (error) {
      console.error('Error getting user by ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

createTasksForUser: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const tasksData: { title: string; description: string; priority: number; dueDate: Date }[] = req.body.tasks;
  
      const user: IUser | null = await Users.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const createdTasks: ITask[] = await Task.create(tasksData);
  
      user.tasks.push(...createdTasks);
      await user.save();
  
      // Schedule tasks with priority
      await scheduleTasksWithPriority(user, tasksData);

      // // Schedule email sending for each task
      createdTasks.forEach((task) => {
        scheduleEmail(user, task.dueDate,task.timeZone); // Schedule email based on the dueDate of the task
      });

      await sendEmail(user);

  
      res.status(201).json({ message: 'Tasks created and scheduled successfully', tasks: createdTasks });
    } catch (error) {
      console.error('Error creating tasks:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Update user by ID
  updateUserById: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const { username, email, password } = req.body;

      // Find user by ID in the database
      const user = await Users.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update user fields
      user.username = username || user.username;
      user.email = email || user.email;
      user.password = password || user.password;

      // Save the updated user to the database
      await user.save();

      res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
      console.error('Error updating user by ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Delete user by ID
deleteUserById: async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    // Find user by ID in the database and remove it
    const deletedUser = await Users.findOneAndDelete({ _id: userId });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    console.error('Error deleting user by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
},
};

export default UserController;
