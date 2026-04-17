import axios from 'axios'

const authAPI = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true,
})

export async function register({fullname,email,password,contact,isSeller}){
    const response = await authAPI.post('/register',{
        fullname,
        email,
        contact,
        password,
        isSeller
    })

    return response.data
}