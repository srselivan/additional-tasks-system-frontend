import axios from "axios";
import { useAuthStore } from "@/store/authStore";

axios.interceptors.request.use((config) => {
    const methods = ['get', 'post', 'delete', 'put'];
    if (methods.includes(config.method)) {
        const authStore = useAuthStore();
        config.headers['Authorization'] = `Bearer ${authStore.userInfo.accessToken}`;
    }
    return config
})

axios.interceptors.response.use((response) => {
    return response
}, async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const authStore = useAuthStore();
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        const { data } = await axios.post("http://localhost:11225/api/v1/refresh", userInfo.refreshToken)
        authStore.signIn({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
        })
    }
})