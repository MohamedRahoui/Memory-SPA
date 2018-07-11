<template>
  <div class="row" style="padding: 15px">
    <q-table class="col-md-12"
             title="Questions list"
             :data="questions"
             :columns="columns"
             row-key="name"
    >
      <div slot="top-right" slot-scope="props">
        <q-btn round icon="add" @click="create_edit = true"/>
      </div>
      <q-td slot="body-cell-actions" slot-scope="props"
            :props="props">
        <q-btn flat round color="secondary" icon="edit" @click="handleEdit(props.value)"/>
        <q-btn @click="deleteQuestion(props.value)" flat round color="red"
               icon="delete"/>
      </q-td>
      <q-td slot="body-cell-choices" slot-scope="props"
            :props="props">
        <q-chip v-for="(choice, i) in props.value" :key="i" style="margin-right: 5px">
          {{choice}}
        </q-chip>
      </q-td>
      <q-td slot="body-cell-label" slot-scope="props"
            :props="props">
        {{props.value}} ?
      </q-td>
    </q-table>
    <q-modal v-model="create_edit" :content-css="{minWidth: '50vw', minHeight: '50vh'}" @hide="clear">
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-toolbar-title>
            Create a question
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
          <q-btn icon="save" label="Save" color="white" text-color="primary"
                 @click="save"/>
        </q-toolbar>

        <div class="full-height row items-center justify-center">
          <q-field
            label="Label"
            :error="$bool(errors.text)"
            :error-label="$get('text.0', errors)"
            class="col-md-8"
          >
            <q-input suffix="?" v-model="form.text"/>
          </q-field>
          <br>
          <q-field
            label="Choices"
            :error="$bool(errors.choices)"
            :error-label="$get('choices.0', errors)"
            class="col-md-8"
          >
            <q-chips-input v-model="form.choices"/>
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
      create_edit: false,
      is_edit: false,
      form: {
        text: '',
        choices: []
      },
      columns: [
        {
          name: 'label',
          required: true,
          label: 'Label',
          align: 'center',
          field: 'text',
          sortable: true
        },
        {
          name: 'choices',
          required: true,
          label: 'Choices',
          align: 'center',
          field: 'choices',
          sortable: false
        },
        {
          name: 'actions',
          label: 'actions',
          align: 'center',
          field: row => row
        }
      ],
      loading: false,
      errors: {}
    }
  },
  methods: {
    addQuestion () {
      this.errors = {}
      this.loading = true
      this.$store.dispatch('createQuestion', this.form)
        .then(() => {
          this.loading = false
          this.form = {
            text: '',
            choices: []
          }
          this.create_edit = false
          this.$q.notify({
            position: 'top-right',
            type: 'positive',
            message: 'Question created!'
          })
        }, err => {
          this.loading = false
          if (err.response.status === 422) {
            this.errors = err.response.data.errors
          }
        })
    },
    updateQuestion () {
      this.errors = {}
      this.loading = true
      this.$store.dispatch('updateQuestion', this.form)
        .then(() => {
          this.loading = false
          this.form = {
            text: '',
            choices: []
          }
          this.create_edit = false
          this.is_edit = false
          this.$q.notify({
            position: 'top-right',
            type: 'positive',
            message: 'Question Updated!'
          })
        }, err => {
          this.loading = false
          if (err.response.status === 422) {
            this.errors = err.response.data.errors
          }
        })
    },
    handleEdit (row) {
      this.form = row
      this.create_edit = true
      this.is_edit = true
    },
    deleteQuestion (question) {
      this.$q.dialog({
        color: 'negative',
        title: 'Warning !',
        message: `The following question : ${question.text} ,will be deleted!`,
        ok: 'Delete',
        cancel: 'Cancel'
      }).then(() => {
        this.$store.dispatch('deleteQuestion', question.id)
          .then(() => {
            this.$q.notify({
              position: 'top-right',
              type: 'positive',
              message: 'Question deleted!'
            })
          })
      }).catch(() => {
      })
    },
    clear () {
      this.errors = {}
      this.form = {
        text: '',
        choices: []
      }
    },
    save () {
      if (this.is_edit) {
        this.updateQuestion()
      } else {
        this.addQuestion()
      }
    }
  },
  created () {
    this.$store.dispatch('fetchQuestions')
  },
  computed: {
    questions () {
      return this.$store.getters.questions
    }
  }
}
</script>
