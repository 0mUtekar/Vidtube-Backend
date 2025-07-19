import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();

//common middleware
app.use(
    cors({ 
        origin: process.env.CORS_ORIGIN, // sets the allowed origin for CORS requests
        credentials: true // allows cookies or http authentication to be sent with CORS requests
    })
)
app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true , limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser()); // parses cookies attached to the client request object
//import_routes
import {router as statusRouter} from './routes/status.routes.js';
import {router as userRouter} from './routes/user.routes.js';
//routes
app.use('/api/v1/test', statusRouter);
app.use('/api/v1/user', userRouter);
export {app}