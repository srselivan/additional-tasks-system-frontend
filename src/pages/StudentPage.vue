<script setup>

import Navbar from "@/components/Navbar.vue";
import PageHeader from "@/components/PageHeader.vue";
import {onMounted, ref} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";

const router = useRouter()
const tasks = ref([])
const marks = ref([])
const tasksPageActive = ref(true)

onMounted(async () => {
  await loadTasks()
})

async function loadTasks() {
  try {
    const response = await axios.get("http://localhost:11225/api/v1/task?limit=10&offset=0");
    tasks.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
}

async function loadMarks() {
  try {
    const response = await axios.get("http://localhost:11225/api/v1/mark?limit=10&offset=0");
    marks.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
}

async function onTaskPageClick() {
  tasks.value = []
  await loadTasks()
  tasksPageActive.value = true
}

async function onMarksPageClick() {
  marks.value = []
  await loadMarks()
  tasksPageActive.value = false
}

function getTaskById(id) {
  return tasks.value.find((task) => task.id === id)
}

</script>

<template>
  <div class="container">
    <navbar></navbar>

    <div class="m-auto w-3/4 mt-4 flex flex-row">
      <page-header
          @click="onTaskPageClick"
          title="Задачи"
          class="hover:cursor-pointer"
          :class="tasksPageActive ? 'border-b-2 border-blue-700' : ''">
      </page-header>
      <page-header
          @click="onMarksPageClick"
          title="Оценки"
          class="ml-5 hover:cursor-pointer"
          :class="tasksPageActive ? '' : 'border-b-2 border-blue-700'">
      </page-header>
    </div>

    <div v-if="tasksPageActive" class="mt-4 m-auto flex w-3/4 flex-col">

      <div
          v-for="task in tasks"
          :key="task.id"
          class="tasks"
          v-if="tasks.length > 0"
          @click="router.push(`/student/tasks/${task.id}`)"
      >
        <div class="p-3 mt-3 flex flex-col border-2">
          <table>
            <tr class="border-b-2">
              <td class="w-32"> Название </td>
              <td> {{ task.title }} </td>
            </tr>
            <tr class="border-b-2">
              <td> Истекает </td>
              <td> {{ task.effectiveTill }} </td>
            </tr>
            <tr>
              <button @click="router.push(`/tasks/${task.id}`)" class="font-semibold hover:text-blue-700">Подробнее</button>
            </tr>
          </table>
        </div>
      </div>

      <div v-else>
        Список задач пуст
      </div>

    </div>

    <div v-else class="mt-4 m-auto flex w-3/4 flex-col">

      <div
          v-for="mark in marks"
          :key="mark.id"
          class="marks"
          v-if="marks.length > 0"
      >
        <div class="p-3 flex flex-col border-2">
          <table>
            <tr class="border-b-2">
              <td class="w-32"> Задание </td>
              <td> {{ getTaskById(mark.taskId).title }} </td>
            </tr>
            <tr class="border-b-2">
              <td> Баллы </td>
              <td> {{ mark.mark }} </td>
            </tr>
            <tr class="border-b-2">
              <td> Комментарий </td>
              <td> {{ mark.comment }} </td>
            </tr>
            <tr>
              <td> Дата </td>
              <td> {{ mark.updatedAt === null ? mark.createdAt : mark.updatedAt }} </td>
            </tr>
          </table>
        </div>
      </div>

      <div v-else >
        Оценок на данный момент нет
      </div>

    </div>

  </div>
</template>

<style scoped>

</style>