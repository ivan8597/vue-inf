import { createRouter, createWebHistory } from 'vue-router'
import ClientList from '../components/ClientList.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: ClientList
  },
  {
    path: '/clients',
    name: 'clients',
    component: ClientList
  },
  {
    path: '/clients/new',
    name: 'new-client',
    component: () => import('../components/ClientForm.vue')
  },
  {
    path: '/clients/:id',
    name: 'edit-client',
    component: () => import('../components/ClientForm.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 