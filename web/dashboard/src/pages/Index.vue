<template>
  <q-modal v-model="add_widget" :content-css="{minWidth: '80vw', minHeight: '80vh'}">
    <q-modal-layout>
      <q-toolbar slot="header" color="dark">
        <q-toolbar-title>
          Add widget
        </q-toolbar-title>
      </q-toolbar>
      <div class="layout-padding">
        <q-select
          v-model="select"
          :options="selectOptions"
          float-label="Choose a widget type"
        />
      </div>
    </q-modal-layout>
  </q-modal>
</template>

<script>
import QSelect from 'quasar-framework/src/components/select/QSelect'
import QModal from 'quasar-framework/src/components/modal/QModal'
import QModalLayout from 'quasar-framework/src/components/modal/QModalLayout'
import QBtn from 'quasar-framework/src/components/btn/QBtn'
import QToolbar from 'quasar-framework/src/components/toolbar/QToolbar'
import QToolbarTitle from 'quasar-framework/src/components/toolbar/QToolbarTitle'
export default {
  name: 'PageIndex',
  components: { QToolbarTitle, QToolbar, QBtn, QModalLayout, QModal, QSelect },
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
    add_widget: {
      get () {
        return this.$store.state.toggle.add_widget
      },
      set (val) {
        this.$store.state.toggle.add_widget = val
      }
    },
    edit_mode: {
      get () {
        return this.$store.state.toggle.edit_mode
      },
      set (val) {
        this.$store.state.toggle.edit_mode = val
      }
    }
  }
}
</script>
