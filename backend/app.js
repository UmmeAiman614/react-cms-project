import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import adminRoutes from './routes/admin.js';
import frontendRoutes from './routes/frontend.js';

dotenv.config();

const app = express();

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
   origin: 'http://localhost:5173', // your React app URL
    credentials: true
}));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Database connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api', frontendRoutes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ message: 'API route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong'
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
