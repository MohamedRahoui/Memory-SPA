<template>
  <div>
    <div v-if="experiments.length" class="row">
      <div class="col-md-6 offset-md-3 row">
        <div style="font-size: 2em;margin-top: 20px;" class="col-12">My experiments</div>
        <hr class="col-12">
        <div class="col-md-6" style="padding: 20px" v-for="(experiment, i) in experiments" :key="i">
          <q-card>
            <q-card-title>
              Experiment N°{{i+1}}
            </q-card-title>
            <q-card-actions class="justify-end">
              <q-btn flat round dense icon="open_in_new" color="primary"
                     @click="$router.push(`/experiment/${experiment.id}`)"/>
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
    <div v-if="!experiments.length" style="min-height: calc(100vh - 50px)" class="center-all">
      No experiments yet :-)
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      experiments: []
    }
  },
  created () {
    this.$axios.get(`experiment-user/${this.user.id}`)
      .then(res => {
        this.experiments = res.data
      })
  },
  computed: {
    user () {
      return this.$store.getters.getMe
    }
  }
}
</script>
