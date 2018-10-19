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
          Your delivery box in GuildWars2
          <div style="float: right" v-if="$store.state.toggle.edit_mode">
            <q-btn @click="edit = true" color="primary" icon="fas fa-edit" size="xs"></q-btn>
            <q-btn @click="deleteWidget" color="negative" icon="fas fa-trash" size="xs"></q-btn>
            <q-btn @click="loadData" color="warning" icon="fas fa-sync" size="xs"></q-btn>
          </div>
        </q-card-title>
        <q-card-separator/>
        <q-card-main style="margin-top: 10px">
          <q-scroll-area style="height: 250px">
            <div class="row">
              <div :key="item.id" style="margin: 7px 7px" v-for="item in data.items"
                   v-if="itemsInfos[item.id] && itemsInfos[item.id].prices">
                <q-tooltip>
                  {{itemsInfos[item.id].name}}
                </q-tooltip>
                <div style="width: 64px; height: 84px;">
                  <img :src="itemsInfos[item.id].icon" alt="item icon" height="64px">
                  <div class="text-center bg-dark text-white"
                       style="margin-top: -5px; font-size: 16px; padding-top: 2px">
                    {{Math.ceil(itemsInfos[item.id].prices.sells.unit_price / 10000) * item.count }}
                    <img alt="gold"
                         class="vertical-middle"
                         height="24px" src="https://render.guildwars2.com/file/090A980A96D39FD36FBB004903644C6DBEFB1FFB/156904.png">
                  </div>
                  <q-chip color="dark" style="position: relative; top: -100px; right: -45px">
                    {{item.count}}
                  </q-chip>
                </div>
              </div>
            </div>
          </q-scroll-area>
        </q-card-main>
        <q-card-separator/>
        <q-card-actions align="center">
          <q-btn flat>
            <q-tooltip>
              Money to collect
            </q-tooltip>
            {{Math.floor((data.coins) / 10000)}}
            <img alt="gold"
                 class="vertical-middle"
                 height="24px" src="https://render.guildwars2.com/file/090A980A96D39FD36FBB004903644C6DBEFB1FFB/156904.png">
          </q-btn>
          <q-btn flat>
            <q-tooltip>
              Items value
            </q-tooltip>
            {{Math.floor((coins - data.coins) / 10000)}}
            <img alt="gold"
                 class="vertical-middle"
                 height="24px" src="https://render.guildwars2.com/file/090A980A96D39FD36FBB004903644C6DBEFB1FFB/156904.png">
          </q-btn>
          <q-btn flat>
            <q-tooltip>
              Total money
            </q-tooltip>
            {{Math.floor(coins / 10000)}}
            <img alt="gold"
                 class="vertical-middle"
                 height="24px" src="https://render.guildwars2.com/file/090A980A96D39FD36FBB004903644C6DBEFB1FFB/156904.png">
          </q-btn>
        </q-card-actions>
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
import QTooltip from 'quasar-framework/src/components/tooltip/QTooltip'
import QChip from 'quasar-framework/src/components/chip/QChip'
import QCardActions from 'quasar-framework/src/components/card/QCardActions'
import QScrollArea from 'quasar-framework/src/components/scroll-area/QScrollArea'

export default {
  name: 'guildwarsDelivery',
  components: {
    QScrollArea,
    QCardActions,
    QChip,
    QTooltip,
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
      infos: Object,
      data: Object,
      refreshTimer: 300,
      itemsInfos: {},
      coins: 0
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
          this.coins = this.data.coins
          this.data.items.forEach((item) => {
            this.$axios.get('http://localhost:8080/widget/guildwars2/delivery/' + item.id)
              .then((response) => {
                this.itemsInfos[item.id] = response.data
                this.$axios.get('http://localhost:8080/widget/guildwars2/delivery/' + item.id + '/prices')
                  .then((response) => {
                    this.itemsInfos[item.id].prices = response.data
                    this.coins += response.data.sells.unit_price * item.count
                    this.$forceUpdate()
                  })
                  .catch((error) => {
                    console.log(error)
                  })
              })
              .catch((error) => {
                console.log(error)
              })
          })
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
