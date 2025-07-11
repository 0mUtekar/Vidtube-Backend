import {app} from './app.js';
import dotenv from 'dotenv';
import {connectDB} from './database/index.js';
dotenv.config();

const port = process.env.PORT || 8000;

connectDB()
.then(() => {
    console.log("Database connected successfully");
    app.listen(port, () => {
        console.log(`http://localhost:${port}`);
    });
})
.catch((error) => {
    console.error("Database connection failed:", error);
});