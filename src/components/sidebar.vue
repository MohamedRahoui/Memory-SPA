<template>
  <q-layout-drawer side="left" v-model="showLeft" v-if="$isStaff()">
    <q-list class="full-height" no-border link
            inset-separator>
      <q-item :to="{name: 'staff-index'}">
        <q-item-side icon="data_usage"/>
        <q-item-main label="Experiments"/>
      </q-item>
      <q-item :to="{name: 'staff-questions'}">
        <q-item-side icon="question_answer"/>
        <q-item-main label="Questions"/>
      </q-item>
      <q-item :to="{name: 'staff-moods'}">
        <q-item-side icon="settings"/>
        <q-item-main label="Settings"/>
      </q-item>
      <q-item :to="{name: 'staff-messages'}">
        <q-item-side icon="message"/>
        <q-item-main label="Messages"/>
      </q-item>
    </q-list>
  </q-layout-drawer>
</template>

<script>
export default {
  data () {
    return {
      showLeft: this.$isStaff() || false
    }
  },
  mounted () {
    this.$root.$on('toggle-sidebar', () => {
      this.showLeft = !this.showLeft
    })
    this.$store.watch(
      state => {
        return state.auth.me.is_staff
      },
      val => {
        this.showLeft = !!val
      }
    )
  }
}
</script>
