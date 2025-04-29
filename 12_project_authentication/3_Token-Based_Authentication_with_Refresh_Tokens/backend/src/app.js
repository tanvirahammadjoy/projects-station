// app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import userRoutes from './routes/user.route.js';

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json()); // To parse JSON body
app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(cookieParser());

// API Routes
app.use("/api/users", userRoutes); // any /api/users routes go to userRoutes

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running...' });
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
