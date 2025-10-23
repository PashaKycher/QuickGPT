import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
    let token = req.headers.authorization

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const userId = decoded.id
        const user = await User.findById(userId).select('-password')

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                error: true, 
                message: "User not found" 
            })
        }

        req.user = user
        next()
    } catch (error) {
         res.status(401).json({
            success: false,
            error: true,
            message: "Not authorized, token failed"
         })
    }
}