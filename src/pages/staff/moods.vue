<template>
  <div class="row" style="padding: 15px">
    <q-card class="col-md-4 offset-md-4">
      <q-card-separator/>
      <div style="padding: 10px 62px 10px 10px;position: relative">
        <q-field
          label="Delay"
          class="col-md-8"
        >
          <q-input suffix="Seconds" v-model="delay"/>
        </q-field>
        <q-btn round dense icon="save" :disable="!delay" class="absolute-right" color="primary"
               style="top: 9.2px; right: 10px" @click="setDelay"/>
      </div>
    </q-card>
    <q-card class="col-md-4 offset-md-4">
      <q-card-title>
        Feelings
        <q-btn round icon="add" class="float-right" @click="create"/>
      </q-card-title>
      <q-card-separator/>
      <div class="center-all" style="padding: 10px" v-if="!moods.length">
        No feelingss found
      </div>
      <q-list highlight v-if="moods.length">
        <q-item v-for="(mood, i) in moods" :key="i">
          <q-item-main :label="mood"/>
          <q-item-side right>
            <q-btn round icon="delete" flat dense color="negative" @click="remove(i)"/>
          </q-item-side>
        </q-item>
      </q-list>
    </q-card>
  </div>
</template>

<script>
export default {
  created () {
    this.$axios.get('moods')
      .then(res => {
        this.moods = res.data.moods
      })
    this.$axios.get('delay')
      .then(res => {
        this.delay = res.data.delay
      })
  },
  data () {
    return {
      moods: [],
      delay: ''
    }
  },
  methods: {
    remove (i) {
      this.$q.dialog({
        color: 'negative',
        title: 'Warning !',
        message: `The following feeling : ${this.moods[i]} ,will be deleted!`,
        ok: 'Delete',
        cancel: 'Cancel'
      }).then(() => {
        this.moods.splice(i, 1)
        this.$axios.post('moods', {moods: this.moods})
          .then(res => {
            this.moods = res.data.moods
            this.$q.notify({
              position: 'top-right',
              type: 'positive',
              message: 'Feeling deleted!'
            })
          })
      }).catch(() => {
      })
    },
    create () {
      this.$q.dialog({
        title: 'Create a feeling',
        cancel: true,
        preventClose: true,
        noBackdropDismiss: false,
        noEscDismiss: false,
        prompt: {
          type: 'text'
        }
      }).then(data => {
        if (data) {
          this.moods.push(data)
          this.$axios.post('moods', {moods: this.moods})
            .then(res => {
              this.moods = res.data.moods
              this.$q.notify({
                position: 'top-right',
                type: 'positive',
                message: 'Feeling Added!'
              })
            })
        } else {
          this.$q.notify('You can\'t insert an empty feeling')
        }
      })
    },
    setDelay () {
      this.$axios.post('delay', {
        delay: this.delay
      }).then(res => {
        this.delay = res.data.delay
        this.$q.notify({
          position: 'top-right',
          type: 'positive',
          message: 'Delay updated!'
        })
      })
    }
  }
}
</script>
