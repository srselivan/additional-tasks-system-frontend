<script setup>
import {useRouter} from "vue-router";

const router = useRouter()
</script>

<template>
  <p @click="router.back()" class="text-gray-500 hover:text-black hover:cursor-pointer">
    Назад
  </p>
</template>

<style scoped>

</style>