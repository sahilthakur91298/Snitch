import { createProduct,getAllProducts } from "../services/product.api";
import { setSellerProducts } from "../state/product.slice";
import {useDispatch} from 'react-redux'

export const useProduct = ()=>{
    const dispatch = useDispatch()

    async function handleCreateProduct(formData){
        const data = await createProduct(formData)
        return data.product
    }

    async function handleGetAllProducts(){
        const data = await getAllProducts()
        dispatch(setSellerProducts(data.products))
        return data.products
    }
    return {handleCreateProduct,handleGetAllProducts}
}