import express = require('express');

const app = express();

import { scheduleTask } from '../controllers/taskController';

const router = express.Router();

router.post('/schedule', scheduleTask);

export default router;
