<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="dark"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          Dashboard
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer v-model="leftDrawerOpen" :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null">
      <q-list no-border link inset-delimiter>
        <q-list no-border link inset-delimiter>
          <q-list-header>Navigation</q-list-header>
          <q-item to="/" exact>
            <q-item-side icon="fas fa-home"/>
            <q-item-main label="Home"/>
          </q-item>
          <q-item @click.native="add_widget">
            <q-item-side icon="fas fa-plus"/>
            <q-item-main label="Add widgets"/>
          </q-item>
          <q-item @click.native="edit_mode">
            <q-item-side icon="fas fa-edit"/>
            <q-item-main label="Edit mode"/>
          </q-item>
        </q-list>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
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
  name: 'Default',
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
    return {
      leftDrawerOpen: !this.$q.platform.is.desktop
    }
  },
  methods: {
    add_widget () {
      this.$store.state.toggle.add_widget = !this.$store.state.toggle.add_widget
    },
    edit_mode () {
      this.$store.state.toggle.edit_mode = !this.$store.state.toggle.edit_mode
    },
    openURL
  }
}
</script>

<style>
</style>
