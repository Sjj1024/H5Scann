import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'vant/lib/index.css'
import Vant from 'vant'
import { Icon } from 'vant'

// 创建vue实例
const app = createApp(App)

// 使用vant组件库
app.use(Vant)
app.use(Icon)

// 挂载到dom
app.mount('#app')
