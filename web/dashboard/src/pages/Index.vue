<template>
  <q-modal v-model="add_widget" :content-css="{minWidth: '80vw', minHeight: '80vh'}">
    <q-modal-layout>
      <q-toolbar slot="header">
        <q-btn
          flat
          round
          dense
          v-close-overlay
          icon="keyboard_arrow_left"
        />
        <q-toolbar-title>
          Header
        </q-toolbar-title>
      </q-toolbar>

      <q-toolbar slot="header">
        <q-search inverted v-model="search" color="none" />
      </q-toolbar>

      <q-toolbar slot="footer">
        <q-toolbar-title>
          Footer
        </q-toolbar-title>
      </q-toolbar>

      <div class="layout-padding">
        <h1>Modal</h1>

        <q-btn
          color="primary"
          v-close-overlay
          label="Close"
        />
        <p>This is a Modal presenting a Layout.</p>
      </div>
    </q-modal-layout>
  </q-modal>
</template>

<script>
import QSelect from 'quasar-framework/src/components/select/QSelect'
export default {
  name: 'PageIndex',
  components: { QSelect },
  data () {
    return {
      select: '',
      selectOptions: [
        {
          label: 'Google',
          value: 'goog'
        },
        {
          label: 'Facebook',
          value: 'fb'
        }
      ]
    }
  },
  computed: {
    add_widget: function () {
      return this.$store.state.toggle.add_widget
    },
    edit_mode: function () {
      return this.$store.state.toggle.edit_mode
    }
  }
}
</script>
