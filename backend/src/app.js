import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js'
import productRouter from './routes/product.route.js'
import passport from 'passport'
import { Strategy as GoogleStrategy} from 'passport-google-oauth20'
import cors from 'cors'
import {config} from './config/config.js'


const app = express();

app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/google/callback',
    proxy: true
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));


app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use('/api/auth',authRouter)
app.use('/api/products',productRouter)
export default app;
