import express from 'express';
import dotenv from 'dotenv';
import pg from 'pg';
dotenv.config()
import cors from 'cors'
import userRoute from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import categoryRoute from './routes/category.routes.js';
import expenseRoute from './routes/expense.routes.js';

const PORT = process.env.PORT || 3000;
const app = express();

// DB CONFIG
export const pool = new pg.Pool({
    connectionString: process.env.POSTGRES_URL
})

// DB CONNECTION
pool
    .connect()
    .then(() => {
        console.log('🍀 Database connection established')
    })
    .catch(err => {
        console.error(err.message)
    })

// MIDDLEWARES
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors({}))
app.use(cookieParser())

// ROUTES
app.use('/auth', userRoute)
app.use('/category', categoryRoute)
app.use('/expense', expenseRoute)

// Listening on server
app.listen(PORT, () => {
    console.log(`⚙️ listening on http://localhost:${PORT}`);
})