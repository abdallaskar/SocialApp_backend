import express from 'express';
import { validateObjectId } from '../middlewares/validation.js';
import { getUserProfile, getUserPosts } from '../controllers/userController.js';

const router = express.Router();

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/:id', validateObjectId('id'), getUserProfile);
// @route   GET /api/users/:id/posts
// @desc    Get posts by specific user
// @access  Public
router.get('/:id/posts', validateObjectId('id'), getUserPosts);

export default router;