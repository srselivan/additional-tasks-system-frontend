import SignIn from '@/pages/SignIn.vue'
import SignUp from '@/pages/SignUp.vue'
import AdminPage from "@/pages/AdminPage.vue";
import {createRouter, createWebHistory} from "vue-router";
import StudentPage from "@/pages/StudentPage.vue";
import TeacherPage from "@/pages/TeacherPage.vue";
import {useAuthStore} from "@/store/authStore.js";
import TeacherTaskPage from "@/pages/TeacherTaskPage.vue";
import TeachersTaskAnswerPage from "@/pages/TeachersTaskAnswerPage.vue";
import StudentTaskPage from "@/pages/StudentTaskPage.vue";

const routes = [
    {
        path: '/sign-in',
        component: SignIn
    },
    {
        path: '/sign-up',
        component: SignUp
    },

    {
        path: '/student',
        component: StudentPage
    },
    {
        path: '/student/tasks/:id',
        component: StudentTaskPage
    },

    {
        path: '/admin',
        component: AdminPage
    },

    {
        path: '/teacher',
        component: TeacherPage
    },
    {
        path: '/teacher/tasks/:id',
        component: TeacherTaskPage
    },
    {
        path: '/teacher/tasks/:task_id/answer/:answer_id',
        component: TeachersTaskAnswerPage
    },
]

const router = createRouter({
    routes,
    history: createWebHistory(),
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    if (to.path === from.path) {
        next(false)
    }
    else if (to.path === "/sign-in" || to.path === "/sign-up") {
        next()
    }
    else if (!authStore.isLoggedIn) {
        next({path: "/sign-in"})
    }
    else {
        next()
    }
})


export default router;