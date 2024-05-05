import { pool } from "../index.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const cookieOptions = {
    httpOnly: true,
    secure: true
}

export async function handleRegister(req, res) {
    try {
        const { fullname, email, password } = req.body

        if (!(
            fullname.trim() &&
            email.trim() &&
            password.trim()
        )) {
            throw new Error('All fields are required')
        }

        const isUserExist = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        )

        if (isUserExist.rowCount != 0) {
            throw new Error('User already exists with this email')
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await pool.query(
            'INSERT INTO users (fullname, email, password) values ($1, $2, $3) RETURNING user_id, fullname, email',
            [fullname, email, hashedPassword]
        )

        if (!newUser.rowCount) {
            throw new Error('New user creation failed')
        }

        return res
            .json({
                data: newUser.rows[0],
                message: 'New user created!!',
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

export async function handleLogin(req, res) {
    try {
        const { email, password } = req.body

        if (!(email && password)) {
            throw new Error('All fields are required')
        }

        const userInDB = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        )

        if (!userInDB.rowCount) {
            throw new Error('User does not exist')
        }

        const isPasswordCorrect = await bcrypt.compare(
            password, userInDB.rows[0].password
        )

        if (!isPasswordCorrect) {
            throw new Error('Password is incorrect')
        }

        const cookie = jwt.sign(
            {
                id: userInDB.rows[0].user_id,
                fullname: userInDB.rows[0].fullname,
                email: userInDB.rows[0].email,
                avatar: userInDB.rows[0].avatar
            },
            process.env.COOKIE_TOKEN_KEY
        )

        console.log(cookie)

        return res
            .cookie('userCookie', cookie, cookieOptions)
            .json({
                data: userInDB.rows[0],
                message: 'User login successfull!!',
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

export async function handleGetCurrentUser(req, res) {
    try {
        return res
            .json({
                data: req.user,
                message: 'Fetched current user',
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

export async function handleLogout(req, res) {
    try {
        return res
            .clearCookie('userCookie')
            .json({
                message: 'User logged out',
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