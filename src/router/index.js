import Vue from 'vue'
import Router from 'vue-router'

import { ArticleState } from '@/config/article'
// Containers
import Full from '@/containers/Full'
import Admin from '@/containers/Admin'
import Construction from '@/containers/Construction'

// Views
import Home from '@/views/Home'
import Project from '@/views/Project'
import Dashboard from '@/views/Dashboard'
import Catograph from '@/views/Catograph'

const Contact = () => import(/* webpackChunkName: "other" */ '@/views/Contact')
const About = () => import(/* webpackChunkName: "other" */ '@/views/About')
const NotFound = () => import(/* webpackChunkName: "page" */ '@/views/pages/NotFound')

// Admin
const PostRecord = () => import(/* webpackChunkName: "admin" */ '@/views/PostRecord')
const Post = () => import(/* webpackChunkName: "admin" */ '@/views/Post')
const Editor = () => import(/* webpackChunkName: "admin" */ '@/views/Editor')
const Periodic = () => import(/* webpackChunkName: "admin" */ '@/views/Periodic')
const Login = () => import(/* webpackChunkName: "admin" */ '@/views/pages/Login')
const Media = () => import(/* webpackChunkName: "admin" */ '@/views/medias/index')

Vue.use(Router)

export default new Router({
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/admin/',
      redirect: '/admin/articles',
      name: 'Admin',
      component: Admin,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'post/',
          name: 'Post',
          component: Post
        },
        {
          path: 'post/:uuid',
          name: 'Edit',
          component: Post
        },
        {
          path: 'articles',
          name: 'PostRecord',
          component: PostRecord,
          redirect: 'board'
        },
        {
          path: 'craft',
          name: 'Craft',
          component: PostRecord,
          props: {
            pageState: ArticleState.CRAFT
          }
        },
        {
          path: 'trash',
          name: 'Trash',
          component: PostRecord,
          props: {
            pageState: ArticleState.TRASH
          }
        },
        {
          path: 'board',
          name: 'OnBoard',
          component: PostRecord,
          props: {
            pageState: ArticleState.BOARD
          }
        },
        {
          path: 'black',
          name: 'BlackHistory',
          component: PostRecord,
          props: {
            pageState: ArticleState.BLACK
          }
        },
        {
          path: 'editor',
          name: 'Editor',
          component: Editor
        },
        {
          path: 'periodic',
          name: 'Periodic',
          component: Periodic
        },
        {
          path: 'medias',
          name: 'Medias',
          component: Media
        }
      ]
    },
    {
      path: '/',
      name: 'Product',
      component: Full,
      children: [
        {
          path: '/',
          name: 'Home',
          component: Home
        },
        {
          path: '/about',
          name: 'About',
          component: About
        },
        {
          path: '/contact',
          name: 'Contact',
          component: Contact
        },
        {
          path: '/project/:uuid/',
          name: 'Project',
          component: Project
        }
        // todo: articleDetail
      ]
    },
    {
      path: '/construction',
      name: 'Dev',
      component: Construction,
      children: []
    },
    {
      path: '/cat',
      name: 'Cat',
      component: Catograph,
      children: []
    },
    {
      path: '/auth/login',
      name: 'LoginPage',
      component: Login,
      children: []
    },
    {
      path: '*',
      name: '404',
      component: NotFound
    }
  ]
})
