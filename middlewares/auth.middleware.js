import jwt from 'jsonwebtoken'

export async function handleAuth(req, res, next) {
    try {
        const token = req.cookies?.userCookie

        if (!token) {
            throw new Error('Unauthorized request')
        }

        const decodedToken = jwt.verify(
            token,
            process.env.COOKIE_TOKEN_KEY
        )

        if (!decodedToken) {
            throw new Error('Invalid token')
        }

        req.user = decodedToken
        next()

    } catch (error) {
        throw new Error(error.message);
    }
}