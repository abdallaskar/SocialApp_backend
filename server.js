import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
// Import routes
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
// Import middlewares
import { errorHandler, notFound } from './middlewares/errorHandler.js';

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGINS?.split(','),
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check (put this first) for testing server status
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Routes - THESE MUST COME BEFORE ERROR HANDLING MIDDLEWARE
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// Connect to MongoDB
connectDB(MONGODB_URI).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

// Error handling middleware 
app.use(errorHandler);
// 404 handler for undefined routes
app.use(notFound);