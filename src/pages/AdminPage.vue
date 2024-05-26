<script setup>
import Navbar from "@/components/Navbar.vue";
import Status403 from "@/components/Status403.vue";
import {useRouter} from "vue-router";
import PageHeader from "@/components/PageHeader.vue";
import {onMounted, ref} from "vue";
import axios from "axios";
import DialogSmall from "@/components/DialogSmall.vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseLabel from "@/components/BaseLabel.vue";
import {USER_ROLES} from "@/consts.js";
import DialogWide from "@/components/DialogWide.vue";

const router = useRouter()

const ratingPageIsActive = ref(false)
const teachersPageIsActive = ref(false)
const groupsPageIsActive = ref(false)
const studentsPageIsActive = ref(true)

onMounted(async () => {
  await loadStudents()
})

const addGroupModalIdNeeded = ref(false)
const addTeacherModalIdNeeded = ref(false)

const groups = ref([])
const groupInputValue = ref('')

const teachers = ref([])
const teacherFirstNameInputValue = ref('')
const teacherMiddleNameInputValue = ref('')
const teacherLastNameInputValue = ref('')
const teacherEmailNameInputValue = ref('')
const teacherPasswordNameInputValue = ref('')

const students = ref([])

function onRatingPageClick() {
  ratingPageIsActive.value = true
  teachersPageIsActive.value = false
  groupsPageIsActive.value = false
  studentsPageIsActive.value = false
}

async function onTeachersPageClick() {
  ratingPageIsActive.value = false
  teachersPageIsActive.value = true
  groupsPageIsActive.value = false
  studentsPageIsActive.value = false

  await loadTeachers()
}

async function onGroupsPageClick() {
  ratingPageIsActive.value = false
  teachersPageIsActive.value = false
  groupsPageIsActive.value = true
  studentsPageIsActive.value = false

  await loadGroups()
}

async function onStudentsPageClick() {
  ratingPageIsActive.value = false
  teachersPageIsActive.value = false
  groupsPageIsActive.value = false
  studentsPageIsActive.value = true

  await loadStudents()
}

