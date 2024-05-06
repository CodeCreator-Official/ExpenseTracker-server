import express from 'express';
import { handleAuth } from '../middlewares/auth.middleware.js';
import {
    handleCreateCategory,
    handleGetCategory
} from '../controllers/category.controller.js';
const categoryRoute = express.Router(); 

categoryRoute.post('/', handleAuth, handleCreateCategory)
categoryRoute.get('/', handleAuth, handleGetCategory)

export default categoryRoute