import axios from "axios"
import useAuthStore from "../store/useAuthStore"

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? 'http://localhost:5123/api' : '/api',
    withCredentials: true
})

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response.status === 401 && error.response.data.message === "Token expired"){
            const { logout } = useAuthStore().get()
            logout()
            localStorage.clear()
            window.location.pathname = "/login"
        }
        return Promise.reject(error)
    }
)