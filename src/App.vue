<script setup>
import { useAuthStore } from '@/store/authStore'

const authStore = useAuthStore()

const loadUserInfo = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  if (userInfo) {
    authStore.signIn({
      accessToken: userInfo.accessToken,
      refreshToken: userInfo.refreshToken,
    })
  }
  console.log("Successfully load user info from local storage")
}

loadUserInfo()
</script>

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style scoped>

</style>