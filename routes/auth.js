import express from 'express';
import { validateUserRegistration, validateUserLogin } from '../middlewares/validation.js';
import { authenticate } from '../middlewares/auth.js';
import { register, login, logout, getMe } from '../controllers/authController.js';


const router = express.Router();


// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateUserRegistration, register);

// @route   POST /api/auth/login
// @desc    Login user and return JWT token
// @access  Public
router.post('/login', validateUserLogin, login);

// @route   POST /api/auth/logout
// @desc    Logout user (clear token client-side mainly)
// @access  Private
router.post('/logout', authenticate, logout);

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authenticate, getMe);

// @route   GET /api/auth/verify-token
// @desc    Verify JWT token and return user data (alias for /me)
// @access  Private
router.get('/verify-token', authenticate, getMe);


export default router;