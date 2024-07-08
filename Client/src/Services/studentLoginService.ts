import { StudentLoginForm } from "../Components/Student/StudentLogin"
import api from "./api-login"

interface LoginResponse{
    token?: string
    message?:string
}

async function LoginStudentService(data:StudentLoginForm){
    const { username,password} = data

    try{
        const response = await api.post<LoginResponse>("/loginstudent", {username, password})

        if(response.data.token){
            localStorage.setItem('x-auth-token', response.data.token)
        }else{
            throw new Error("Login Failed:" + response.data.message)
        }
    }catch(err:any){
        throw new Error(err)
    }
}

export default LoginStudentService