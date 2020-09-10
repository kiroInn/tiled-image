import Vue from 'vue'
import App from './App'
import './reset.less'
import './input-file.less'
import 'regenerator-runtime/runtime'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({ render: createElement => createElement(App) }).$mount('#app');