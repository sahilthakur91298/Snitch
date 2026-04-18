import {body,validationResult} from 'express-validator'


function validateRequest(req,res,next){
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    next()
}
export const validateRegisterUser = [
    body("email")
    .isEmail().withMessage('Invalid Email address'),
    body('password')
    .isLength({min:6}).withMessage('Password must be atleast 6 chars'),
    body('fullname')
    .notEmpty().withMessage('fullname is required')
    .isLength({min:4}).withMessage('fullname must be atleast 4 letters'),
    body('contact')
    .notEmpty().withMessage('contact is required')
    .matches(/^\d{10}$/).withMessage('Contact number must be a valid 10-digit number'),
    body('isSeller')
    .isBoolean().withMessage('isSeller must be a boolean'),
    validateRequest
]

export const validateLoginUser = [
    body('email')
    .isEmail().withMessage('Invalid Email address'),
    body('password')
    .notEmpty().withMessage('Password is required'),
    validateRequest
]