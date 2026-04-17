import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { config } from 'dotenv'


async function tokenResponse(user,res,message){
    const token = jwt.sign({
        id : user._id
    },config.JWT_SECRET,{
        expiresIn : '7d'
    })

    return res.status(200).json({
        message,
        user: {
            id: user._id,
            email: user.email,
            fullname: user.fullname,
            contact: user.contact,
            role: user.role
        }
    })
}

export const register = async(req,res)=>{
    const {fullname,email,contact,password,isSeller}= req.body

    try{
        const existingUser = await userModel.findOne({
        $or: [
            {email},
            {contact}
        ]
    })

    if(existingUser){
        return res.status(400).json({
            message : 'User with this email or contact already exists'
        })
    }

    const user = new userModel({
        fullname,
        email,
        contact,
        password,
        role : isSeller ? 'seller' : 'buyer'
    })

    await tokenResponse(user,res,'User registered succesfully')

    }
    catch(error){
        return res.status(500).json({
            message: 'Server error'
        })

    }
}