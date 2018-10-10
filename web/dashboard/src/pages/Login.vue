<template>
  <q-card v-if="!registerForm">
    <q-card-title>
      Login
    </q-card-title>
    <q-card-separator />
    <q-card-main>
      <q-input v-model="username" float-label="Username" />
      <q-input v-model="password" float-label="Password" type="password"/>
      <div class="row q-mt-md">
        <div class="col-12">
          <q-btn @click="switchForm" >Register</q-btn>
          <q-btn @click="login" style="float: right" color="primary">Login</q-btn>
        </div>
      </div>
    </q-card-main>
  </q-card>
  <q-card v-else>
    <q-card-title>
      Register
    </q-card-title>
    <q-card-separator />
    <q-card-main>
      <q-input v-model="name" float-label="Full Name" />
      <q-input v-model="email" float-label="Email" type="email"/>
      <q-input v-model="username" float-label="Username" />
      <q-input v-model="password" float-label="Password" type="password"/>
      <div class="row q-mt-xl">
        <div class="col-12">
          <q-btn @click="switchForm">Login</q-btn>
          <q-btn @click="register" style="float: right" color="primary" >Register</q-btn>
        </div>
      </div>
    </q-card-main>
  </q-card>
</template>

<script>
import QSelect from 'quasar-framework/src/components/select/QSelect'
import QModal from 'quasar-framework/src/components/modal/QModal'
import QModalLayout from 'quasar-framework/src/components/modal/QModalLayout'
import QBtn from 'quasar-framework/src/components/btn/QBtn'
import QToolbar from 'quasar-framework/src/components/toolbar/QToolbar'
import QToolbarTitle from 'quasar-framework/src/components/toolbar/QToolbarTitle'
import QInput from 'quasar-framework/src/components/input/QInput'
import QCard from 'quasar-framework/src/components/card/QCard'
import QCardTitle from 'quasar-framework/src/components/card/QCardTitle'
import QCardSeparator from 'quasar-framework/src/components/card/QCardSeparator'
import QCardMain from 'quasar-framework/src/components/card/QCardMain'

export default {
  name: 'PageIndex',
  components: {
    QCardMain,
    QCardSeparator,
    QCardTitle,
    QCard,
    QInput,
    QToolbarTitle,
    QToolbar,
    QBtn,
    QModalLayout,
    QModal,
    QSelect },
  data () {
    return {
      registerForm: false,
      name: '',
      email: '',
      username: '',
      password: ''
    }
  },
  mounted () {
    if (this.$q.cookies.get('token')) {
      this.$store.state.user.token = this.$q.cookies.get('token')
      this.$router.push({ path: `/` })
    }
  },
  methods: {
    switchForm () {
      this.registerForm = !this.registerForm
    },
    login () {
      this.$axios.post(this.$store.state.server.url + '/signin', {
        username: this.username,
        password: this.password
      }).then((response) => {
        this.$axios.defaults.headers.common['Authorization'] = response.data.token
        this.$axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
        this.$q.cookies.set('token', response.data.token)
        this.$store.state.user.token = response.data.token
        this.$router.push({ path: `/` })
      })
        .catch((error) => {
          console.warn(error)
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Loading failed',
            icon: 'report_problem'
          })
        })
    },
    register () {
      this.$axios.post(this.$store.state.server.url + '/signup', {
        username: this.username,
        password: this.password,
        email: this.email,
        name: this.name
      }).then((response) => {
        if (!response.data.success) {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: response.data.msg,
            icon: 'report_problem'
          })
        } else {
          this.$q.notify({
            color: 'positive',
            position: 'top',
            message: response.data.msg,
            icon: 'report_problem'
          })
          this.registerForm = !this.registerForm
        }
      })
        .catch((error) => {
          console.warn(error)
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Loading failed',
            icon: 'report_problem'
          })
        })
    }
  },
  computed: {
  }
}
</script>
