import userModel from "../models/user.model.js"
import jwt from 'jsonwebtoken'
import { config } from "../config/config.js"


async function sendToken(user,res,message){
    const token = jwt.sign({
        id : user._id
    },config.JWT_TOKEN,{
        expiresIn : '1d'
    })

    res.cookie("token",token)

    return res.status(200).json({
        message,
        success : true,
        user : {
            id : user._id,
            email : user.email,
            name : user.name,
            contact : user.contact,
            role : user.role
        }
    })
}

export const register = async(req,res)=>{
    const {email,password,name,contact} = req.body

    try{
        const existingUser = await userModel.findOne({
            $or : [
            {email},
            {contact}]
        })
        if(existingUser){
            return res.status(400).json({
                message : 'User with this email or contact already exists'
            })
        }

        const user = new userModel({
            email,
            password,
            name,
            contact
        })

        await sendToken(user,res,'User registered succesfully')

    }catch(err){
        console.log(err)
        return res.status(500).json({message : 'Server error'})
    }
}

