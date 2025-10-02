import rateLimit from 'express-rate-limit';


// Standard rate limit for most API requests
// Allows 100 requests per IP address per 15 minutes
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    statusCode: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
})
// A stricter rate limit for critical/sensitive endpoints like login/signup
// Allows 5 requests per IP address per 5 minutes
export const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    statusCode: 429,
    message: 'Too many authentication attempts from this IP, please try again after 5 minutes.',
});

// Note: By default, express-rate-limit uses the user's IP address (req.ip)
// to identify the client, which is what you want.