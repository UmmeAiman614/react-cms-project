// app.js
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import dotenv from 'dotenv';
import cors from 'cors';  // <-- Import CORS
import adminRoutes from './routes/admin.js';
import frontendRoutes from './routes/frontend.js';
import authRoutes from "./routes/authRoutes.js";
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


// -------------------- CORS --------------------
app.use(cors({
    origin: 'http://localhost:5173', // frontend URL
    credentials: true,               // allow cookies if needed
}));

// -------------------- Middlewares --------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(flash());

// -------------------- Database --------------------
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('Database connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// -------------------- Routes --------------------
app.use('/admin', adminRoutes);
app.use('/', frontendRoutes);
app.use("/auth", authRoutes);


// -------------------- 404 handler --------------------
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// -------------------- 500 handler --------------------
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Something went wrong' });
});

// -------------------- Start server --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
