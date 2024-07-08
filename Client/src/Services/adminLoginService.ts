import api from "./api-login";

interface LoginResponse {
  token?: string;
  message?: string;
}

async function AdminLoginService(data: any) {
    const { username, password } = data;

    try {
        const response = await api.post<LoginResponse>('/adminlogin', { username, password });

        if (response.data.token) {
            localStorage.setItem('x-auth-token', response.data.token);
            
            
        } else {
            throw new Error(`Login Failed: ${response.data.message || "No token received."}`);
        }

    } catch (err:any) {
        throw new Error(err);
    }
}

export default AdminLoginService;
