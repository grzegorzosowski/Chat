require('dotenv').config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import apiRouter from './routes/api';
import { initAuthentication } from './authentication';
import './db/mongoose';
import webSocketController from './controllers/webSocketController';
import { sessionMiddleware } from './sessionMiddleware';

const secret = process.env.SECRET || 'default-secret-key';

const app = express();
const staticPath = path.join(__dirname, 'public');

app.use(express.static(staticPath));
app.use(cookieParser(secret));
app.use(sessionMiddleware);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
initAuthentication(app);
app.use('/', apiRouter);

webSocketController(app);
