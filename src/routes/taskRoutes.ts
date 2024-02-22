// import express = require('express');

// const app = express();

// import { scheduleTask } from '../controllers/taskController';

// const router = express.Router();

// router.post('/schedule', scheduleTask);

// export default router;

// task.route.ts
import express from 'express';
import UserController from '../controllers/taskController';

const router = express.Router();

// Define routes
router.post('/users', UserController.createUser);
router.get('/users/:id', UserController.getUserById);
router.post('/users/multi/:id', UserController.createTasksForUser);
router.put('/users/:id', UserController.updateUserById);
router.delete('/users/:id', UserController.deleteUserById);

export default router;
