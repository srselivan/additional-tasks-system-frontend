<script setup>
import {ref} from "vue";
import axios from "axios";
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore} from "@/store/authStore.js";
import { USER_ROLES } from "@/consts.js";

const email = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

async function signIn() {
  try {
    const {data} = await axios.post(
        "http://localhost:11225/api/v1/sign-in",
        {
          "email": email.value,
          "password": password.value
        },
    );

    authStore.signIn({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    })

    switchPageByRole(authStore.userInfo.role)

  } catch (error) {
    console.log(error);
    clearForm()
    alert("Неверно указана почта или пароль")
  }
}

function signUp() {
  clearForm()
  router.push("/sign-up")
}

function switchPageByRole(role) {
  switch (role) {
    case USER_ROLES.administrator: {
      router.push("/admin")
      return
    }
    case USER_ROLES.teacher: {
      router.push("/teacher")
      return
    }
    case USER_ROLES.student: {
      router.push("/student")
      return
    }
  }
}

function clearForm() {
  email.value = ''
  password.value = ''
}

</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <form class="relative flex flex-col rounded-xl bg-transparent bg-clip-border text-gray-700 shadow-none" @submit.prevent>
      <h4 class="block font-sans text-2xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
        Вход
      </h4>
      <div class="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
        <div class="mb-4 flex flex-col gap-6">
          <div class="relative h-11 w-full min-w-[200px]">
            <input
                v-model="email"
                class="peer h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-blue-700 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                placeHolder=" "
            />
            <label class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-700 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-blue-700 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-blue-700 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Email
            </label>
          </div>
          <div class="relative h-11 w-full min-w-[200px]">
            <input
                v-model="password"
                type="password"
                class="peer h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-blue-700 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                placeHolder=" "
            />
            <label class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-700 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-blue-700 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-blue-700 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Пароль
            </label>
          </div>
        </div>
        <button
            @click="signIn"
            class="mt-6 block w-full select-none rounded-lg bg-blue-700 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-700/20 transition-all hover:shadow-lg hover:shadow-blue-700/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            data-ripple-light="true"
        >
          Войти
        </button>
        <p class="mt-4 block text-center font-sans text-base font-normal leading-relaxed text-gray-700 antialiased">
          Ещё нет аккаунта?
          <button @click="signUp" class="font-semibold text-blue-700 transition-colors hover:text-orange-500">
            Зарегистрироваться
          </button>
        </p>
      </div>
    </form>
  </div>
</template>

<style scoped>
</style>