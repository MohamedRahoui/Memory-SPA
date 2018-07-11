<template>
  <div class="row" style="padding-top: 20px">
    <q-list class="col-md-6 offset-md-3" separator>
      <q-item>
        <q-item-side>
          <b>VIDEO URL</b>
        </q-item-side>
        <q-item-main :label="experiment.url" class="text-weight-light"/>
      </q-item>
      <q-item>
        <q-item-side>
          <b>USER</b>
        </q-item-side>
        <q-item-main style="padding-left: 50px">
          <b>- Gender : </b> {{user.gender}} <br><br>
          <b>- Age : </b> {{user.age}} years old<br><br>
          <b>- Occupation : </b> {{user.occupation}}
        </q-item-main>
      </q-item>
      <q-item>
        <q-item-side>
          <b>DATA</b>
        </q-item-side>
        <q-item-main style="padding-left: 50px">
          <q-table
            :data="experiment.popups"
            :columns="columns"
            hide-bottom
          >
            <template slot="top-right" slot-scope="props" v-if="$isStaff()">
              <q-btn icon="cloud_download"
                     label="Download CSV"
                     dense
                     color="positive"
                     @click="downloadCsv"/>
            </template>
          </q-table>
        </q-item-main>
      </q-item>
      <q-item v-if="experiment.answers && experiment.answers.length">
        <q-item-side>
          <b>Q&A</b>
        </q-item-side>
        <q-item-main style="padding-left: 50px">
          <q-table
            :data="experiment.answers"
            :columns="columnsAnswers"
            hide-bottom
          />
        </q-item-main>
      </q-item>
      <q-item v-if="experiment.popups && experiment.popups.length">
        <q-item-side>
          <b>Chart</b>
        </q-item-side>
        <q-item-main style="padding-left: 50px">
          <chart :data="chartData" :options="chartOptions"></chart>
        </q-item-main>
      </q-item>
      <div class="center-all">
        <q-btn label="Delete this experiment"  icon="delete" color="negative" @click="remove" v-show="$isAuth()"/>
      </div>
    </q-list>
  </div>
</template>

<script>
import chart from '../../components/chart.vue'
import fileDownload from 'js-file-download'

export default {
  components: {chart},
  data () {
    return {
      chartData: {
        datasets: [{
          data: [],
          borderColor: 'rgb(255, 99, 132)'
        }],
        labels: []
      },
      chartOptions: {
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return 'Memory: ' + data['datasets'][0]['data'][tooltipItem['index']]
            },
            afterLabel: (tooltipItem) => {
              return 'Mood: ' + this.chartMoods[tooltipItem['index']]
            }
          },
          displayColors: false
        }
      },
      chartMoods: [],
      experiment: {},
      user: {},
      columns: [
        {
          name: 'time',
          label: 'Time',
          align: 'left',
          field: 'time',
          sortable: true
        }, {
          name: 'memory',
          label: 'Memory',
          align: 'left',
          field: row => `${row.memory} %`,
          sortable: true
        }, {
          name: 'mood',
          label: 'Mood',
          align: 'left',
          field: 'mood',
          sortable: true
        }],
      columnsAnswers: [
        {
          name: 'question',
          label: 'Question',
          align: 'left',
          field: row => `${row.question} ?`,
          sortable: true
        }, {
          name: 'answer',
          label: 'Answer',
          align: 'left',
          field: 'answer',
          sortable: true
        }]
    }
  },
  methods: {
    downloadCsv () {
      this.$axios.get('csv-download/' + this.experiment.id)
        .then(res => {
          fileDownload(res.data, `experiment-${this.experiment.id}.csv`)
        })
    },
    remove () {
      this.$axios.delete(`experiments/${this.experiment.id}`)
        .then(() => {
          this.$router.push({name: 'experiments'})
          this.$q.notify({
            position: 'top-right',
            type: 'positive',
            message: 'The experiment has been deleted'
          })
        })
    }
  },
  created () {
    let id = this.$route.params.id
    if (id) {
      this.$axios.get(`experiments/${id}`)
        .then(res => {
          this.experiment = res.data
          this.experiment.popups.forEach(pop => {
            this.chartData.datasets[0].data.push(pop.memory)
            this.chartMoods.push(pop.mood)
            this.chartData.labels.push(pop.time)
          })
          this.$axios.get(`users/${this.experiment.user_id}`)
            .then(res => {
              this.user = res.data
            })
        }, err => {
          this.$router.push({name: 'home'})
          console.log(err)
        })
    } else {
      this.$router.push({name: 'home'})
    }
  }
}
</script>
