<script setup>
import {useAuthStore} from "@/store/authStore.js";
import {computed} from "vue";
import {useRouter} from "vue-router";

const authStore = useAuthStore()
const userName = computed(() => authStore.userInfo.fullName)
const router = useRouter()

function onExitClick() {
  authStore.logout()
  router.push("/sign-in")
}
</script>

<template>
  <div class=" m-auto w-3/4 p-5 bg-blue-700 text-white flex" >
    <p class=""> {{ userName }} </p>
    <p @click="onExitClick" class="ml-auto hover:underline hover:cursor-pointer"> Выйти </p>
  </div>
</template>

<style scoped>

</style>