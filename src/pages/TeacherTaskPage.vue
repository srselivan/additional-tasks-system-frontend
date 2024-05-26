<script setup>

import PageHeader from "@/components/PageHeader.vue";
import Navbar from "@/components/Navbar.vue";
import {onMounted, ref} from "vue";
import RouteBackButton from "@/components/RouteBackButton.vue";
import axios from "axios";
import {useRoute, useRouter} from "vue-router";

const route = useRoute()
const router = useRouter()

const taskPageIsActive = ref(true)
const answersPageIsActive = ref(false)

const task = ref({})
const attachedFiles = ref([])
const extendedAnswers = ref([])

onMounted(async () => {
  await loadTask()
})

async function onTaskPageClick() {
  taskPageIsActive.value = true
  answersPageIsActive.value = false

  extendedAnswers.value = []
}

async function onAnswersPageClick() {
  taskPageIsActive.value = false
  answersPageIsActive.value = true

  await loadAnswers()
}

async function loadTask() {
  try {
    const response = await axios.get("http://localhost:11225/api/v1/task/" + route.params.id);
    task.value = response.data.task;
    attachedFiles.value = response.data.attachedFiles;
  } catch (error) {
    console.log(error);
  }
}

async function loadAnswers() {
  try {
    const response = await axios.get("http://localhost:11225/api/v1/answer?limit=10&offset=0&taskId=" + route.params.id);
    extendedAnswers.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
}

async function onDownloadClick(id, filename) {
  const response = await axios.get("http://localhost:11225/api/v1/file/download/" + id, { responseType: 'blob'})
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

</script>

<template>

    <div>

      <navbar></navbar>
      <div class="m-auto w-3/4 mt-4 flex flex-row">
        <page-header
            @click="onTaskPageClick"
            title="Задание"
            class="hover:cursor-pointer"
            :class="taskPageIsActive ? 'border-b-2 border-blue-700' : ''">
        </page-header>
        <page-header
            @click="onAnswersPageClick"
            title="Ответы"
            class="ml-5 hover:cursor-pointer"
            :class="answersPageIsActive ? 'border-b-2 border-blue-700' : ''">
        </page-header>
      </div>

      <div v-if="taskPageIsActive" class="m-auto w-3/4 mt-4 flex flex-col">

        <div class="flex flex-col items-start justify-start border-b-2 pb-3">
          <h1 class="text-xl font-sans font-semibold"> Название </h1>
          <h3> {{ task.title }}</h3>
        </div>

        <div class="flex flex-col items-start justify-start  border-b-2 py-3">
          <h3 class="text-xl font-sans font-semibold leading-snug">Описание</h3>
          <p>{{ task.text }}</p>
        </div>

        <div class="flex flex-col items-start justify-start py-3">
          <h1 class="text-xl font-sans font-semibold"> Прикрепленные файлы </h1>
          <div class="mt-3 p-3 border-2 max-h-80 w-full flex flex-col overflow-y-auto">
            <table class="" v-for="(file, index) in attachedFiles" :key="file.id">
              <tr class="w-1/3" :class=" index !== attachedFiles.length - 1 ? 'border-b-2' : '' ">
                <td> {{ file.name}} </td>
                <td class="flex flex-row-reverse gap-1">
                  <button @click="onDownloadClick(file.id, file.name)" class=" text-grey-700 font-semibold">Скачать</button>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <route-back-button></route-back-button>
      </div>

      <div v-if="answersPageIsActive" class="m-auto w-3/4 mt-4 flex flex-col">

        <div
            v-for="extendedAnswer in extendedAnswers"
            :key="extendedAnswer.answer.id"
            class="tasks"
            v-if="extendedAnswers.length > 0"
        >
          <div class="p-3 mt-3 flex flex-col border-2">
            <table>
              <tr class="border-b-2">
                <td class="w-32"> ФИО </td>
                <td> {{ extendedAnswer.userName }} </td>
              </tr>
              <tr class="border-b-2">
                <td class="w-32"> Дата ответа </td>
                <td> {{ extendedAnswer.answer.updatedAt === null ? extendedAnswer.answer.createdAt : extendedAnswer.answer.updatedAt }} </td>
              </tr>
              <tr class="border-b-2">
                <td class="w-32"> Оценка </td>
                <td> {{ extendedAnswer.mark === null ? 'Ещё не оценено' : extendedAnswer.mark }} </td>
              </tr>
              <tr>
                <button
                    @click="router.push(`/teacher/tasks/${route.params.id}/answer/${extendedAnswer.answer.id}`)"
                    class="font-semibold hover:text-blue-700"
                >Подробнее</button>
              </tr>
            </table>
          </div>
        </div>

        <div v-else>
          Ответов нет
        </div>

      </div>



    </div>

</template>

<style scoped>

</style>