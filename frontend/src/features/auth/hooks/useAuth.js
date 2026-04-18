import {setUser,setLoading,setError} from '../state/auth.slice.js'
import { register, login  } from '../services/auth.api.js'
import {useDispatch} from 'react-redux'

export const useAuth = ()=>{
    const dispatch = useDispatch()

    async function handleRegister({fullname,email,contact,password,isSeller = false}){
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await register({email,password,contact,fullname,isSeller})
            dispatch(setUser(data.user))
            return data
        } catch(error) {
            const errorMessage = error.response?.data?.message || error.message || 'Registration failed'
            dispatch(setError(errorMessage))
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({email, password}){
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await login({email, password})
            dispatch(setUser(data.user))
            return data
        } catch(error) {
            const errorMessage = error.response?.data?.message || error.message || 'Login failed'
            dispatch(setError(errorMessage))
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

    return { handleRegister, handleLogin }

}
