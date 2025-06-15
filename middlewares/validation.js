import { body, param, query, validationResult } from 'express-validator';

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            field: error.path || error.param,
            message: error.msg,
            value: error.value
        }));

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errorMessages
        });
    }

    next();
};

// User Registration Validation
const validateUserRegistration = [
    body('fullName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Full name must be between 2 and 50 characters'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 6, max: 20 })
        .withMessage('Password must be between 6 and 20 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    body('profileImage')
        .optional()
        .isURL()
        .withMessage('Profile image must be a valid URL'),

    body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio must not exceed 500 characters'),

    handleValidationErrors
];

// User Login Validation
const validateUserLogin = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    handleValidationErrors
];

// Update Profile Validation
const validateProfileUpdate = [
    body('fullName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Full name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Full name can only contain letters and spaces'),

    body('profileImage')
        .optional()
        .isURL()
        .withMessage('Profile image must be a valid URL'),

    body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio must not exceed 500 characters'),

    handleValidationErrors
];

// Post Creation Validation
const validatePostCreation = [
    body('postTitle')
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Post title must be between 3 and 200 characters'),

    body('postDescription')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Post description must be between 10 and 2000 characters'),

    body('postImageUrl')
        .optional()
        .isURL()
        .withMessage('Post image must be a valid URL'),

    handleValidationErrors
];

// Post Update Validation
const validatePostUpdate = [
    body('postTitle')
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Post title must be between 3 and 200 characters')
        .matches(/^[a-zA-Z0-9\s\-_.,!?()]+$/)
        .withMessage('Post title contains invalid characters'),

    body('postDescription')
        .optional()
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Post description must be between 10 and 2000 characters'),

    body('postImageUrl')
        .optional()
        .isURL()
        .withMessage('Post image must be a valid URL'),

    handleValidationErrors
];

// MongoDB ObjectId Validation
const validateObjectId = (paramName = 'id') => [
    param(paramName)
        .isMongoId()
        .withMessage(`Invalid ${paramName} format`),

    handleValidationErrors
];

// Pagination Validation
const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1, max: 1000 })
        .withMessage('Page must be a positive integer between 1 and 1000'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),

    query('sort')
        .optional()
        .isIn(['createdAt', '-createdAt', 'title', '-title', 'updatedAt', '-updatedAt'])
        .withMessage('Invalid sort field'),

    handleValidationErrors
];



// File Upload Validation (if using multer)
const validateFileUpload = (fieldName, allowedTypes = ['image/jpeg', 'image/png', 'image/gif'], maxSize = 5 * 1024 * 1024) => {
    return (req, res, next) => {
        if (!req.file && !req.files) {
            return next();
        }

        const file = req.file || (req.files && req.files[fieldName]);

        if (!file) {
            return next();
        }

        // Check file type
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({
                success: false,
                message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
            });
        }

        // Check file size
        if (file.size > maxSize) {
            return res.status(400).json({
                success: false,
                message: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`
            });
        }

        next();
    };
};




export {
    handleValidationErrors,
    validateUserRegistration,
    validateUserLogin,
    validateProfileUpdate,
    validatePostCreation,
    validatePostUpdate,
    validateObjectId,
    validatePagination,
    validateFileUpload,

};