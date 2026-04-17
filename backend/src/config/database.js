import mongoose from 'mongoose';
import { config } from './config.js';

const connecttodb = async () => {
  await mongoose.connect(config.MONGO_URI);
  console.log('MongoDB connected');
};

export default connecttodb;
