<template>
  <div class="col-xs-12 col-md-6 col-lg-4">
    <q-card>
      <q-card-title>
        {{ weather.city }}
      </q-card-title>
      <q-card-separator />
      <q-card-main style="margin-top: 10px">
        <div class="row">
          <div class="col-7">
            <div class="row">
              <div class="col-xs-12 col-sm-5"><i :class="'fa-4x wi wi-owm-' + weather.time + '-' + weather.id "></i></div>
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
  </div>
</template>

<script>
import QCard from 'quasar-framework/src/components/card/QCard'
import QCardTitle from 'quasar-framework/src/components/card/QCardTitle'
import QCardSeparator from 'quasar-framework/src/components/card/QCardSeparator'
import QCardMain from 'quasar-framework/src/components/card/QCardMain'
export default {
  name: 'weather',
  components: {QCardMain, QCardSeparator, QCardTitle, QCard},
  data () {
    return {
      infos: Object,
      data: Object,
      weather: {},
      refreshTimer: 10
    }
  },
  methods: {
    start () {
      this.$axios.defaults.headers.common['Authorization'] = this.$q.cookies.get('token')
      this.$axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
      this.$axios.get(this.$store.state.server.url + '/widget/' + this.widgetId)
        .then((response) => {
          this.infos = response.data
          this.refreshTimer = response.data.refresh
          console.log(response.data)
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
