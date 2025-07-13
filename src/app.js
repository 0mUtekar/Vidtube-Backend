import express from 'express';
import cors from 'cors';

const app = express();

//middleware
app.use(
    cors({ 
        origin: process.env.CORS_ORIGIN, // sets the allowed origin for CORS requests
        credentials: true // allows cookies or http authentication to be sent with CORS requests
    })
)
app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true , limit : "16kb"}))
app.use(express.static("public"))


export {app}