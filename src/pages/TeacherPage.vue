<script setup>

import PageHeader from "@/components/PageHeader.vue";
import Navbar from "@/components/Navbar.vue";
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import RouteBackButton from "@/components/RouteBackButton.vue";
import BaseLabel from "@/components/BaseLabel.vue";
import BaseInput from "@/components/BaseInput.vue";
import BigButton from "@/components/BigButton.vue";
import DialogSmall from "@/components/DialogSmall.vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import "vue3-select-component/dist/style.css";
import VueSelect from "vue3-select-component";
import DialogWide from "@/components/DialogWide.vue";
import {USER_ROLES} from "@/consts.js";
import {useRouter} from "vue-router";

const router = useRouter()

const tasksPageIsActive = ref(true)
const addTaskPageIsActive = ref(false)
const addFileModalIsActive = ref(false)

const tasks = ref([])
const groups = ref([])
const students = ref([])

const taskTitleInput = ref('')
const taskTextInput = ref('')
const taskEffectiveFromInput = ref();
const taskEffectiveTillInput = ref();
const taskRecipientsUserIds = ref([])
const taskRecipientsGroupIds = ref([])

const uploadedFiles = ref([])
const selectedFile = ref(null)

onMounted(async () => {
  await loadTasks()
})

async function loadTasks() {
  try {
    const response = await axios.get("http://localhost:11225/api/v1/task?limit=10&offset=0&creator=true");
    tasks.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
}

async function loadGroups() {
  try {
    const response = await axios.get("http://localhost:11225/api/v1/group?limit=10&offset=0");
    groups.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
}

async function loadStudents() {
  try {
    const response = await axios.get("http://localhost:11225/api/v1/user?limit=10&offset=0&roleId=" + USER_ROLES.student);
    students.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
}

async function onTasksPageClick() {
  tasksPageIsActive.value = true
  addTaskPageIsActive.value = false

  await loadTasks()
  groups.value = []
  students.value = []
}

async function onAddTaskPageClick() {
  tasksPageIsActive.value = false
  addTaskPageIsActive.value = true

  await loadGroups()
  await loadStudents()

  tasks.value = []
}

function onAddFileClick() {
  addFileModalIsActive.value = true
}

function onCancelModalClick() {
  addFileModalIsActive.value = false
}

function onFileChange(event) {
  selectedFile.value = event.target.files[0];
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
      document.getElementById('uploadForm').reset();
      uploadedFiles.value.push({name: response.data.name, id: response.data.id});
      addFileModalIsActive.value = false
    }

  } catch (error) {
    console.error('Ошибка загрузки файла:', error);
  }
}

async function onDeleteFileClick(id) {
  uploadedFiles.value = uploadedFiles.value.filter(item => item.id !== id);
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

function formatDateToISOString(date) {
  console.log(date)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // добавляем ведущий ноль, если месяц < 10
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}

function getItemsForGroupsSelect() {
  return groups.value.map(item => ({
    label: item.name,
    value: item.id
  }))
}

function getItemsForStudentsSelect() {
  return students.value.map(item => ({
    label: item.firstName + " " + item.middleName + " " + item.lastName,
    value: item.id
  }))
}

async function onSubmitTaskCreateClick() {
  try {

    const response = await axios.post("http://localhost:11225/api/v1/task", {
      groupIds: taskRecipientsGroupIds.value,
      userIds: taskRecipientsUserIds.value,
      fileIds: uploadedFiles.value.map(file => file.id),
      title: taskTitleInput.value,
      text: taskTextInput.value,
      effectiveFrom: formatDateToISOString(taskEffectiveFromInput.value),
      effectiveTill: formatDateToISOString(taskEffectiveTillInput.value),
    })

    if (response.status === 201) {
      groups.value = []
      students.value = []
      uploadedFiles.value = []
      taskEffectiveTillInput.value = null
      taskEffectiveFromInput.value = null
      taskTitleInput.value = ''
      taskTextInput.value = ''
      taskRecipientsUserIds.value = []
      taskRecipientsGroupIds.value = []
      alert("Задача успешно создана")
      onTasksPageClick()
    }

  } catch (error) {
    console.error('Ошибка создания задачи:', error);
  }
}

</script>

<template>
  <dialog-small :show="addFileModalIsActive" class="z-50">
    <div class="">
      <form @submit.prevent ref="fileInputForm" id="uploadForm" class="w-full h-full flex flex-col justify-end items-center">
        <input
            type="file"
            class=""
            @change="onFileChange"
        >
        <button @click="onCancelModalClick" type="reset" class="mt-20 font-semibold text-blue-700">
          Отмена
        </button>
        <button @click="onSubmitFileInput" class="font-semibold text-blue-700">
          Добавить
        </button>
      </form>
    </div>
  </dialog-small>


  <div class="container">
    <navbar></navbar>

    <div class="m-auto w-3/4 mt-4 flex flex-row">
      <page-header
          @click="onTasksPageClick"
          title="Задания"
          class="hover:cursor-pointer"
          :class="tasksPageIsActive ? 'border-b-2 border-blue-700' : ''">
      </page-header>
      <page-header
          @click="onAddTaskPageClick"
          title="Добавление задания"
          class="ml-5 hover:cursor-pointer"
          :class="addTaskPageIsActive ? 'border-b-2 border-blue-700' : ''">
      </page-header>
    </div>


    <div v-if="tasksPageIsActive" class="mt-4 m-auto flex w-3/4 flex-col">

      <div
          v-for="task in tasks"
          :key="task.id"
          class="tasks"
          v-if="tasks.length > 0"
      >
        <div class="p-3 mt-3 flex flex-col border-2">
          <table>
            <tr class="border-b-2">
              <td class="w-32"> Название </td>
              <td> {{ task.title }} </td>
            </tr>
            <tr class="border-b-2">
              <td class="w-32"> Открыто с/по </td>
              <td> {{ task.effectiveFrom + " - " + task.effectiveTill }} </td>
            </tr>
            <tr>
              <button @click="router.push(`/teacher/tasks/${task.id}`)" class="font-semibold hover:text-blue-700">Подробнее</button>
            </tr>
          </table>
        </div>
      </div>

      <div v-else>
        Список задач пуст
      </div>

    </div>


    <div v-if="addTaskPageIsActive" class="m-auto w-3/4 mt-4 flex flex-col">
      <h1 class="text-xl font-sans font-semibold"> Создание новой задачи </h1>

      <div class="mt-3 flex flex-col items-start justify-start gap-2">


        <div class="w-2/3 mt-1">
          <base-label text="Заголовок"></base-label>
          <base-input class="mt-1" type="text" v-model="taskTitleInput" placeholder="Заголовок"></base-input>
        </div>

        <div class="w-2/3 flex flex-col">
          <base-label text="Описание"></base-label>
          <textarea
              v-model="taskTextInput"
              class="rounded-md border h-60 mt-1 p-3 w-full font-sans text-sm font-normal text-blue-gray-700 outline outline-0"
              placeHolder="Описание"
          />
        </div>

        <div class="w-full">
          <base-label text="Файлы"></base-label>
          <div class="mt-1 p-3 rounded-md border max-h-80 w-full flex flex-col overflow-y-auto justify-start items-start">
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

        <div class="w-full">
          <div class="w-2/3 flex flex-col gap-1">
            <base-label text="Открыто с"></base-label>
            <VueDatePicker
                v-model="taskEffectiveFromInput"
                :min-date="new Date()"
                prevent-min-max-navigation
                time-picker-inline
                minutes-increment="5"
                locale="ru" cancelText="Отмена" selectText="Выбрать"
            ></VueDatePicker>

            <base-label text="Открыто по"></base-label>
            <VueDatePicker
                v-model="taskEffectiveTillInput"
                :min-date="taskEffectiveFromInput"
                prevent-min-max-navigation
                time-picker-inline
                minutes-increment="5"
                locale="ru" cancelText="Отмена" selectText="Выбрать"
            ></VueDatePicker>
          </div>
        </div>

        <div class="mt-1 w-full">
          <div class="flex flex-col gap-1 justify-start items-start">
            <base-label text="Получатели"></base-label>
            <div class="mt-1 w-2/3 flex flex-col gap-1">
              <base-label text="Выбор группы "></base-label>
              <vue-select
                  v-model="taskRecipientsGroupIds"
                  :options="getItemsForGroupsSelect()"
                  :is-multi="false"
              >
              </vue-select>

              <base-label class="mt-3" text="Выбор студентов "></base-label>
              <vue-select
                  v-model="taskRecipientsUserIds"
                  :options="getItemsForStudentsSelect()"
                  :is-multi="true"
              >
              </vue-select>
            </div>
          </div>
        </div>

        <div class="w-52 my-10">
          <big-button @click="onSubmitTaskCreateClick" text="Создать задачу"></big-button>
        </div>

      </div>

    </div>

  </div>
</template>

<style scoped>
</style>