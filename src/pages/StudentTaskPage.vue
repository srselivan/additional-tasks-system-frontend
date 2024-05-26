<script setup>
import { useRoute, useRouter } from 'vue-router'
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import Navbar from "@/components/Navbar.vue";
import RouteBackButton from "@/components/RouteBackButton.vue";
import PageHeader from "@/components/PageHeader.vue";
import DialogWide from "@/components/DialogWide.vue";
import DialogSmall from "@/components/DialogSmall.vue";

const route = useRoute()
const task = ref({})
const taskAttachedFiles = ref([])
const show = ref(false)

const taskPageIsActive = ref(true)

const fileInputForm = ref(null)
const uploadedFiles = ref([])
const selectedFile = ref(null)

const commentary = ref('')

const answer = ref(null)
const hasAnswer = ref(false)
const answerAttachedFiles = ref([])

onMounted(async () => {
  await getTask()
  await getAnswer()
})

async function getTask() {
  try {
    const response = await axios.get("http://localhost:11225/api/v1/task/" + route.params.id);
    task.value = response.data.task;
    taskAttachedFiles.value = response.data.attachedFiles
  } catch (error) {
    console.log(error);
  }
}

async function getAnswer() {
  try {
    const response = await axios.get("http://localhost:11225/api/v1/answer?taskId=" + route.params.id);
    if (response.status === 200) {
      answer.value = response.data.answer
      commentary.value = answer.value.comment
      answerAttachedFiles.value = response.data.attachedFiles
      uploadedFiles.value = response.data.attachedFiles
      hasAnswer.value = true
    }
  } catch (error) {
    console.log(error);
  }
}

async function loadAnswerDetails() {
  uploadedFiles.value = []

  for (const fileId of answerAttachedFiles.value) {
    const response = await axios.get("http://localhost:11225/api/v1/file/" + fileId)
    uploadedFiles.value.push({name: response.data.name, id: response.data.id})
  }

  commentary.value = answer.value.comment
}

function onTaskPageClick() {
  taskPageIsActive.value = true
}

function onAnswerPageClick() {
  taskPageIsActive.value = false
}

function onCancelClick() {
  show.value = false
}

function onAddFileClick() {
  show.value = true
}

async function onSubmitFileInput() {
  try {
    const formData = new FormData();
    formData.append('file', selectedFile.value);
    formData.append('body', JSON.stringify({}));

    const response = await axios.post("http://localhost:11225/api/v1/file", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.status === 201) {
      selectedFile.value = null
      fileInputForm.value = null
      document.getElementById('uploadForm').reset();
      uploadedFiles.value.push({name: response.data.name, id: response.data.id});
      show.value = false
    }

  } catch (error) {
    console.error('Ошибка загрузки файла:', error);
  }
}

function onFileChange(event) {
  selectedFile.value = event.target.files[0];
}

async function onDeleteFileClick(id) {
  uploadedFiles.value = uploadedFiles.value.filter(item => item.id !== id);
}

async function onSaveAnswerClick() {
  if (answer.value !== null) {
    await updateAnswer()
  } else {
    await saveNewAnswer()
  }
}

async function updateAnswer() {
  try {
    const response = await axios.put("http://localhost:11225/api/v1/answer/" + answer.value.id, {
      comment: commentary.value,
      files: uploadedFiles.value.map(file => file.id),
    })
    if (response.status === 202) {
      show.value = false
      answer.value.comment = commentary.value
      answer.value.attachedFiles = uploadedFiles.value.map(file => file.id)
      alert('Ответ изменен!')
    }
  } catch (err) {
    console.log(err)
  }
}

async function saveNewAnswer() {
  try {
    let requestBody = ''

    if (commentary.value.length > 0) {
      requestBody = JSON.stringify({
        taskId: parseInt(route.params.id),
        comment: commentary.value,
        files: uploadedFiles.value.map(file => file.id)
      })
    } else {
      requestBody = JSON.stringify({
        taskId: parseInt(route.params.id),
        files: uploadedFiles.value.map(file => file.id)
      })
    }

    const response = await axios.post("http://localhost:11225/api/v1/answer", requestBody);

    if (response.status === 201) {
      uploadedFiles.value = []
      fileInputForm.value = null
      selectedFile.value = null
      show.value = false
      await getAnswer()
      alert("Ответ добавлен")
    }

  } catch (error) {
    console.error(error);
  }
}

