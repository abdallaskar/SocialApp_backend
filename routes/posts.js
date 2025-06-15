import express from 'express';

import { validateObjectId, validatePagination } from '../middlewares/validation.js';
import { authenticate, checkOwnership } from '../middlewares/auth.js';
import Post from '../models/post.models.js';
import {
    getAllPosts, getMyPosts, getPost, createPost, updatePost, deletePost
} from '../controllers/postController.js';


const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts (home page)
// @access  Public
router.get('/', validatePagination, getAllPosts);

// @route   GET /api/posts/my-posts
// @desc    Get current user's posts
// @access  Private
router.get('/my-posts', authenticate, validatePagination, getMyPosts);

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', authenticate, createPost);

// @route   GET /api/posts/:id
// @desc    Get single post by ID
// @access  Public
router.get('/:id', validateObjectId('id'), getPost);

// @route   PUT /api/posts/:id
// @desc    Update post by ID (only owner)
// @access  Private
router.put('/:id',
    authenticate,
    validateObjectId('id'),
    checkOwnership(Post),
    updatePost
);

// @route   DELETE /api/posts/:id
// @desc    Delete post by ID (only owner)
// @access  Private
router.delete('/:id',
    authenticate,
    validateObjectId('id'),
    checkOwnership(Post),
    deletePost
);

export default router;