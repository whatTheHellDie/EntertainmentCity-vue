import Vue from 'vue'
import App from '@/App'
import router from '@/router'                 // api: https://github.com/vuejs/vue-router
import store from '@/store'                   // api: https://github.com/vuejs/vuex
import VueCookie from 'vue-cookie'            // api: https://github.com/alfhen/vue-cookie
import VueI18n from 'vue-i18n'                // api:  https://github.com/kazupon/vue-i18n
import zh from '@/language/zh'               //网页中文
import en from '@/language/en'               //网页英文
import '@/element-ui'                         // api: https://github.com/ElemeFE/element
import '@/icons'                              // api: http://www.iconfont.cn/
import '@/element-ui-theme'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import '@/assets/scss/index.scss?v=1'
import { isAuth } from '@/utils'
import cloneDeep from 'lodash/cloneDeep'
import VueClipboard from 'vue-clipboard2'
import axios from 'axios'
Vue.prototype.$axios=axios;
Vue.use(VueCookie)
Vue.use(VueI18n)
Vue.use(VueClipboard)
const messages = {
  zh: zh,
  en: en
}

const i18n = new VueI18n({
  locale: 'zh', // 语言标识
  messages
})
Vue.config.productionTip = false

// 非生产环境, 适配mockjs模拟数据                 // api: https://github.com/nuysoft/Mock
if (process.env.NODE_ENV !== 'production') {
  require('@/mock')
}

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.isAuth = isAuth     // 权限方法

// 保存整站vuex本地储存初始状态
window.SITE_CONFIG['storeState'] = cloneDeep(store.state)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
