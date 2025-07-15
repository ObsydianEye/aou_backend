import mongoose from 'mongoose';
import envConfig from '../utils/envConfgi';

export const connectDB = async () => {
    try {
        await mongoose.connect(envConfig.MONGO_URI);
        console.log('✅ Database connected');
    } catch (err) {
        console.error('❌ Database connection error:', err);
        throw err;
    }
};
