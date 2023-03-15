import mongoose from "mongoose";
import { database } from "../config";

mongoose.connect(database);
mongoose.connection.on('connected', () => {
    console.log('MongoDB connection is established');
});

mongoose.connection.on('error', (err) => {
    console.log(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB connection is disconnected');
});