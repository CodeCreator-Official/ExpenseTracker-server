import express from 'express';
import { handleAuth } from '../middlewares/auth.middleware.js';
import {
    handleCreateExpense,
    handleDeleteExpense,
    handleGetAllExpense,
    handleGetExpenseByCategoryName, 
    handleGetExpensesInGroup
} from '../controllers/expense.controller.js';
const expenseRoute = express.Router();

expenseRoute.post('/', handleAuth, handleCreateExpense)
expenseRoute.get('/', handleAuth, handleGetAllExpense)
expenseRoute.delete('/:id', handleAuth, handleDeleteExpense)
expenseRoute.get('/category/:name', handleAuth, handleGetExpenseByCategoryName)
expenseRoute.get('/group', handleAuth, handleGetExpensesInGroup)

export default expenseRoute