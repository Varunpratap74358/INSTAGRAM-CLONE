import jwt from 'jsonwebtoken'
import { User } from '../models/userModel.js';

const isAuthenticated = async(req,res,next)=>{
    try {
        const {token} = req.cookies;
        if(!token){
            return res.status(400).json({ 
                success:false,
                message:"User not logedin"
             })
        }

        const decode = await jwt.verify(token,"&^^^5jhg%^^676gg")
        req.id = decode.userId
        next()
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export default isAuthenticated