async function onDeleteAnswerClick() {
  try {
    const response = await axios.delete("http://localhost:11225/api/v1/answer/" + answer.value.id)
    if (response.status === 202) {
      answer.value = null
      hasAnswer.value = false
      uploadedFiles.value = []
      commentary.value = ''
    }
  } catch (err) {
    console.log(err);
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
  <dialog-small :show="show">
    <div class="">
      <form @submit.prevent ref="fileInputForm" id="uploadForm" class="w-full h-full flex flex-col justify-end items-center">
        <input
            type="file"
            class=""
            @change="onFileChange"
        >
        <button @click="onCancelClick" type="reset" class="mt-20 font-semibold text-blue-700">
          Отмена
        </button>
        <button @click="onSubmitFileInput" class="font-semibold text-blue-700">
          Добавить
        </button>
      </form>
    </div>
  </dialog-small>

  <div >
    <navbar></navbar>
    <div class="m-auto w-3/4 mt-4 flex flex-row">
      <page-header
          @click="onTaskPageClick"
          title="Задание"
          class="hover:cursor-pointer"
          :class="taskPageIsActive ? 'border-b-2 border-blue-700' : ''">
      </page-header>
      <page-header
          @click="onAnswerPageClick"
          title="Ответ на задание"
          class="ml-5 hover:cursor-pointer"
          :class="taskPageIsActive ? '' : 'border-b-2 border-blue-700'">
      </page-header>
    </div>

    <div v-if="taskPageIsActive" class="m-auto w-3/4 mt-4 flex flex-col">
      <div class="flex flex-col items-start justify-start border-b-2 pb-3">
        <h1 class="text-xl font-sans font-semibold"> Название </h1>
        <h3> {{ task.title }}</h3>
      </div>

      <div class="flex flex-col items-start justify-start py-3">
        <h3 class="text-xl font-sans font-semibold leading-snug">Описание</h3>
        <p>{{ task.text }}</p>
      </div>

      <div class="flex flex-col items-start justify-start py-3">
        <h1 class="text-xl font-sans font-semibold"> Прикрепленные файлы </h1>
        <div class="mt-3 p-3 border-2 max-h-80 w-full flex flex-col overflow-y-auto">
          <table class="" v-for="(file, index) in taskAttachedFiles" :key="file.id">
            <tr class="w-1/3" :class=" index !== taskAttachedFiles.length - 1 ? 'border-b-2' : '' ">
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

    <div v-else class="m-auto w-3/4 mt-4 flex flex-col">
      <div class="flex flex-col items-start justify-start pb-3">
        <h1 class="text-xl font-sans font-semibold"> Прикрепленные файлы </h1>
        <div class="mt-3 p-3 border-2 max-h-80 w-full flex flex-col overflow-y-auto justify-start items-start">
          <table class="" v-for="(file, index) in uploadedFiles" :key="file.id">
            <tr class="display flex-row" :class=" index !== uploadedFiles.length - 1 ? 'border-b-2' : '' ">
              <td class="w-10/12"> {{ file.name}} </td>
              <td class="w-36"> <button @click="onDeleteFileClick(file.id)" class="text-red-600 font-semibold">Удалить файл</button> </td>
              <td> <button @click="onDownloadClick(file.id, file.name)" class="text-grey-700 font-semibold">Скачать</button> </td>
            </tr>
          </table>
          <button @click="onAddFileClick" class="font-semibold text-blue-700">
            Добавить
          </button>
        </div>
      </div>

      <div class="flex flex-col items-start justify-start pb-3">
        <h1 class="text-xl font-sans font-semibold"> Комментарий </h1>
        <div class="mt-3 max-h-80 w-full flex flex-col overflow-y-auto justify-start items-start">
          <textarea
              v-model="commentary"
              class="border-2 p-3 w-2/3"
              placeHolder=""
          />
        </div>
      </div>

      <div class="flex flex-col items-start justify-start pb-3">
        <button @click="onSaveAnswerClick" class="font-semibold text-blue-700">
          Сохранить ответ
        </button>
        <button @click="onDeleteAnswerClick" class="font-semibold text-blue-700">
          Сбросить
        </button>
      </div>

    </div>

  </div>
</template>

<style scoped>

</style>