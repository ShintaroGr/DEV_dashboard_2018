<template>
  <div>
    <q-modal :content-css="{minWidth: '80vw', minHeight: '80vh'}" v-model="add_widget">
      <q-modal-layout>
        <q-toolbar color="dark" slot="header">
          <q-toolbar-title>
            Add widget
          </q-toolbar-title>
        </q-toolbar>
        <div class="layout-padding">
          <q-select
            :options="selectOptions"
            @input="onSelection"
            float-label="Choose a widget type"
            v-model="select"
          />
          <div>
            <q-input :float-label="params.name" :key="params.name" :type="paramType(params.type)"
                     v-for="params in widgetParams" v-model="text[params.value]"></q-input>
          </div>
          <div class="row q-mt-md">
            <q-btn @click="validWidget" icon="fas fa-check" v-if="widgetParams"><span style="margin-left: 10px"></span>Create
              widget
            </q-btn>
          </div>
        </div>
      </q-modal-layout>
    </q-modal>
    <draggable :list="widgets" :style="mansonry_size" @end="drag=false" @start="drag=true" @update="checkMove" class="row"
               v-if="widgets">
      <div :id="widget._id" :is="widget.type" :key="widget._id" :widgetId="widget._id" ref="refWidget"
           v-for="widget in widgets"></div>
    </draggable>
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
import Movie from '../components/movies'
import GuildWarsGems from '../components/guildwarsGems'
import GuildWarsDelivery from '../components/guildwarsDelivery'
import { Screen } from 'quasar'
import draggable from 'vuedraggable'
import GuildWarsWallet from '../components/guildwarsWallet'

export default {
  name: 'PageIndex',
  components: {
    GuildWarsWallet,
    Screen,
    YoutubeLastVideo,
    YoutubeChannel,
    Reddit,
    Hogwarts,
    News,
    Weather,
    GuildWarsGems,
    Movie,
    GuildWarsDelivery,
    QInput,
    QToolbarTitle,
    QToolbar,
    QBtn,
    QModalLayout,
    QModal,
    QSelect,
    draggable
  },
  data () {
    return {
      select: '',
      selectOptions: [],
      widgetInfos: [],
      services: '',
      widgetParams: '',
      widgetUrl: '',
      text: {},
      widgets: '',
      height: 0
    }
  },
  mounted () {
    this.$q.screen.setDebounce(5)
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

    this.$axios.get(this.$store.state.server.url + '/widget', {headers: {Authorization: this.$q.cookies.get('token')}})
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
    checkMove (evt) {
      this.$emit('updated', this.widgets)
      this.widgets.map((widget, index) => {
        widget.position = index
        return widget
      })
      for (let widget of this.widgets) {
        this.$axios.put(this.$store.state.server.url + '/widget/' + widget._id, widget)
          .then((response) => {
          })
          .catch(() => {
            this.$q.notify({
              color: 'negative',
              position: 'top',
              message: 'Loading failed',
              icon: 'report_problem'
            })
          })
      }
    },
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
            console.log(response)
            this.$q.notify({
              color: 'negative',
              position: 'top',
              message: response.data.msg,
              icon: 'report_problem'
            })
          }
        })
        .catch((response) => {
          console.log(response)
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
    mansonry_size () {
      let style = {
        'display': 'flex',
        'flex-flow': 'column wrap',
        height: '400px'
      }
      if (this.$q.screen.lt.sm || this.$q.screen.sm) {
        style.height = ((this.widgets.length * 350)) + 'px'
      } else if (this.$q.screen.lt.md || this.$q.screen.md) {
        style.height = ((this.widgets.length * 350) / 2) + 'px'
      } else if (this.$q.screen.lt.lg || this.$q.screen.lg) {
        style.height = ((this.widgets.length * 350) / 3) + 'px'
      } else if (this.$q.screen.lt.xl || this.$q.screen.xl) {
        style.height = ((this.widgets.length * 350) / 3) + 'px'
      } else {
        style.height = ((this.widgets.length * 350) / 3) + 'px'
      }
      if (this.$store.state.toggle.edit_mode) {
        style.height = style.height.split('.')[0] * 1.05 + 'px'
      }
      return style
    },
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
</style>
