import { defineStore } from "pinia";
import { ref } from "vue";
import {jwtDecode} from "jwt-decode";

export const useAuthStore = defineStore('auth', () => {
    const userInfo = ref({
        accessToken: '',
        refreshToken: '',
        fullName: '',
        role: 0,
    })
    const isLoggedIn = ref(false);

    const signIn = (data) => {
        const decoded = jwtDecode(data.accessToken);
        userInfo.value = {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            fullName: decoded.name,
            role: decoded.role,
        }
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
        isLoggedIn.value = true
    }

    const logout = () => {
        userInfo.value = {
            accessToken: '',
            refreshToken: '',
            fullName: '',
            role: 0,
        }
        isLoggedIn.value = false
        localStorage.removeItem('userInfo')
    }

    return {
        signIn,
        logout,
        userInfo,
        isLoggedIn,
    }
})