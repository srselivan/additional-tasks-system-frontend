<script setup>
import { useRoute, useRouter } from 'vue-router'

import {onMounted, ref} from "vue";
import axios from "axios";
import PageHeader from "@/components/PageHeader.vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseLabel from "@/components/BaseLabel.vue";
import BigButton from "@/components/BigButton.vue";
import {USER_ROLES} from "@/consts.js";
import VueSelect from "vue3-select-component";

const email = ref('')
const password = ref('')
const firstName = ref('')
const lastName = ref('')
const middleName = ref('')
const groupName = ref('')

const groups = ref([])
const router = useRouter()

onMounted(async () => {
  await getGroups()
})

async function getGroups() {
  try {
    const response = await axios.get("http://localhost:11225/api/v1/group?limit=10&offset=0");
    groups.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
}

async function signUp() {
  try {
    await axios.post(
        "http://localhost:11225/api/v1/sign-up",
        {
          "email": email.value,
          "password": password.value,
          "firstName": firstName.value,
          "lastName": lastName.value,
          "middleName": middleName.value,
          "roleId": USER_ROLES.student,
          "groupId": groupName.value,
        }
    )
    router.push('/sign-in')
  } catch (err) {
    alert("Не удалось зарегистрироваться")
    console.log(err);
  }
}


function getItemsForGroupsSelect() {
  return groups.value.map(item => ({
    label: item.name,
    value: item.id
  }))
}

</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <form class="relative flex flex-col rounded-xl bg-transparent bg-clip-border text-gray-700 shadow-none w-1/3 gap-1">
      <page-header title="Регистрация" class="mb-4"> </page-header>

      <base-label text="Фамилия"></base-label>
      <base-input placeholder="Фамилия" v-model="lastName"></base-input>

      <base-label text="Имя"></base-label>
      <base-input placeholder="Имя" v-model="firstName"></base-input>

      <base-label text="Отчество"></base-label>
      <base-input placeholder="Отчество" v-model="middleName"></base-input>

      <base-label text="Группа"></base-label>
      <vue-select
          v-model="groupName"
          :options="getItemsForGroupsSelect()"
          :is-multi="false"
          placeholder="Выбрать ответ"
      >
      </vue-select>

      <base-label text="Email"></base-label>
      <base-input placeholder="Email" v-model="email" type="email"></base-input>

      <base-label text="Password"></base-label>
      <base-input placeholder="Password" v-model="password" type="password"></base-input>

      <big-button @click="signUp" text="Зарегистроваться" class="mt-6"></big-button>
    </form>
  </div>
</template>

<style scoped>

</style>