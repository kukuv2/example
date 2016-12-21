
import App from '../App'

export default [
    {
        path: '/',
        component: App,
        children: [
            /*{
                path: '/login', //登录
                meta: { auth: false },
                component: resolve => require(['../pages/login/'], resolve)
            },*/
            {
                path: '/action', //编辑页
                meta: { auth: false },
                component: resolve => require(['../singlePages/action/'], resolve)
            },
            {
                path: '/index', //默认页
                meta: { auth: false },
                component: resolve => require(['../singlePages/index/'], resolve)
            },
            {
                path: '/info/', //信息页
                meta: { auth: false },
                component: resolve => require(['../singlePages/info/'], resolve)
            },
            {
                meta: { auth: false },
                path: '/list/', //列表页
                component: resolve => require(['../singlePages/list/'], resolve)
            },
            {
                path: '*', //其他页面
                redirect: '/index'
            }
        ]
    }
]