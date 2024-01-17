import express = require('express');

import { register, login } from '../controllers/authController';

const app = express();


const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router;
