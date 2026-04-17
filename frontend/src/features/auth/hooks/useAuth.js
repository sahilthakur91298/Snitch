import {setUser,setLoading,setError} from '../state/auth.slice.js'
import { register } from '../services/auth.api.js'
import {useDispatch} from 'react-redux'

const useAuth = ()=>{
    const dispatch = useDispatch()

    async function handleRegister({fullname,email,contact,password,isSeller = false}){
        const data = await register({email,password,contact,fullname,isSeller})
        dispatch(setUser(data.user))
    }

    return { handleRegister }

}
