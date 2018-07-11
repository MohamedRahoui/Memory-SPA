<template>
  <div @keyup.enter="register">
    <div class="row">
      <div class="offset-md-3 col-md-6 form">
        <h4>Register</h4>
        <q-field icon="account_circle" :error="$bool(errors.name)"
                 :error-label="$get('name.0', errors)">
          <q-input float-label="Full name" v-model="form.name"/>
        </q-field>
        <br>
        <q-field icon="mail" :error="$bool(errors.email)"
                 :error-label="$get('email.0', errors)">
          <q-input float-label="Email" v-model="form.email"/>
        </q-field>
        <br>
        <q-field icon="date_range" :error="$bool(errors.age)"
                 :error-label="$get('age.0', errors)">
          <q-input float-label="Age" v-model="form.age" type="number"
                   suffix="years"/>
        </q-field>
        <br>
        <q-field icon="wc" :error="$bool(errors.gender)"
                 :error-label="$get('gender.0', errors)">
          <q-radio v-model="form.gender" val="Male" label="Male"/>
          <q-radio v-model="form.gender" val="Female" label="Female"/>
          <q-radio v-model="form.gender" val="Other" label="Other"/>
        </q-field>
        <div class="row">
          <q-field icon="work" :error="$bool(errors.occupation)"
                   :error-label="$get('occupation.0', errors)"
                   :class="form.occupation === 'Student' ? 'col-md-6' : 'col-md-12'">
            <q-select
              v-model="form.occupation"
              float-label="Occupation"
              radio
              :options="occupations"
            />
          </q-field>
          <q-field class="col-md-6" v-if="form.occupation === 'Student'">
            <q-select
              v-model="form.years"
              float-label="Years of education"
              radio
              :options="years"
            />
          </q-field>
        </div>
        <br>
        <q-field icon="lock" :error="$bool(errors.password)"
                 :error-label="$get('password.0', errors)">
          <q-input float-label="Password" v-model="form.password"
                   type="password"/>
        </q-field>
      </div>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        label="Register"
        color="primary"
        icon="send"
        @click="register"
        :loading="loading"
        :disable="!form.years && form.occupation === 'Student'"
      />
    </q-page-sticky>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        name: '',
        email: '',
        age: '',
        gender: '',
        occupation: '',
        years: '',
        password: ''
      },
      loading: false,
      errors: {},
      occupations: [
        {
          label: 'Unemployed',
          value: 'Unemployed'
        },
        {
          label: 'Student',
          value: 'Student'
        },
        {
          label: 'Employed',
          value: 'Employed'
        }
      ],
      years: [
        {
          label: 'Up until 16 years old',
          value: 'Up until 16 years old'
        },
        {
          label: 'Up until 18 years old',
          value: 'Up until 18 years old'
        },
        {
          label: 'Degree or equivalent',
          value: 'Degree or equivalent'
        },
        {
          label: 'Higher Degree or equivalent',
          value: 'Higher Degree or equivalent'
        }
      ]

    }
  },
  methods: {
    register () {
      this.errors = {}
      this.loading = true
      if (this.form.occupation === 'Student' && this.form.years) {
        this.form.occupation += `, ${this.form.years}`
      }
      this.$axios.post('register', this.form)
        .then((res) => {
          this.$store.dispatch('login', res.data.api_token)
          this.$store.dispatch('setMe', res.data)
          this.$q.notify({
            position: 'top-right',
            type: 'positive',
            message: 'Successful registration'
          })
          this.loading = false
          this.$router.push({name: 'app'})
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
