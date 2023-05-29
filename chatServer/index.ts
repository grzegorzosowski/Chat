require('dotenv').config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import apiRouter from './routes/api';
import { initAuthentication } from './authentication';
import './db/mongoose';
import webSocketController from './controllers/webSocketController';
import { sessionMiddleware } from './sessionMiddleware';
import { loginRateLimiter, standardRateLimiter } from './lib/rateLimiter';
import { secret } from './config';
import { apiUnauthorizedAccessMiddleware } from './lib/apiUnauthorizedAccessMiddleware';

if (secret == null) {
    console.warn('Secret does not exist');
}

const app = express();

//For production
const staticPath = path.join(__dirname, 'public');
app.use(express.static(staticPath));
//-------

app.use(cookieParser(secret));
app.use(sessionMiddleware);
app.use(['/api/login/password', '/api/createAccount'], loginRateLimiter);
app.use('/api/', standardRateLimiter);
app.use('/api', apiUnauthorizedAccessMiddleware);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
initAuthentication(app);
app.use('/', apiRouter);

webSocketController(app);
