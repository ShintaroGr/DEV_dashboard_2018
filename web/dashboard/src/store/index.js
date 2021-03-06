import Vue from 'vue'
import Vuex from 'vuex'

import toggle from './toggle'
import user from './user'
import server from './server'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      user,
      toggle,
      server
    }
  })

  return Store
}
