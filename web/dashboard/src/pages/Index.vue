<template>
  <div>
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
          <q-input v-for="params in widgetParams" :key="params.name" v-model="text[params.value]" :float-label="params.name" :type="paramType(params.type)"></q-input>
        </div>
        <div class="row q-mt-md">
          <q-btn v-if="widgetParams" @click="validWidget" icon="fas fa-check"><span style="margin-left: 10px"></span>Create widget</q-btn>
        </div>
      </div>
    </q-modal-layout>
  </q-modal>
    <div class="row masonry">
        <div v-for="widget in widgets" :key="widget._id" :is="widget.type" :widgetId="widget._id"></div>
    </div>
  </div>
</template>

<script>
import QSelect from 'quasar-framework/src/components/select/QSelect'
import QModal from 'quasar-framework/src/components/modal/QModal'
import QModalLayout from 'quasar-framework/src/components/modal/QModalLayout'
import QBtn from 'quasar-framework/src/components/btn/QBtn'
import QToolbar from 'quasar-framework/src/components/toolbar/QToolbar'
import QToolbarTitle from 'quasar-framework/src/components/toolbar/QToolbarTitle'
import QInput from 'quasar-framework/src/components/input/QInput'
import Weather from '../components/weather'
import News from '../components/news'
import Hogwarts from '../components/hogwarts'
import Reddit from '../components/reddit'
import YoutubeChannel from '../components/youtubeChannel'
import YoutubeLastVideo from '../components/youtubeLastVideo'

export default {
  name: 'PageIndex',
  components: {
    YoutubeLastVideo,
    YoutubeChannel,
    Reddit,
    Hogwarts,
    News,
    Weather,
    QInput,
    QToolbarTitle,
    QToolbar,
    QBtn,
    QModalLayout,
    QModal,
    QSelect},
  data () {
    return {
      select: '',
      selectOptions: [],
      widgetInfos: [],
      services: '',
      widgetParams: '',
      widgetUrl: '',
      text: {},
      widgets: ''
    }
  },
  mounted () {
    this.$axios.defaults.headers.common['Authorization'] = this.$q.cookies.get('token')
    this.$axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
    this.$axios.get(this.$store.state.server.url + '/about.json')
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

    this.$axios.get(this.$store.state.server.url + '/widget', { headers: { Authorization: this.$q.cookies.get('token') } })
      .then((response) => {
        this.widgets = response.data
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
      this.$axios.post(this.$store.state.server.url + this.widgetUrl, this.text)
        .then((response) => {
          if (response.data.success) {
            this.$q.notify({
              color: 'positive',
              position: 'top',
              message: response.data.msg,
              icon: 'success'
            })
            this.$router.go({
              path: '/',
              force: true
            })
          } else {
            this.$q.notify({
              color: 'negative',
              position: 'top',
              message: response.data.msg,
              icon: 'report_problem'
            })
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

<style>
  .masonry {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    height: 100vw;
  }
</style>
