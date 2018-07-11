<template>
  <div>
    <q-page-sticky position="bottom-left" :offset="[18, 18]" v-show="!$isStaff()">
      <q-btn
        round
        color="primary"
        @click="opened = true"
        icon="mail"
      />
    </q-page-sticky>
    <q-modal v-model="opened"
             :content-css="{minWidth: '40vw', minHeight: '50vh'}">
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-toolbar-title>
            Contact us
          </q-toolbar-title>
          <q-btn
            flat
            round
            dense
            v-close-overlay
            icon="fas fa-times"
          />
        </q-toolbar>

        <q-toolbar slot="footer">
          <q-toolbar-title/>
          <q-btn label="Send" color="white" text-color="primary" @click="send"/>
        </q-toolbar>

        <div class="row" style="padding-top: 20px">
          <q-field
            label="Email"
            :error="$bool(errors.email)"
            :error-label="$get('email.0', errors)"
            class="col-md-10 offset-md-1"
          >
            <q-input v-model="form.email"/>
          </q-field>
          <q-field
            label="Message"
            :error="$bool(errors.content)"
            :error-label="$get('content.0', errors)"
            class="col-md-10 offset-md-1"
          >
            <q-input v-model="form.content" type="textarea" :max-height="100"
                     rows="7"/>
          </q-field>
        </div>
      </q-modal-layout>
    </q-modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      opened: false,
      form: {
        email: '',
        content: ''
      },
      errors: {}
    }
  },
  methods: {
    send () {
      this.errors = {}
      this.$axios.post('messages', this.form)
        .then(() => {
          this.form = {
            email: '',
            content: ''
          }
          this.opened = false
          this.$q.notify({
            position: 'top-right',
            type: 'positive',
            message: 'Your message is being processed, we\'ll get back to you as soon as possible'
          })
        }, err => {
          this.errors = err.response.data.errors
        })
    }
  }
}
</script>