async function loadGroups() {
  try {
    const response = await axios.get("http://localhost:11225/api/v1/group?limit=10&offset=0");
    groups.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
}

async function loadTeachers() {
  try {
    const response = await axios.get("http://localhost:11225/api/v1/user?limit=10&offset=0&roleId=" + USER_ROLES.teacher);
    teachers.value = response.data.data;
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

function onAddGroupClick() {
  addGroupModalIdNeeded.value = true
}

function onCancelAddGroupModalClick() {
  addGroupModalIdNeeded.value = false
}

async function onSubmitAddGroupModalClick() {
  try {
    const response = await axios.post(
        "http://localhost:11225/api/v1/group",
        {
          "name": groupInputValue.value,
        }
    );
    if (response.status === 201) {
      addGroupModalIdNeeded.value = false
      groupInputValue.value = ''
      await loadGroups()
    }
  } catch (error) {
    console.log(error);
  }
}

async function onDeleteGroupClick(id) {
  try {
    const response = await axios.delete("http://localhost:11225/api/v1/group/" + id);
    if (response.status === 202) {
      await loadGroups()
    }
  } catch (error) {
    console.log(error);
  }
}

function onAddTeacherClick() {
  addTeacherModalIdNeeded.value = true
}

function onCancelAddTeacherModalClick() {
  addTeacherModalIdNeeded.value = false
}

async function onSubmitAddTeacherModalClick() {
  try {
    const response = await axios.post(
        "http://localhost:11225/api/v1/sign-up",
        {
          "email": teacherEmailNameInputValue.value,
          "password": teacherPasswordNameInputValue.value,
          "firstName": teacherFirstNameInputValue.value,
          "lastName": teacherLastNameInputValue.value,
          "middleName": teacherMiddleNameInputValue.value,
          "roleId": USER_ROLES.teacher,
        }
    )
    if (response.status === 201) {
      addTeacherModalIdNeeded.value = false
      teacherEmailNameInputValue.value = ''
      teacherPasswordNameInputValue.value = ''
      teacherFirstNameInputValue.value = ''
      teacherLastNameInputValue.value = ''
      teacherMiddleNameInputValue.value = ''
      await loadTeachers()
    }
  } catch (error) {
    console.log(error);
  }
}

function onChangeTeacherClick() {

}

function onDeleteTeacherClick() {

}

function onDeleteStudentClick() {

}

function getGroupByGroupId(id) {
  if (groups.value.length === 0) {
    loadGroups()
  }

  const obj = groups.value.find((item) => item.id === id)
  return obj.name
}

</script>

<template>
  <dialog-small :show="addGroupModalIdNeeded">
    <div>
      <form @submit.prevent id="groupInputForm" class="w-full h-full flex flex-col justify-end items-center">
        <base-label text="Название группы"></base-label>
        <base-input class="mt-3" type="text" v-model="groupInputValue"></base-input>
        <button @click="onCancelAddGroupModalClick" type="reset" class="mt-10 font-semibold text-blue-700">
          Отмена
        </button>
        <button @click="onSubmitAddGroupModalClick" class="font-semibold text-blue-700">
          Добавить
        </button>
      </form>
    </div>
  </dialog-small>



  <dialog-wide :show="addTeacherModalIdNeeded">
    <div>
      <form @submit.prevent class="m-auto w-1/3 h-full flex flex-col justify-end items-center gap-2">

        <base-input placeholder="Фамилия" v-model="teacherLastNameInputValue"></base-input>
        <base-input placeholder="Имя" v-model="teacherFirstNameInputValue"></base-input>
        <base-input placeholder="Отчество" v-model="teacherMiddleNameInputValue"></base-input>
        <base-input placeholder="Email" v-model="teacherEmailNameInputValue" type="email"></base-input>
        <base-input placeholder="Password" v-model="teacherPasswordNameInputValue" type="password"></base-input>

        <button @click="onCancelAddTeacherModalClick" type="reset" class="mt-10 font-semibold text-blue-700">
          Отмена
        </button>
        <button @click="onSubmitAddTeacherModalClick" class="font-semibold text-blue-700">
          Добавить
        </button>
      </form>
    </div>
  </dialog-wide>


  <div>
    <navbar></navbar>

    <div class="m-auto w-3/4 mt-4 flex flex-row">
      <page-header
          @click="onRatingPageClick"
          title="Рейтинги"
          class="hover:cursor-pointer"
          :class="ratingPageIsActive ? 'border-b-2 border-blue-700' : ''">
      </page-header>
      <page-header
          @click="onGroupsPageClick"
          title="Группы"
          class="ml-5 hover:cursor-pointer"
          :class="groupsPageIsActive ? 'border-b-2 border-blue-700' : ''">
      </page-header>
      <page-header
          @click="onTeachersPageClick"
          title="Преподаватели"
          class="ml-5 hover:cursor-pointer"
          :class="teachersPageIsActive ? 'border-b-2 border-blue-700' : ''">
      </page-header>
      <page-header
          @click="onStudentsPageClick"
          title="Студенты"
          class="ml-5 hover:cursor-pointer"
          :class="studentsPageIsActive ? 'border-b-2 border-blue-700' : ''">
      </page-header>
    </div>

    <div v-if="groupsPageIsActive" class="mt-4 m-auto flex w-3/4 flex-col">

      <div class="flex flex-col items-start justify-start pb-3">
        <div class="flex flex-row justify-start items-center w-full mb-3">
          <h1 class="text-xl font-sans font-semibold"> Список групп </h1>
          <button @click="onAddGroupClick" class="ml-5 font-semibold text-blue-700 ml-auto">Добавить</button>
        </div>

        <table
            v-for="(group, index) in groups"
            :key="group.id"
            class="w-full"
            v-if="groups.length > 0"
        >
          <tr v-if="index === 0" class="border-b-2 font-semibold">
            <td> Название </td>
          </tr>
          <tr class="border-b-2 flex flex-row">
            <td> {{ group.name }} </td>
            <td class="ml-auto">
              <button @click="onDeleteGroupClick(group.id)" class="font-semibold text-red-500">Удалить</button>
            </td>
          </tr>
        </table>

        <div v-else>
          Список групп пуст
        </div>
      </div>

    </div>

    <div v-else-if="teachersPageIsActive" class="mt-4 m-auto flex w-3/4 flex-col">

      <div class="flex flex-col items-start justify-start pb-3">
        <div class="flex flex-row justify-start items-center w-full mb-3">
          <h1 class="text-xl font-sans font-semibold"> Список преподавателей </h1>
          <button @click="onAddTeacherClick" class="font-semibold text-blue-700 ml-auto">Добавить</button>
        </div>

        <table
            v-for="(teacher, index) in teachers"
            :key="teacher.id"
            class="w-full"
            v-if="teachers.length > 0"
        >
          <tr v-if="index === 0" class="border-b-2 font-semibold">
            <td> ФИО </td>
            <td> Email </td>
          </tr>
          <tr class="border-b-2">
            <td class="w-1/3"> {{ teacher.firstName + " " + teacher.middleName + " " + teacher.lastName }} </td>
            <td> {{ teacher.email }} </td>
            <td class="flex flex-row-reverse gap-1">
              <button @click="onDeleteTeacherClick(teacher.id)" class="font-semibold text-red-500">Удалить</button>
              <button @click="onChangeTeacherClick(teacher.id)" class="font-semibold text-blue-700">Изменить</button>
            </td>
          </tr>
        </table>

        <div v-else>
          Список преподавателей пуст
        </div>
      </div>

    </div>


    <div v-else-if="studentsPageIsActive" class="mt-4 m-auto flex w-3/4 flex-col">

      <div class="flex flex-col items-start justify-start pb-3">
        <div class="flex flex-row justify-start items-center w-full mb-3">
          <h1 class="text-xl font-sans font-semibold"> Список студентов </h1>
        </div>

        <table
            v-for="(student, index) in students"
            :key="student.id"
            class="w-full"
            v-if="students.length > 0"
        >
          <tr v-if="index === 0" class="border-b-2 font-semibold">
            <td> ФИО </td>
            <td> Email </td>
            <td> Группа </td>
          </tr>
          <tr class="border-b-2">
            <td class="w-1/3"> {{ student.firstName + " " + student.middleName + " " + student.lastName }} </td>
            <td> {{ student.email }} </td>
            <td> {{ getGroupByGroupId(student.groupId) }} </td>
            <td class="flex flex-row-reverse gap-1">
              <button @click="onDeleteStudentClick(student.id)" class="font-semibold text-red-500">Удалить</button>
            </td>
          </tr>
        </table>

        <div v-else>
          Список студентов пуст
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>

</style>

<!--<div class="m-auto flex w-3/4 flex-col mt-2">-->
<!--<div class="py-2 " >-->
<!--  <p class="font-sans font-semibold leading-snug hover:cursor-pointer hover:text-orange-500">-->
<!--    Рейтинги-->
<!--  </p>-->
<!--</div>-->
<!--<div class="py-2" >-->
<!--  <p-->
<!--      @click="router.push('/admin/groups')"-->
<!--      class="font-sans font-semibold leading-snug hover:cursor-pointer hover:text-orange-500"-->
<!--  >-->
<!--    Список групп-->
<!--  </p>-->
<!--</div>-->
<!--<div class="py-2" >-->
<!--  <p-->
<!--      @click="router.push('/admin/teachers')"-->
<!--      class="font-sans font-semibold leading-snug hover:cursor-pointer hover:text-orange-500"-->
<!--  >-->
<!--    Список преподавателей-->
<!--  </p>-->
<!--</div>-->
<!--<div class="py-2" >-->
<!--  <p-->
<!--      @click="router.push('/admin/students')"-->
<!--      class="font-sans font-semibold leading-snug hover:cursor-pointer hover:text-orange-500"-->
<!--  >-->
<!--    Список обучающиехся-->
<!--  </p>-->
<!--</div>-->
<!--</div>-->