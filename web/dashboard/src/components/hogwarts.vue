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
          Hogwarts {{ hogwarts.city}}
          <div style="float: right" v-if="$store.state.toggle.edit_mode">
            <q-btn @click="edit = true" color="primary" icon="fas fa-edit" size="xs"></q-btn>
            <q-btn @click="deleteWidget" color="negative" icon="fas fa-trash" size="xs"></q-btn>
            <q-btn @click="loadData" color="warning" icon="fas fa-sync" size="xs"></q-btn>
          </div>
        </q-card-title>
        <q-card-separator/>
        <q-card-main style="margin-top: 10px">
          <div class="row">
            <span class="q-title">Ravenclaw</span><span class="q-body-2 q-ml-sm">{{ hogwarts.ravenclaw}}</span>
            <q-progress
              :percentage="this.hogwarts.ravenclaw / this.hogwarts.max * 100 * 0.75"
              animate
              color="primary"
              height="20px"
              stripe
            />
          </div>
          <div class="row">
            <span class="q-title">Slytherin</span><span class="q-body-2  q-ml-sm">{{ hogwarts.slytherin}}</span>
            <q-progress
              :percentage="this.hogwarts.slytherin / this.hogwarts.max * 100 * 0.75"
              animate
              color="positive"
              height="20px"
              stripe
            />
          </div>
          <div class="row">
            <span class="q-title">Gryffindor</span><span class="q-body-2  q-ml-sm">{{ hogwarts.gryffindor}}</span>
            <q-progress
              :percentage="this.hogwarts.gryffindor / this.hogwarts.max * 100 * 0.75"
              animate
              color="negative"
              height="20px"
              stripe
            />
          </div>
          <div class="row">
            <span class="q-title">Hufflepuff</span><span class="q-body-2  q-ml-sm">{{ hogwarts.hufflepuff}}</span>
            <q-progress
              :percentage="this.hogwarts.hufflepuff / this.hogwarts.max * 100 * 0.75"
              animate
              color="warning"
              height="20px"
              stripe
            />
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
import QProgress from 'quasar-framework/src/components/progress/QProgress'
import QBtn from 'quasar-framework/src/components/btn/QBtn'
import QModal from 'quasar-framework/src/components/modal/QModal'
import QModalLayout from 'quasar-framework/src/components/modal/QModalLayout'
import QToolbar from 'quasar-framework/src/components/toolbar/QToolbar'
import QToolbarTitle from 'quasar-framework/src/components/toolbar/QToolbarTitle'
import QInput from 'quasar-framework/src/components/input/QInput'

export default {
  name: 'hogwarts',
  components: {
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
      infos: Object,
      data: Object,
      hogwarts: {},
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
          this.hogwarts.city = response.data.city
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
          this.hogwarts.hufflepuff = response.data.huf
          this.hogwarts.ravenclaw = response.data.rav
          this.hogwarts.gryffindor = response.data.gry
          this.hogwarts.slytherin = response.data.sly
          this.hogwarts.max = Math.max(this.hogwarts.slytherin, this.hogwarts.ravenclaw, this.hogwarts.gryffindor, this.hogwarts.hufflepuff)
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
