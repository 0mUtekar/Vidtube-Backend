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
import {router as channelRouter} from './routes/channels.routes.js';
import {router as commentRouter} from './routes/comments.routes.js';
import {router as likeRouter} from './routes/likes.routes.js';
import {router as videoRouter} from './routes/videos.routes.js';
import {router as playlistRouter} from './routes/playlists.routes.js';
//routes
app.use('/api/v1/test', statusRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/channel', channelRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/videos', videoRouter);
app.use('/api/v1/playlists', playlistRouter);
export {app}