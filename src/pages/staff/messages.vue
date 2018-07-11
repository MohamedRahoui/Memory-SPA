<template>
  <div style="padding: 20px">
    <q-table
      title="Messages"
      :data="messages"
      :columns="columns"
      row-key="name"
    >
      <q-td slot="body-cell-actions" slot-scope="props"
            :props="props">
        <q-btn round flat icon="delete" @click="remove(props.value)" color="negative"/>
      </q-td>
    </q-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      messages: [],
      columns: [
        {
          name: 'email',
          required: true,
          label: 'Email',
          align: 'left',
          field: 'email',
          sortable: true
        },
        {
          name: 'content',
          required: true,
          label: 'Message',
          align: 'left',
          field: 'content',
          sortable: true
        },
        {
          name: 'actions',
          label: 'Delete',
          field: row => row
        }
      ]
    }
  },
  methods: {
    remove (row) {
      this.$axios.delete(`messages/${row.id}`)
        .then(() => {
          this.messages.splice(row.__index, 1)
          this.$q.notify({
            position: 'top-right',
            type: 'positive',
            message: 'Message deleted'
          })
        })
    }
  },
  created () {
    this.$axios.get('messages')
      .then(res => {
        this.messages = res.data
      })
  }
}
</script>
