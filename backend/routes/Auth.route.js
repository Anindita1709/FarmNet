import express from 'express';
import { loginUser, registerUser, test } from '../controller/user.controller.js';

const router = express.Router();

router.get('/test',test);

router.post('/login',loginUser);
router.post('/register',registerUser);
export default router;