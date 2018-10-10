<template>
  <div class="col-xs-12 col-md-6 col-lg-4">
    <q-card>
      <q-card-title>
        Hogwarts {{ hogwarts.city}}
      </q-card-title>
      <q-card-separator />
      <q-card-main style="margin-top: 10px">
        <div class="row">
          <span class="q-title">Ravenclaw</span><span class="q-body-2 q-ml-sm">{{ hogwarts.ravenclaw}}</span>
          <q-progress
            color="primary"
            :percentage="this.hogwarts.ravenclaw / this.hogwarts.max * 100 * 0.75"
            stripe
            animate
            height="20px"
          />
        </div>
        <div class="row">
          <span class="q-title">Slytherin</span><span class="q-body-2  q-ml-sm">{{ hogwarts.slytherin}}</span>
          <q-progress
            color="positive"
            :percentage="this.hogwarts.slytherin / this.hogwarts.max * 100 * 0.75"
            stripe
            animate
            height="20px"
          />
        </div>
        <div class="row">
          <span class="q-title">Gryffindor</span><span class="q-body-2  q-ml-sm">{{ hogwarts.gryffindor}}</span>
          <q-progress
            color="negative"
            :percentage="this.hogwarts.gryffindor / this.hogwarts.max * 100 * 0.75"
            stripe
            animate
            height="20px"
          />
        </div>
        <div class="row">
          <span class="q-title">Hufflepuff</span><span class="q-body-2  q-ml-sm">{{ hogwarts.hufflepuff}}</span>
          <q-progress
            color="warning"
            :percentage="this.hogwarts.hufflepuff / this.hogwarts.max * 100 * 0.75"
            stripe
            animate
            height="20px"
          /></div>
      </q-card-main>
    </q-card>
  </div>
</template>

<script>
import QCard from 'quasar-framework/src/components/card/QCard'
import QCardTitle from 'quasar-framework/src/components/card/QCardTitle'
import QCardSeparator from 'quasar-framework/src/components/card/QCardSeparator'
import QCardMain from 'quasar-framework/src/components/card/QCardMain'
import QProgress from 'quasar-framework/src/components/progress/QProgress'
export default {
  name: 'hogwarts',
  components: {QProgress, QCardMain, QCardSeparator, QCardTitle, QCard},
  data () {
    return {
      infos: Object,
      data: Object,
      hogwarts: {},
      refreshTimer: 300
    }
  },
  methods: {
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
          console.log(this.hogwarts.hufflepuff / this.hogwarts.max * 100 - 20)
          console.log(this.hogwarts.gryffindor / this.hogwarts.max * 100 - 20)
          console.log(this.hogwarts.slytherin / this.hogwarts.max * 100 - 20)
          console.log(this.hogwarts.ravenclaw / this.hogwarts.max * 100 - 20)
          this.$forceUpdate()
        })
        .catch((error) => {
          console.log(error)
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
