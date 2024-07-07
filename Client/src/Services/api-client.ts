import axios from "axios";

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/'
})

apiClient.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem('x-auth-token')
        if(token){
            config.headers['x-auth-token'] = token
        }
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }

)


export default apiClient
