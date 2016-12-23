
import App from '../App'

export default [
    {
        path: '/',
        component: App,
        children: [
            {
                path: '/login', //登录
                meta: { auth: true },
                component: resolve => require(['../singlePages/login/'], resolve)
            },
            {
                path: '/monitor', //编辑页
                meta: { auth: true },
                component: resolve => require(['../singlePages/monitor/'], resolve)
            },
            {
                path: '/index', //默认页
                meta: { auth: false },
                component: resolve => require(['../singlePages/index/'], resolve)
            },
            {
                path: '*', //其他页面
                redirect: '/index'
            }
        ]
    }
]