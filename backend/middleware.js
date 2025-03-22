import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
import { User, Validator } from './model/model.js';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
configDotenv();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const authenticateUser = ClerkExpressRequireAuth();
export const authenticateValidator = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await Validator.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'Validator not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid authentication token' });
    }
};