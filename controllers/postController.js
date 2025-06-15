import Post from '../models/post.models.js';


// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'fullName profileImage')
            .sort({ createdAt: -1 });

        // Format posts to match frontend structure
        const formattedPosts = posts.map(post => ({
            postId: post._id,
            userId: post.author._id,
            userName: post.author.fullName,
            userImageUrl: post.author.profileImage,
            createdAt: post.createdAt,
            postTitle: post.title,
            postDescription: post.description,
            postImageUrl: post.imageUrl
        }));

        res.status(200).json({
            success: true,
            posts: formattedPosts
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get posts'
        });
    }
};

// @desc    Get current user's posts
// @route   GET /api/posts/my-posts
// @access  Private
export const getMyPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.userId })
            .populate('author', 'fullName profileImage')
            .sort({ createdAt: -1 });

        // Format posts to match frontend structure
        const formattedPosts = posts.map(post => ({
            postId: post._id,
            userId: post.author._id,
            userName: post.author.fullName,
            userImageUrl: post.author.profileImage,
            createdAt: post.createdAt,
            postTitle: post.title,
            postDescription: post.description,
            postImageUrl: post.imageUrl
        }));

        res.status(200).json({
            success: true,
            posts: formattedPosts
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get your posts'
        });
    }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
export const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'fullName profileImage');

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Format post to match frontend structure
        const formattedPost = {
            postId: post._id,
            userId: post.author._id,
            userName: post.author.fullName,
            userImageUrl: post.author.profileImage,
            createdAt: post.createdAt,
            postTitle: post.title,
            postDescription: post.description,
            postImageUrl: post.imageUrl
        };

        res.status(200).json({
            success: true,
            post: formattedPost
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get post'
        });
    }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
    try {
        const { title, description, imageUrl } = req.body;

        // Validation
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: 'Title and description are required'
            });
        }

        // Create post
        const post = await Post.create({
            title,
            description,
            imageUrl,
            author: req.userId
        });

        // Get post with author details
        const populatedPost = await Post.findById(post._id)
            .populate('author', 'fullName profileImage');

        // Format post to match frontend structure
        const formattedPost = {
            postId: populatedPost._id,
            userId: populatedPost.author._id,
            userName: populatedPost.author.fullName,
            userImageUrl: populatedPost.author.profileImage,
            createdAt: populatedPost.createdAt,
            postTitle: populatedPost.title,
            postDescription: populatedPost.description,
            postImageUrl: populatedPost.imageUrl
        };

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            post: formattedPost
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create post'
        });
    }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res) => {
    try {
        const { title, description, imageUrl } = req.body;

        // Find post
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check if user owns the post
        // if (post.author.toString() !== req.userId) {
        //     return res.status(403).json({
        //         success: false,
        //         message: 'Not authorized to update this post'
        //     });
        // }

        // Update post
        if (title) post.title = title;
        if (description) post.description = description;
        if (imageUrl !== undefined) post.imageUrl = imageUrl;

        await post.save();

        // Get updated post with author details
        const updatedPost = await Post.findById(post._id)
            .populate('author', 'fullName profileImage');

        // Format post to match frontend structure
        const formattedPost = {
            postId: updatedPost._id,
            userId: updatedPost.author._id,
            userName: updatedPost.author.fullName,
            userImageUrl: updatedPost.author.profileImage,
            createdAt: updatedPost.createdAt,
            updatedAt: updatedPost.updatedAt,
            postTitle: updatedPost.title,
            postDescription: updatedPost.description,
            postImageUrl: updatedPost.imageUrl
        };

        res.status(200).json({
            success: true,
            message: 'Post updated successfully',
            post: formattedPost
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update post'
        });
    }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
    try {
        // Find post
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check if user owns the post
        // if (post.author.toString() !== req.userId) {
        //     return res.status(403).json({
        //         success: false,
        //         message: 'Not authorized to delete this post'
        //     });
        // }

        // Delete post
        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Post deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete post'
        });
    }
};