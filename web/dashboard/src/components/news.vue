<template>
  <div class="col-xs-12 col-md-6 col-lg-4">
    <q-card>
      <q-card-title>
      </q-card-title>
      <q-card-separator />
      <q-card-main style="margin-top: 10px">
        <q-scroll-area style="width: 100%; height: 200px;">
          <q-list>
            <q-collapsible v-for="article in articles" :key="article._id" :group="infos.keyword" :label="article.headline.main">
              <div>
                {{ article.snippet }}
              </div>
              <q-btn @click="openURL(article.web_url)">Go to article</q-btn>
            </q-collapsible>
          </q-list>
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
export default {
  name: 'news',
  components: {QBtn, QCardMain, QCardSeparator, QCardTitle, QCard, QScrollArea, QCollapsible, QList},
  data () {
    return {
      infos: Object,
      data: Object,
      articles: Array,
      refreshTimer: 10
    }
  },
  methods: {
    openURL,
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
