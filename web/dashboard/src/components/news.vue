<template>
  <div class="col-xs-12 col-md-6 col-lg-4">
    <q-modal v-model="edit">
      <q-modal-layout>
        <q-toolbar slot="header" color="dark">
          <q-toolbar-title>
            Edit widget
          </q-toolbar-title>
        </q-toolbar>
        <div class="layout-padding">
          <div v-for="(info, index) in infos" :key="index">
            <div v-if="index !== '_id' && index !== 'type'">
              <q-input v-model="infos[index]" :float-label="index" :type="paramType(infos[index])"></q-input>
            </div>
          </div>
          <q-btn color="primary" @click="validateEdit">Validate</q-btn>
        </div>
      </q-modal-layout>
    </q-modal>
    <q-card>
      <q-card-title>
        New York Times : {{infos.keyword}}
        <div v-if="$store.state.toggle.edit_mode" style="float: right">
          <q-btn @click="edit = true" color="primary" icon="fas fa-edit"></q-btn>
          <q-btn @click="deleteWidget" color="negative" icon="fas fa-trash" ></q-btn>
        </div>
      </q-card-title>
      <q-card-separator />
      <q-card-main style="margin-top: 10px">
        <q-scroll-area style="width: 100%; height: 200px;">
            <q-collapsible v-for="article in articles" :key="article._id" :group="infos.keyword" :label="article.headline.main">
              <div>
                {{ article.snippet }}
              </div>
              <q-btn @click="openURL(article.web_url)">Go to article</q-btn>
            </q-collapsible>
        </q-scroll-area>
      </q-card-main>
    </q-card>
  </div>
</template>

<script>
import QList from 'quasar-framework/src/components/list/QList'
import QCollapsible from 'quasar-framework/src/components/collapsible/QCollapsible'
import QScrollArea from 'quasar-framework/src/components/scroll-area/QScrollArea'
import QCard from 'quasar-framework/src/components/card/QCard'
import QCardTitle from 'quasar-framework/src/components/card/QCardTitle'
import QCardSeparator from 'quasar-framework/src/components/card/QCardSeparator'
import QCardMain from 'quasar-framework/src/components/card/QCardMain'
import QBtn from 'quasar-framework/src/components/btn/QBtn'
import { openURL } from 'quasar'
import QModal from 'quasar-framework/src/components/modal/QModal'
import QModalLayout from 'quasar-framework/src/components/modal/QModalLayout'
import QToolbar from 'quasar-framework/src/components/toolbar/QToolbar'
import QToolbarTitle from 'quasar-framework/src/components/toolbar/QToolbarTitle'
import QInput from 'quasar-framework/src/components/input/QInput'
export default {
  name: 'news',
  components: {
    QInput,
    QToolbarTitle,
    QToolbar,
    QModalLayout,
    QModal,
    QBtn,
    QCardMain,
    QCardSeparator,
    QCardTitle,
    QCard,
    QScrollArea,
    QCollapsible,
    QList},
  data () {
    return {
      edit: false,
      infos: Object,
      data: Object,
      articles: Array,
      refreshTimer: 300
    }
  },
  methods: {
    openURL,
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
            this.$router.go({
              path: '/',
              force: true
            })
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
          this.articles = response.data.response.docs
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
