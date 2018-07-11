<template>
  <q-layout-header reveal>
    <q-toolbar class="bg-white" text-color="primary" v-show="guest">
      <q-toolbar-title>
        <div @click="$router.push({name: 'home'})" class="cursor-pointer">
          My memories
        </div>
      </q-toolbar-title>
      <q-btn label="Connection" @click="$router.push({name: 'login'})"
             color="white" text-color="primary"/>&nbsp;
      <q-btn label="Register" @click="$router.push({name: 'register'})"
             color="primary"/>
    </q-toolbar>
    <q-toolbar class="bg-white" text-color="primary" v-show="auth">
      <q-toolbar-title>
        <div @click="$router.push({name: 'home'})" class="cursor-pointer text-primary">
          My memories
        </div>
      </q-toolbar-title>
      <q-btn color="primary" icon-right="arrow_drop_down">
        <q-popover>
          <q-list separator link>
            <q-item v-close-overlay :to="{name: 'experiments'}">
              My experiments
            </q-item>
            <q-item v-close-overlay @click.native="logout">
              Logout
            </q-item>
          </q-list>
        </q-popover>
        {{userName}}
      </q-btn>
    </q-toolbar>
    <q-toolbar class="bg-white" text-color="primary" v-show="staff">
      <q-btn
        flat round
        @click="$root.$emit('toggle-sidebar')"
        icon="menu"
        color="primary"
      />
      <q-toolbar-title>
        <div @click="$router.push({name: 'home'})" class="cursor-pointer">
          My memories
        </div>
      </q-toolbar-title>
      <q-btn @click="logout" label="Logout" color="primary"/>
    </q-toolbar>
  </q-layout-header>
</template>

<script>
export default {
  methods: {
    logout () {
      this.$store.dispatch('logout').then(() => {
        this.$router.push({name: 'home'})
      })
    },
    validateToken (token) {
      return typeof token === 'string' && token.length === 60
    }

  },
  computed: {
    userName () {
      return this.$store.getters.getMe.name
    },
    guest () {
      return !this.validateToken(this.$store.getters.getToken)
    },
    auth () {
      return !this.guest && !this.$store.getters.getMe.is_staff
    },
    staff () {
      return !this.guest && this.$store.getters.getMe.is_staff
    }
  }
}
</script>
