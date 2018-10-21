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
        <q-card-title>
          Guild Wars 2 {{infos.gems_or_coins}} Exchange
          <div style="float: right" v-if="$store.state.toggle.edit_mode">
            <q-btn @click="edit = true" color="primary" icon="fas fa-edit" size="xs"></q-btn>
            <q-btn @click="deleteWidget" color="negative" icon="fas fa-trash" size="xs"></q-btn>
            <q-btn @click="loadData" color="warning" icon="fas fa-sync" size="xs"></q-btn>
          </div>
        </q-card-title>
        <q-card-separator/>
        <q-card-main style="margin-top: 10px">
          <div class="text-center q-display-1" v-if="infos.gems_or_coins === 'gems'">
            1
            <img class="vertical-middle"
                 src="https://render.guildwars2.com/file/086CF7BC17BC0106A4B15F61213EDB68A2A874AB/502064.png">
            <q-icon name="fas fa-arrow-right" size="32px"></q-icon>
            {{(data.coins_per_gem - (data.coins_per_gem % 100)) / 100}}
            <img class="vertical-middle"
                 src="https://render.guildwars2.com/file/E5A2197D78ECE4AE0349C8B3710D033D22DB0DA6/156907.png">
            {{data.coins_per_gem % 100}}
            <img class="vertical-middle"
                 src="https://render.guildwars2.com/file/6CF8F96A3299CFC75D5CC90617C3C70331A1EF0E/156902.png">
          </div>
          <div class="text-center q-display-1" v-if="infos.gems_or_coins === 'coins'">
            {{(data.coins_per_gem - (data.coins_per_gem % 100)) / 100}}
            <img class="vertical-middle"
                 src="https://render.guildwars2.com/file/E5A2197D78ECE4AE0349C8B3710D033D22DB0DA6/156907.png">
            {{data.coins_per_gem % 100}}
            <img class="vertical-middle"
                 src="https://render.guildwars2.com/file/6CF8F96A3299CFC75D5CC90617C3C70331A1EF0E/156902.png">
            <q-icon name="fas fa-arrow-right" size="32px"></q-icon>
            1
            <img class="vertical-middle"
                 src="https://render.guildwars2.com/file/086CF7BC17BC0106A4B15F61213EDB68A2A874AB/502064.png">
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
import QIcon from 'quasar-framework/src/components/icon/QIcon'
import QSelect from 'quasar-framework/src/components/select/QSelect'

export default {
  name: 'guildwarsGems',
  components: {
    QSelect,
    QIcon,
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
      return service.name === 'guildwars'
    }).widgets.find((widget) => {
      return widget.name === 'Guild Wars 2 Gems Exchange'
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
