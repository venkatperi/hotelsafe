import {library} from '@fortawesome/fontawesome-svg-core'
import {
  faGithub,
  faWikipediaW,
} from '@fortawesome/free-brands-svg-icons'
import {faLink} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import App from 'components/App'
import AppCore from 'components/AppCore'
import AppFooter from 'components/AppFooter'
import AppMenu from 'components/AppMenu'
import Vue from 'vue'
import VueRouter from 'vue-router'


library.add( faGithub, faWikipediaW, faLink )
Vue.component( 'font-awesome-icon', FontAwesomeIcon )
Vue.config.productionTip = false

const appComponents = {
  core: AppCore,
  header: AppMenu,
  main: App,
  footer: AppFooter,
}

let router = new VueRouter( {
  routes: [
    { path: '/:args*', components: appComponents },
  ],
} )

Vue.use( VueRouter )

new Vue( {
  router,
  el: '#app',
} )
