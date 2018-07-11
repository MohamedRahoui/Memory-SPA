<template>
  <div @keyup.enter="login">
    <div class="row">
      <div class="offset-md-3 col-md-6 form">
        <h4>Login</h4>
        <q-field icon="mail" :error="$bool(errors.email)"
                 :error-label="$get('email.0', errors)">
          <q-input float-label="Email" v-model="form.email"/>
        </q-field>
        <q-field icon="lock" :error="$bool(errors.password)"
                 :error-label="$get('password.0', errors)">
          <q-input float-label="Password" v-model="form.password"
                   type="password"/>
        </q-field>
      </div>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        label="Login"
        color="primary"
        icon="send"
        @click="login"
        :loading="loading"
      />
    </q-page-sticky>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        email: '',
        password: ''
      },
      loading: false,
      errors: {}
    }
  },
  methods: {
    login () {
      this.errors = {}
      this.loading = true
      this.$axios.post('login', this.form)
        .then((res) => {
          this.$store.dispatch('login', res.data.api_token).then(() => {
            this.$store.dispatch('setMe', res.data).then(() => {
              this.$router.push({name: 'app'})
            })
          })
        }, err => {
          this.loading = false
          if (err.response.status === 422) {
            this.errors = err.response.data.errors
          }
        })
    }
  }
}
</script>
