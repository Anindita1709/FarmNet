import express from 'express';
import { loginUser, registerUser, test } from '../controller/user.controller.js';
import { loginFarmer,registerFarmer } from '../controller/FarmerController.js';

const router = express.Router();

router.get('/test',test);

router.post('/login',loginUser);
router.post('/register',registerUser);
router.post('/registerFarmer', registerFarmer);
router.post('/loginFarmer', loginFarmer);
export default router;