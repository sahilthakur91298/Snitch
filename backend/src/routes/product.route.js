import { Router } from 'express'
import { authenticateSeller } from '../middlewares/auth.middleware.js'
import { createProduct, getProducts } from '../controllers/product.controller.js'
import multer, { memoryStorage } from "multer"
import { validateCreateProduct } from '../validators/product.validator.js'


const upload = multer({
    storage: memoryStorage(),
    limits: {
        fileSize: 5 * 1024*1024
    }
})
const router = Router()

router.post('/',authenticateSeller,upload.array('images',7),validateCreateProduct,createProduct)

router.get('/seller',authenticateSeller,getProducts)

export default router