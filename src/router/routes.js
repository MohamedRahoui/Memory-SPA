import guards from '../helpers/middlewares'

export default [
  {
    path: '/',
    name: 'home',
    component: () => import('pages/index'),
    beforeEnter: guards.Guest
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('pages/auth/register'),
    beforeEnter: guards.Guest
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/auth/login'),
    beforeEnter: guards.Guest
  },
  {
    path: '/app',
    name: 'app',
    component: () => import('pages/app/index'),
    beforeEnter: guards.Auth
  },
  {
    path: '/experiments',
    name: 'experiments',
    component: () => import('pages/app/experiments'),
    beforeEnter: guards.Auth
  },
  {
    path: '/experiment/:id',
    name: 'experiment-detail',
    component: () => import('pages/app/experiment')
  },
  {
    path: '/questions',
    name: 'staff-questions',
    component: () => import('pages/staff/questions'),
    beforeEnter: guards.Staff
  },
  {
    path: '/moods',
    name: 'staff-moods',
    component: () => import('pages/staff/moods'),
    beforeEnter: guards.Staff
  },
  {
    path: '/messages',
    name: 'staff-messages',
    component: () => import('pages/staff/messages'),
    beforeEnter: guards.Staff
  },
  {
    path: '/staff',
    name: 'staff-index',
    component: () => import('pages/staff/experiments'),
    beforeEnter: guards.Staff
  },
  { // Always leave this as last one
    path: '*',
    name: 'notFound',
    component: () => import('pages/404')
  }
]
