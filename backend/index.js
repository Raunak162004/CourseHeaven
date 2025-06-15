import express from 'express';
import dotenv from 'dotenv';
import db from './config/db.js';
import { v2 as cloudinary } from 'cloudinary';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';

        // import all routes
import courseRoutes from './routes/course.route.js';
import userRoutes from './routes/user.route.js';
import adminRoutes from './routes/admin.route.js';


const app = express();

dotenv.config();

               // middleware
app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
}));    
app.use(cookieParser());           

const port = process.env.PORT || 3000;

db();

app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', adminRoutes)

                    // cloudinary configuration code
cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET
});                    

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});