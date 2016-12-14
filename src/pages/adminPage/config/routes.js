
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
                path: '/action', //关于
                meta: { auth: false },
                component: resolve => require(['../singlePages/action/'], resolve)
            },
            {
                path: '/index', //查看用户信息
                meta: { auth: false },
                component: resolve => require(['../singlePages/index/'], resolve)
            },
            {
                path: '/info/', //我的个人中心
                meta: { auth: false },
                component: resolve => require(['../singlePages/info/'], resolve)
            },
            {
                meta: { auth: false },
                path: '/list/', //我的消息
                component: resolve => require(['../singlePages/list/'], resolve)
            },
            {
                path: '*', //其他页面
                redirect: '/index'
            }
        ]
    }
]