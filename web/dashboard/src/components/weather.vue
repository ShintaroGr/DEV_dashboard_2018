<template>
  <div class="col-xs-12 col-md-6 col-lg-4" v-if="!isDeleted">
    <q-modal v-model="edit">
      <q-modal-layout>
        <q-toolbar color="dark" slot="header">
          <q-toolbar-title>
            Edit widget
          </q-toolbar-title>
        </q-toolbar>
        <div class="layout-padding">
          <div :key="index" v-for="(info, index) in infos">
            <div v-if="index !== '_id' && index !== 'type'">
              <q-input :float-label="index" :type="paramType(infos[index])" v-model="infos[index]"></q-input>
            </div>
          </div>
          <q-btn @click="validateEdit" color="primary">Validate</q-btn>
        </div>
      </q-modal-layout>
    </q-modal>
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <q-card>
        <q-card-title>
          {{ weather.city }}
          <div style="float: right" v-if="$store.state.toggle.edit_mode">
            <q-btn @click="edit = true" color="primary" icon="fas fa-edit" size="xs"></q-btn>
            <q-btn @click="deleteWidget" color="negative" icon="fas fa-trash" size="xs"></q-btn>
            <q-btn @click="loadData" color="warning" icon="fas fa-sync" size="xs"></q-btn>
          </div>
        </q-card-title>
        <q-card-separator/>
        <q-card-main style="margin-top: 10px">
          <div class="row">
            <div class="col-7">
              <div class="row">
                <div class="col-xs-12 col-sm-5"><i :class="'fa-4x wi wi-owm-' + weather.time + '-' + weather.id "></i>
                </div>
                <div class="col-xs-12 col-sm-7"><h2 style="margin: 10px 0">{{weather.temperature}}°C</h2></div>
              </div>
            </div>
            <div class="col-5">
              <div class="row">
                <p>
                  Humidity : {{weather.humidity}}%
                </p>
              </div>
              <div class="row">
                <p>
                  Wind Speed : {{weather.windSpeed}} km/h
                </p>
              </div>
              <div class="row">
                <p>
                  Pressure : {{weather.pressure}} hPa
                </p>
              </div>
            </div>
          </div>
          <div class="row justify-center">
            <h4 class="capitalize" style="margin: 0;">
              {{ weather.description}}
            </h4>
          </div>
        </q-card-main>
      </q-card>
    </transition>
  </div>
</template>

<script>
import QCard from 'quasar-framework/src/components/card/QCard'
import QCardTitle from 'quasar-framework/src/components/card/QCardTitle'
import QCardSeparator from 'quasar-framework/src/components/card/QCardSeparator'
import QCardMain from 'quasar-framework/src/components/card/QCardMain'
import QBtn from 'quasar-framework/src/components/btn/QBtn'
import QModalLayout from 'quasar-framework/src/components/modal/QModalLayout'
import QModal from 'quasar-framework/src/components/modal/QModal'
import QToolbar from 'quasar-framework/src/components/toolbar/QToolbar'
import QToolbarTitle from 'quasar-framework/src/components/toolbar/QToolbarTitle'
import QSearch from 'quasar-framework/src/components/search/QSearch'
import QInput from 'quasar-framework/src/components/input/QInput'

export default {
  name: 'weather',
  components: {
    QInput,
    QSearch,
    QToolbarTitle,
    QToolbar,
    QModal,
    QModalLayout,
    QBtn,
    QCardMain,
    QCardSeparator,
    QCardTitle,
    QCard
  },
  data () {
    return {
      isDeleted: false,
      edit: false,
      infos: Object,
      data: Object,
      weather: {},
      refreshTimer: 300
    }
  },
  methods: {
    validateEdit () {
      this.$axios.put(this.$store.state.server.url + '/widget/' + this.widgetId, this.infos)
        .then((response) => {
          if (response.status === 200) {
            this.$q.notify({
              color: 'positive',
              position: 'top',
              message: response.data.msg,
              icon: 'success'
            })
            this.loadData()
            this.edit = false
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
    paramType (param) {
      if (typeof param === 'number') { return 'number' } else { return 'text' }
    },
    deleteWidget () {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Are you sure you want to delete this widget.',
        ok: 'Agree',
        cancel: 'Disagree'
      }).then(() => {
        this.$axios.delete(this.$store.state.server.url + '/widget/' + this.widgetId)
          .then((response) => {
            this.$q.notify({
              color: 'positive',
              position: 'top',
              message: response.data.msg,
              icon: 'report_problem'
            })
            this.isDeleted = true
          })
          .catch(() => {
            this.$q.notify({
              color: 'negative',
              position: 'top',
              message: 'Cannot delete this widget',
              icon: 'report_problem'
            })
          })
      }).catch(() => {
      })
    },
    start () {
      this.$axios.defaults.headers.common['Authorization'] = this.$q.cookies.get('token')
      this.$axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
      this.$axios.get(this.$store.state.server.url + '/widget/' + this.widgetId)
        .then((response) => {
          this.infos = response.data
          this.refreshTimer = response.data.refresh
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Loading failed',
            icon: 'report_problem'
          })
        })
      this.loadData()
      this.interval = setInterval(function () { this.loadData() }.bind(this), 1000 * this.refreshTimer)
    },
    loadData () {
      this.$axios.get(this.$store.state.server.url + '/widget/' + this.widgetId + '/data')
        .then((response) => {
          this.data = response.data
          this.weather.description = response.data.weather[0].description
          this.weather.id = response.data.weather[0].id
          this.weather.time = response.data.weather[0].icon[2] === 'n' ? 'night' : 'day'
          this.weather.temperature = Math.round(response.data.main.temp)
          this.weather.pressure = response.data.main.pressure
          this.weather.humidity = response.data.main.humidity
          this.weather.windSpeed = response.data.wind.speed
          this.weather.city = response.data.name
          this.$forceUpdate()
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
  beforeMount () {
    this.start()
  },
  beforeDestroy: function () {
    clearInterval(this.interval)
  },
  props: {
    widgetId: String
  }
}
</script>

<style>
</style>
