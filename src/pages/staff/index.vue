<template>
  <div style="padding: 15px">
    <!-- My table -->
    <q-table
      title="Users"
      :data="users"
      :columns="columns"
      row-key="name"
    >
      <q-td slot="body-cell-active" slot-scope="props"
            :props="props">
        <q-btn :label="props.value.active ? 'Deactivate' : 'Activate'"
               :color="props.value.active ? 'negative' : 'positive'" no-caps
               dense @click="activation(props.value)"
               v-if="!props.value.is_staff && props.value.id !== $store.getters.getMe.id"
        />
      </q-td>
      <q-td slot="body-cell-age" slot-scope="props"
            :props="props">
        {{props.value}} years
      </q-td>
    </q-table>
  </div>
</template>
<script>
import moment from 'moment'
import Vue from 'vue'

export default {
  data () {
    return {
      columns: [
        {
          name: '#',
          required: true,
          label: 'N°',
          align: 'center',
          field: row => row.__index + 1,
          sortable: true
        },
        {
          name: 'name',
          required: true,
          label: 'Username',
          align: 'center',
          field: 'name',
          sortable: true
        },
        {
          name: 'email',
          required: true,
          label: 'Email',
          align: 'center',
          field: 'email',
          sortable: true
        },
        {
          name: 'age',
          required: true,
          label: 'Age',
          align: 'center',
          field: 'age',
          sortable: true
        },
        {
          name: 'gender',
          required: true,
          label: 'Gender',
          align: 'center',
          field: 'gender',
          sortable: true
        },
        {
          name: 'created_at',
          required: true,
          label: 'Joined',
          align: 'center',
          field: row => moment(row.created_at).fromNow(),
          sortable: true
        }, {
          name: 'active',
          label: 'Activate/Deactivate',
          align: 'center',
          field: row => row
        }
      ],
      users: []
    }
  },
  methods: {
    activation (row) {
      if (row.active) {
        this.users[row.__index].active = false
        this.$axios.patch(`users/${row.id}`, this.users[row.__index])
          .then(res => {
            Vue.set(this.users[row.__index], res.data)
            this.$q.notify({
              position: 'top-right',
              type: 'negative',
              message: 'User deactivated'
            })
          })
      } else {
        this.users[row.__index].active = true
        this.$axios.patch(`users/${row.id}`, this.users[row.__index])
          .then(res => {
            Vue.set(this.users[row.__index], res.data)
            this.$q.notify({
              position: 'top-right',
              type: 'positive',
              message: 'User activated'
            })
          })
      }
    }
  },
  created () {
    this.$axios.get('users')
      .then(res => {
        this.users = res.data
      }, err => {
        console.log(err)
      })
  }
}
</script>
