import User from '../models/user.models.js';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '1d'
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { fullName, email, password, profileImage, bio } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists'
            });
        }

        // Create new user
        const user = await User.create({
            fullName,
            email,
            password,
            profileImage,
            bio
        });

        // Generate token
        const token = generateToken(user._id);

        // Remove password from response
        const userResponse = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            profileImage: user.profileImage,
            bio: user.bio,
            createdAt: user.createdAt
        };

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: userResponse,
            token
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Registration failed'
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please enter both email and password'
            });
        }

        // Find user and include password for comparison
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'No account found with this email address'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect password'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Remove password from response
        const userResponse = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            profileImage: user.profileImage,
            bio: user.bio,
            createdAt: user.createdAt
        };

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: userResponse,
            token
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Login failed'
        });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const userResponse = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            profileImage: user.profileImage,
            bio: user.bio,
            createdAt: user.createdAt
        };

        res.status(200).json({
            success: true,
            user: userResponse
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get user profile'
        });
    }
};

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logout successful'
    });
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const { fullName, profileImage, bio } = req.body;

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update fields if provided
        if (fullName) user.fullName = fullName;
        if (profileImage !== undefined) user.profileImage = profileImage;
        if (bio !== undefined) user.bio = bio;

        await user.save();

        const userResponse = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            profileImage: user.profileImage,
            bio: user.bio,
            createdAt: user.createdAt
        };

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: userResponse
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update profile'
        });
    }
};