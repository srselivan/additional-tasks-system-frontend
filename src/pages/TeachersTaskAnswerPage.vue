<script setup>

import PageHeader from "@/components/PageHeader.vue";
import Navbar from "@/components/Navbar.vue";
import {onMounted, ref} from "vue";
import axios from "axios";
import RouteBackButton from "@/components/RouteBackButton.vue";
import {useRoute} from "vue-router";
import BaseInput from "@/components/BaseInput.vue";

const route = useRoute()

const answerPageIsActive = ref(true)
const markPageIsActive = ref(false)

const answer = ref({})
const answerAttachedFiles = ref([])
const hasAnswer = ref(false)
const user = ref({})
const group = ref({})


const markBallInputValue = ref(0)
const markCommentaryInputValue = ref('')

onMounted(async () => {
  await loadAnswer()
})

async function loadAnswer() {
  try {
    const response = await axios.get("http://localhost:11225/api/v1/answer/" + route.params.answer_id);
    if (response.status === 200) {
      answer.value = response.data.answer
      answerAttachedFiles.value = response.data.attachedFiles
      hasAnswer.value = true

      await loadUser()
    }
  } catch (error) {
    console.log(error);
  }
}

async function loadUser() {
  try {
    const response = await axios.get("http://localhost:11225/api/v1/user/" + answer.value.userId);
    if (response.status === 200) {
      user.value = response.data
      await loadGroupById(user.value.groupId)
    }
  } catch (error) {
    console.log(error);
  }
}

async function loadGroupById(id) {
  try {
    const response = await axios.get("http://localhost:11225/api/v1/group/" + id);
    console.log(response)
    group.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

async function onAnswerPageClick() {
  answerPageIsActive.value = true
  markPageIsActive.value = false

  await loadAnswer()
}

async function onMarkPageClick() {
  answerPageIsActive.value = false
  markPageIsActive.value = true

  hasAnswer.value = false
  answer.value = null
  answerAttachedFiles.value = []
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

async function onSaveMarkClick() {
  try {
    const response = await axios.post("http://localhost:11225/api/v1/mark", {
      answerId: parseInt(route.params.answer_id),
      mark: roundBall(markBallInputValue.value),
      comment: markCommentaryInputValue.value
    });
    if (response.status === 201) {
      alert("Оценка сохранена")
    }
  } catch (error) {
    console.log(error);
  }
}

function roundBall(ball) {
  if (ball < 0) {
    return 0;
  }
  if (ball > 100) {
    return 100
  }
  return ball
}

</script>

<template>

  <div>

    <navbar></navbar>
    <div class="m-auto w-3/4 mt-4 flex flex-row">
      <page-header
          @click="onAnswerPageClick"
          title="Ответ"
          class="hover:cursor-pointer"
          :class="answerPageIsActive ? 'border-b-2 border-blue-700' : ''">
      </page-header>
      <page-header
          @click="onMarkPageClick"
          title="Оценка"
          class="ml-5 hover:cursor-pointer"
          :class="markPageIsActive ? 'border-b-2 border-blue-700' : ''">
      </page-header>
    </div>


    <div v-if="answerPageIsActive" class="m-auto w-3/4 mt-4 flex flex-col">

      <div class="flex flex-col items-start justify-start ">
        <h1 class="text-xl font-sans font-semibold"> Ответ загружен пользователем </h1>
        <h3> {{ user.firstName + " " + user.middleName + " " + user.lastName }} </h3>
      </div>

      <div class="flex flex-col items-start justify-start pt-3">
        <h3 class="text-xl font-sans font-semibold leading-snug">Группа</h3>
        <p>{{ group.name }}</p>
      </div>

      <div class="flex flex-col items-start justify-start pt-3">
        <h3 class="text-xl font-sans font-semibold leading-snug">Дата последнего изменения </h3>
        <p>{{ answer.updatedAt === null ? answer.createdAt : answer.updatedAt }}</p>
      </div>

      <div class="flex flex-col items-start justify-start pt-3">
        <h1 class="text-xl font-sans font-semibold"> Прикрепленные файлы </h1>
        <div class="mt-3 p-3 border-2 max-h-80 w-full flex flex-col overflow-y-auto">
          <table class="" v-for="(file, index) in answerAttachedFiles" :key="file.id">
            <tr class="w-1/3" :class=" index !== answerAttachedFiles.length - 1 ? 'border-b-2' : '' ">
              <td> {{ file.name}} </td>
              <td class="flex flex-row-reverse gap-1">
                <button @click="onDownloadClick(file.id, file.name)" class=" text-grey-700 font-semibold">Скачать</button>
              </td>
            </tr>
          </table>
        </div>
      </div>

      <div class="flex flex-col items-start justify-start pt-3 pb-10">
        <h1 class="text-xl font-sans font-semibold"> Комментарий </h1>
        <p>
          {{ answer.comment }}
        </p>
      </div>

      <route-back-button></route-back-button>
    </div>



    <div v-if="markPageIsActive" class="m-auto w-3/4 mt-4 flex flex-col">

      <div class="flex flex-col items-start justify-start ">
        <h1 class="text-xl font-sans font-semibold"> Баллы (1 - 100) </h1>
        <input
            class="mt-1 peer h-full w-30 rounded-md border border-blue-gray-200 bg-transparent p-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-blue-700 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
            v-model="markBallInputValue"
            type="number"
            max="100"
            min="1"
            step="1"
        >
      </div>

      <div class="flex flex-col items-start justify-start mt-3">
        <h1 class="text-xl font-sans font-semibold"> Комментарий </h1>
        <div class="mt-3 max-h-80 w-full flex flex-col overflow-y-auto justify-start items-start">
          <textarea
              v-model="markCommentaryInputValue"
              class="border-2 p-3 w-2/3"
              placeHolder=""
              maxlength="100"
          />
        </div>
      </div>


      <div class="flex flex-col items-start justify-start mt-10">
        <button @click="onSaveMarkClick" class="font-semibold text-blue-700">
          Сохранить оценку
        </button>
      </div>


    </div>


  </div>
</template>

<style scoped>

</style>