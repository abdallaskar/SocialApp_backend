import User from '../models/user.models.js';
import Post from '../models/post.models.js';

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get user's posts count
        const postsCount = await Post.countDocuments({ author: user._id });

        const userProfile = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            profileImage: user.profileImage,
            bio: user.bio,
            postsCount,
            createdAt: user.createdAt
        };

        res.status(200).json({
            success: true,
            user: userProfile
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get user profile'
        });
    }
};

// @desc    Get user's posts by ID
// @route   GET /api/users/:id/posts
// @access  Public
export const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.id })
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
            message: error.message || 'Failed to get user posts'
        });
    }
};

// @desc    Get all users (for admin or search)
// @route   GET /api/users
// @access  Public
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        // Format users and get posts count for each
        const usersWithStats = await Promise.all(
            users.map(async (user) => {
                const postsCount = await Post.countDocuments({ author: user._id });
                return {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    profileImage: user.profileImage,
                    bio: user.bio,
                    postsCount,
                    createdAt: user.createdAt
                };
            })
        );

        res.status(200).json({
            success: true,
            users: usersWithStats
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get users'
        });
    }
};

// @desc    Search users
// @route   GET /api/users/search?q=searchterm
// @access  Public
export const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        // Search users by name or email
        const users = await User.find({
            $or: [
                { fullName: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } }
            ]
        })
            .select('-password')
            .limit(20)
            .sort({ createdAt: -1 });

        // Format users
        const formattedUsers = users.map(user => ({
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            profileImage: user.profileImage,
            bio: user.bio,
            createdAt: user.createdAt
        }));

        res.status(200).json({
            success: true,
            users: formattedUsers
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to search users'
        });
    }
};

// @desc    Check if email exists
// @route   POST /api/users/check-email
// @access  Public
export const checkEmailExists = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        res.status(200).json({
            success: true,
            exists: !!user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to check email'
        });
    }
};