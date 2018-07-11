<template>
  <div id="q-app">
    <q-layout view="hHr LpR lFf" ref="layout">
      <heading/>
      <sidebar/>
      <q-page-container style="min-height: 100vh">
        <router-view/>
        <contact/>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import Header from './components/header'
import Sidebar from './components/sidebar'
import contact from './components/contact'

export default {
  components: {
    'heading': Header,
    'sidebar': Sidebar,
    contact
  },
  data () {
    return {}
  },
  created () {
    this.$axios.defaults.headers.common['Authorization'] = `Bearer ${this.$store.getters.getToken}`
    this.$store.watch(
      state => {
        return state.auth.token
      },
      val => {
        this.$axios.defaults.headers.common['Authorization'] = `Bearer ${val}`
      }
    )
    if (localStorage.token) {
      this.$axios.get('me').then(response => {
        this.$store.dispatch('setMe', response.data)
      })
    } else {
      this.$store.dispatch('setMe', {notAuth: true})
    }
  }
}
</script>
