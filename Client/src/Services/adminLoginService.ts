import apiClient from "./api-client"

interface LoginResponse{
    token?:string
    message?:string
}


async function AdminLoginService(data:any){
    const{ email, password} = data

    try{
        const response = await apiClient.post<LoginResponse>('/adminlogin', {email, password})

        if(response.data.token){
            localStorage.setItem('x-auth-token', response.data.token)

        
        }else{
            throw new Error(`Login Failed:${response.data.message} || "No token recived"`)
        }
    }
    catch(err){
        throw new Error("Login Failed!")
    }
}

export default AdminLoginService