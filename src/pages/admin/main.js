import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './config/routes'
import components from 'components/commonComponents/' //加载公共组件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI)
Object.keys(components).forEach((key) => {
    var name = key.replace(/(\w)/, (v) => v.toUpperCase()) //首字母大写
    Vue.component(`v${name}`, components[key])
})
Vue.use(VueRouter)
window.Vue = Vue;

const router = new VueRouter({
    routes,
    mode: 'history',
    base: '/admin'
})
router.beforeEach(({meta, path}, from, next) => {
    var {auth = true} = meta
    var isLogin = true //true用户已登录， false用户未登录
    if (auth && !isLogin && path !== '/login') {
        return next({path: '/login'})
    }
    next()
})

new Vue({
    el: '#app',
    router
})
