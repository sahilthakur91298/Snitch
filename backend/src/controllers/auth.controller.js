import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'


async function tokenResponse(user,res,message){
    const token = jwt.sign({
        id : user._id
    },config.JWT_SECRET,{
        expiresIn : '7d'
    })

    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    return res.status(200).json({
        message,
        token,
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

    await user.save()
    await tokenResponse(user,res,'User registered succesfully')

    }
    catch(error){
        return res.status(500).json({
            message: 'Server error'
        })

    }
}

export const login = async(req,res)=>{
    const {email,password} = req.body

    try{
        const existingUser = await userModel.findOne({email})
        
        if(!existingUser){
            return res.status(400).json({
                message : 'Invalid email or password'
            })
        }

        const isPasswordValid = await existingUser.comparePassword(password)
        
        if(!isPasswordValid){
            return res.status(400).json({
                message : 'Invalid email or password'
            })
        }

        await tokenResponse(existingUser,res,'Login successful')
    }
    catch(error){
        return res.status(500).json({
            message: 'Server error'
        })
    }
}