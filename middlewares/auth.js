import jwt from 'jsonwebtoken';
import User from '../models/user.models.js'; // Adjust path as needed

// Authentication middleware
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {

            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        if (!authHeader.startsWith('Bearer ')) {

            return res.status(401).json({
                success: false,
                message: 'Access denied. Invalid token format.'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix


        if (!token) {

            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        // Get user from database
        const user = await User.findById(decoded.userId).select('-password');


        if (!user) {

            return res.status(401).json({
                success: false,
                message: 'Token verification failed. User not found.'
            });
        }

        // Add user info to request
        req.userId = user._id;
        req.user = user;


        next();

    } catch (error) {
        console.error('Authentication error:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token verification failed. Invalid token.'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token verification failed. Token expired.'
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Token verification failed'
        });
    }
};

// Check ownership middleware
export const checkOwnership = (Model) => {
    return async (req, res, next) => {
        try {
            const item = await Model.findById(req.params.id);

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not found'
                });
            }

            // Check if user owns the item
            if (item.author.toString() !== req.userId.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to perform this action'
                });
            }

            req.item = item; // Attach item to request for use in controller
            next();

        } catch (error) {
            console.error('Ownership check error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error during ownership check'
            });
        }
    };
};