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
          <div v-for="params in widgetSchema.params" :key="params.name">
            <q-select v-if="params.options" :float-label="params.name"
                      v-model="infos[params.value]" :options="params.options"></q-select>
            <q-input v-else :float-label="params.name" :type="paramType(params.type)"
                     v-model="infos[params.value]"></q-input>
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
        <q-card-title v-if="$store.state.toggle.edit_mode">
          <div style="float: right">
            <q-btn @click="edit = true" color="primary" icon="fas fa-edit" size="xs"></q-btn>
            <q-btn @click="deleteWidget" color="negative" icon="fas fa-trash" size="xs"></q-btn>
            <q-btn @click="loadData" color="warning" icon="fas fa-sync" size="xs"></q-btn>
          </div>
        </q-card-title>
        <q-card-main style="padding: 0">
          <q-carousel
            arrows
            autoplay
            color="white"
            infinite
          >
            <q-carousel-slide :key="movie.id" v-for="movie in movies.list" v-if="movie.poster_path">
              <div class="row">
                <div class="col-6">
                  <img :src="'http://image.tmdb.org/t/p/w300' + movie.poster_path" style="height: 300px">
                </div>
                <div class="col-6">
                  <q-scroll-area style="height: 300px;">
                    <h5>{{movie.title}}</h5>
                    <p>{{movie.overview}}</p>
                  </q-scroll-area>
                </div>
              </div>
            </q-carousel-slide>
          </q-carousel>
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
import QProgress from 'quasar-framework/src/components/progress/QProgress'
import QBtn from 'quasar-framework/src/components/btn/QBtn'
import QModal from 'quasar-framework/src/components/modal/QModal'
import QModalLayout from 'quasar-framework/src/components/modal/QModalLayout'
import QToolbar from 'quasar-framework/src/components/toolbar/QToolbar'
import QToolbarTitle from 'quasar-framework/src/components/toolbar/QToolbarTitle'
import QInput from 'quasar-framework/src/components/input/QInput'
import QCarousel from 'quasar-framework/src/components/carousel/QCarousel'
import QCarouselSlide from 'quasar-framework/src/components/carousel/QCarouselSlide'
import QScrollArea from 'quasar-framework/src/components/scroll-area/QScrollArea'
import QSelect from 'quasar-framework/src/components/select/QSelect'

export default {
  name: 'movies',
  components: {
    QSelect,
    QScrollArea,
    QCarouselSlide,
    QCarousel,
    QInput,
    QToolbarTitle,
    QToolbar,
    QModalLayout,
    QModal,
    QBtn,
    QProgress,
    QCardMain,
    QCardSeparator,
    QCardTitle,
    QCard
  },
  data () {
    return {
      isDeleted: false,
      edit: false,
      widgetSchema: Object,
      infos: Object,
      data: Object,
      movies: {},
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
          this.movies.sort = response.data.sort
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
          this.movies.list = response.data.results
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
    this.widgetSchema = this.$store.state.server.infos.services.find((service) => {
      return service.name === 'movie'
    }).widgets.find((widget) => {
      return widget.name === 'Movie List'
    })
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
