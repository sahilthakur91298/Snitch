import dotenv from 'dotenv';
dotenv.config();

if(!process.env.MONGO_URI) {
    throw new Error('MongoDB connection URI is not defined in environment variables')
}
if(!process.env.JWT_TOKEN) {
    throw new Error('JWT token is not defined in environment variables')
}

export const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_TOKEN: process.env.JWT_TOKEN
}