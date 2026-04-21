import dotenv from 'dotenv'

dotenv.config()

if(!process.env.MONGO_URI){
    throw new Error("MongoDb URI is not found in environment variable")
}

if(!process.env.JWT_SECRET){
    throw new Error('JWT secret is not found in environment variable')
}
if(!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET){
    throw new Error('Google OAuth credentials are not found in environment variable')
}
if(!process.env.IMAGEKIT_PRIVATE_KEY){
    throw new Error("ImageKit credentials not found in environment variable")
}

export const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY
}