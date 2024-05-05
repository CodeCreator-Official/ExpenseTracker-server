import express from 'express';
import {
    handleGetCurrentUser,
    handleLogin,
    handleLogout,
    handleRegister
} from '../controllers/user.controller.js';
import { handleAuth } from '../middlewares/auth.middleware.js';
const userRoute = express.Router();

userRoute.post('/register', handleRegister)
userRoute.post('/login', handleLogin)
userRoute.get('/current-user', handleAuth, handleGetCurrentUser)
userRoute.post('/logout', handleAuth, handleLogout)

export default userRoute