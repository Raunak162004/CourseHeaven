import express from 'express';
import dotenv from 'dotenv';
import db from './config/db.js';

const app = express();

dotenv.config();

const port = process.env.PORT || 3000;

app.get('/', (req,res) => {
    res.send('Hello, World!');
})

db();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});