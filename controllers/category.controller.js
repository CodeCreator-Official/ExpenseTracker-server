import { pool } from "../index.js" 

export async function handleCreateCategory(req, res) {
    try {
        const { category_name, amount } = req.body
        const email = req?.user?.email

        if (!(
            category_name.trim() &&
            amount > 0
        )) {
            throw new Error('Category must be provided and Amount must be greater than zero')
        }

        const isCategoryAlreadyExist = await pool.query(
            'SELECT * FROM budget_category WHERE name = $1',
            [category_name]
        )

        if (isCategoryAlreadyExist.rowCount != 0) {
            throw new Error(`${category_name} already exists`)
        }

        const newCategory = await pool.query(
            'INSERT INTO budget_category (name, amount,email) VALUES ($1, $2, $3) RETURNING *',
            [category_name, amount, email]
        )

        return res
            .json({
                data: newCategory.rows[0],
                message: 'Added new category!!',
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

export async function handleGetCategory(req, res) {
    try {
        const email = req?.user?.email

        const allCategories = await pool.query(
            'SELECT * FROM budget_category WHERE email = $1',
            [email]
        )

        return res
            .json({
                data: allCategories.rows,
                rowCount: allCategories.rowCount,
                message: 'Fetched all categories!!',
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