import Vue from 'vue'
import VueRouter from 'vue-router'
import Calendar from '../views/Calendar.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: { name: 'Calendar' }
  },
  {
    path: '/calendar/:month?/:year?', // parametry month a year nemusi byt vyplneni
    name: 'Calendar', // nazev pro jednodussi praci
    component: Calendar, // componenta obluhujici tutu cestu
    meta: {
      requiresAuth: true // pouze prihlaseny uzvatel muze do teto sekce
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      requiresVisitor: true // prihlaseny uzivatel nemuze prijit na prihlasovaci obrazovku a je presmerovan na /calendar
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: {
      requiresVisitor: true // prihlaseny uzivatel nemuze prijit na registracni obrazovku - osetreno v souboru main.js
    }
  },
  {
    path: '/logout',
    name: 'Logout',
    component: () => import('../views/Logout.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
