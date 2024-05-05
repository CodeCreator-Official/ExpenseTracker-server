import { pool } from "../index.js"


export async function handleCreateExpense(req, res) {
    try {
        const { category_name, expense_name, amount } = req.body
        const email = req?.user?.email
        const date = Date.now()

        if (!(
            category_name.trim() &&
            expense_name.trim() && amount
        )) {
            throw new Error('All fields are required')
        }

        const isCategoryDefined = await pool.query(
            'SELECT * FROM budget_category WHERE email = $1 AND name = $2',
            [email, category_name]
        )

        if (isCategoryDefined.rowCount == 0) {
            throw new Error('Category is not defined')
        }

        const newExpense = await pool.query(
            'INSERT INTO expense (category, date, expense_name, expense_amount,email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [category_name, date, expense_name, amount, email]
        )

        return res
            .json({
                data: newExpense.rows[0],
                message: 'New expense added!!',
                success: true
            })

    } catch (error) {
        console.error(error.message)
        return res.
            json({
                error: error.message,
                success: false
            })
    }
}

export async function handleGetAllExpense(req, res) {
    try {
        const email = req?.user?.email

        const allExpenses = await pool.query(
            'SELECT * FROM expense WHERE email = $1 ORDER BY date DESC',
            [email]
        )

        const totalExpenseResult = await pool.query(
            'SELECT SUM(expense_amount) AS total_expense FROM expense WHERE email = $1',
            [email]
        );

        return res
            .json({
                data: allExpenses.rows,
                rowCount: allExpenses.rowCount,
                message: 'Fetched all expenses',
                total_expense: totalExpenseResult.rows[0].total_expense || 0,
                success: true
            })

    } catch (error) {
        console.error(error.message)
        return res.
            json({
                error: error.message,
                success: false
            })
    }
}

export async function handleDeleteExpense(req, res) {
    try {
        const { id } = req.params

        if (!id) {
            throw new Error('Expense Id is required')
        }

        await pool.query(
            'DELETE FROM expense WHERE expense_id = $1',
            [id]
        )

        return res
            .json({
                message: 'Expense deleted!!',
                success: true
            })

    } catch (error) {
        console.error(error.message)
        return res.
            json({
                error: error.message,
                success: false
            })
    }
}

export async function handleGetExpenseByCategoryName(req, res) {
    try {
        const { name } = req.params
        const email = req?.user?.email

        if (!name.trim()) {
            throw new Error('Category name is required')
        }

        const response = await pool.query(
            'SELECT * FROM expense WHERE category = $1 AND email = $2',
            [name, email]
        )

        return res
            .json({
                data: response.rows,
                rowCount: response.rowCount,
                message: `All expenses for category ${name} were fetched!!`,
                success: true
            })
    } catch (error) {
        console.error(error.message)
        return res.
            json({
                error: error.message,
                success: false
            })
    }
}

export async function handleGetExpensesInGroup(req, res, next) {
    try {
        const email = req?.user?.email

        const response = await pool.query(
            'SELECT e.category, json_agg(e) as expenses, bc.amount budget_amount, COALESCE(SUM(e.expense_amount), 0) as total_spent FROM expense e LEFT JOIN budget_category bc ON e.category = bc.name AND e.email = bc.email WHERE e.email = $1 GROUP BY e.category, bc.amount',
            [email]
        )

        console.log(response)

        return res
            .json({
                data: response.rows,
                rowCount: response.rowCount,
                message: `All expenses are fetched in group`,
                success: true
            })

    } catch (error) {
        console.error(error.message)
        return res.
            json({
                error: error.message,
                success: false
            })
    }
}