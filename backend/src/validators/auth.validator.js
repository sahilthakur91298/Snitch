import {body, validationResult} from 'express-validator'


function validateRequest(req,res,next){
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    next()
}
export const validateRegisterUser = [
    body('email')
    .isEmail().withMessage('Invalid email format'),
    body('password')
    .isLength({min : 6}).withMessage('Password must be at least 6 characters long'),
    body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({min : 3}).withMessage('Name must contain at least 3 characters'),
    body('contact')
    .notEmpty().withMessage('Contact number is required')
    .matches(/^\d{10}$/).withMessage('Contact number must be a valid 10-digit number'),
    validateRequest
]