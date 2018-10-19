<template>
  <q-layout view="lHh Lpr lFf">
    <div class="row" style="height: 100vh">
      <div class="col-5 self-center" style="margin: 0 auto">
        <q-page-container>
          <router-view/>
        </q-page-container>

      </div>
    </div>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import QLayout from 'quasar-framework/src/components/layout/QLayout'
import QPageContainer from 'quasar-framework/src/components/layout/QPageContainer'
import QLayoutDrawer from 'quasar-framework/src/components/layout/QLayoutDrawer'
import QList from 'quasar-framework/src/components/list/QList'
import QItem from 'quasar-framework/src/components/list/QItem'
import QItemMain from 'quasar-framework/src/components/list/QItemMain'
import QItemSide from 'quasar-framework/src/components/list/QItemSide'
import QListHeader from 'quasar-framework/src/components/list/QListHeader'
import QItemSeparator from 'quasar-framework/src/components/list/QItemSeparator'
import QLayoutHeader from 'quasar-framework/src/components/layout/QLayoutHeader'
import QToolbar from 'quasar-framework/src/components/toolbar/QToolbar'
import QToolbarTitle from 'quasar-framework/src/components/toolbar/QToolbarTitle'
import QBtn from 'quasar-framework/src/components/btn/QBtn'
import QIcon from 'quasar-framework/src/components/icon/QIcon'

export default {
  name: 'Login',
  components: {
    QIcon,
    QBtn,
    QToolbarTitle,
    QToolbar,
    QLayoutHeader,
    QItemSeparator,
    QListHeader,
    QItemSide,
    QItemMain,
    QItem,
    QList,
    QLayoutDrawer,
    QPageContainer,
    QLayout
  },
  data () {
    return {}
  },
  methods: {
    openURL
  }
}
</script>

<style>
</style>
