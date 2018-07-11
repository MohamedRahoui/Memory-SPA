<template>
  <div style="padding: 20px">
    <q-table
      title="Experiments"
      :data="experiments"
      :columns="columns"
    >
      <q-td slot="body-cell-actions" slot-scope="props"
            :props="props">
        <q-btn round flat icon="open_in_new" @click="open(props.value)"
               color="primary"/>
      </q-td>
    </q-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      experiments: [],
      columns: [
        {
          name: 'num',
          required: true,
          label: 'N°',
          align: 'left',
          field: row => row.__index + 1,
          sortable: true
        },
        {
          name: 'actions',
          label: 'Show',
          field: 'id'
        }
      ]
    }
  },
  methods: {
    open (id) {
      this.$router.push('/experiment/' + id)
    }
  },
  created () {
    this.$axios.get('experiments')
      .then(res => {
        this.experiments = res.data
      })
  }
}
</script>
