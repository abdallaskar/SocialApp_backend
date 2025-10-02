import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js'; // adjust path if needed
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import { authLimiter, apiLimiter } from './middlewares/rateLimiter.js';





const app = express();

const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI;

const CorsOrigin = process.env.CORS_ORIGINS || '*';
app.use(cors({ origin: CorsOrigin.split(','), credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(apiLimiter); // Apply standard rate limit to all /api/ routes

// Routes
app.get('/api/health', (req, res) => res.json({ message: 'Server is running!' }));
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/', (req, res) => res.json({ message: 'Welcome to the API' }));

app.use(errorHandler);
app.use(notFound);

// Connect to DB only once (outside handler)
await connectDB(mongoURI).then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

