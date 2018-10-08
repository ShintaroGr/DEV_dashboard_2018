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
          @input="onSelection"
          float-label="Choose a widget type"
        />
        <div>
          <q-input v-for="params in widgetParams" :key="params.name" v-model="text[params.name]" :float-label="params.name" :type="paramType(params.type)"></q-input>
        </div>
        <div class="row q-mt-md">
          <q-btn v-if="widgetParams" @click="validWidget" icon="fas fa-check"><span style="margin-left: 10px"></span>Create widget</q-btn>
        </div>
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
import QInput from 'quasar-framework/src/components/input/QInput'

export default {
  name: 'PageIndex',
  components: { QInput, QToolbarTitle, QToolbar, QBtn, QModalLayout, QModal, QSelect },
  data () {
    return {
      select: '',
      selectOptions: [],
      widgetInfos: [],
      services: '',
      widgetParams: '',
      widgetUrl: '',
      text: []
    }
  },
  mounted () {
    this.$axios.get(this.$store.state.server.url + '/api/about')
      .then((response) => {
        this.services = response.data.server.services
        for (let service of response.data.server.services) {
          for (let widget of service.widgets) {
            this.selectOptions.push({label: widget.name, value: service.name + '.' + widget.name})
          }
        }
      })
      .catch(() => {
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: 'Loading failed',
          icon: 'report_problem'
        })
      })
  },
  methods: {
    onSelection (val) {
      this.widgetParams = this.services.find(service => service.name === val.split('.')[0]).widgets.find(widget => widget.name === val.split('.')[1]).params
      this.widgetUrl = this.services.find(service => service.name === val.split('.')[0]).widgets.find(widget => widget.name === val.split('.')[1]).url
    },
    validWidget () {
      console.log(this.text)
      console.log(this.widgetUrl)
    },
    paramType (type) {
      return type === 'integer' ? 'number' : 'text'
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
