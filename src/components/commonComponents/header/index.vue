<template>
    <header class="common-height change-header index-header">
        <div class="header-top clear">
            <p class="fl header-top-left">
                <span class="iconfont icon-dianhua head-phone"></span>
                <i>平台客服：010-52918959</i>
            </p>
            <div class="fr">
                <ul class="navbar-right logout clear">
                    <li class="login-person iconfont icon-yonghuming header-username">{{userName?userName:'用户名'}}</li>
                    <li>
                        <span>|</span>
                        <a class="click-login header-login-href" @click="handleSelect"
                                     :to="login ? '/logout' : '/login'">
                            {{login ? '登出' : '登录'}}
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <nav class="navbar-default clear"
             role="navigation">
            <div class="header-navbar-left">
                <a class="navbar-logo no-select"
                   href="#/">
                    <img src="/static/assets/images/common/logo.png">
                </a>
            </div>
            <span class=" header-navbar-icon">
      <svg class="icon"
           style=""
           viewBox="0 0 1024 1024"
           version="1.1"
           xmlns="http://www.w3.org/2000/svg"
           p-id="5155"
           width="16"
           height="16"><defs></defs><path d="M941.713 268.189v-73.143q0-14.857-10.857-25.714t-25.714-10.857h-804.571q-14.857 0-25.714 10.857t-10.857 25.714v73.143q0 14.857 10.857 25.714t25.714 10.857h804.571q14.857 0 25.714-10.857t10.857-25.714zM941.713 560.76v-73.143q0-14.857-10.857-25.714t-25.714-10.857h-804.571q-14.857 0-25.714 10.857t-10.857 25.714v73.143q0 14.857 10.857 25.714t25.714 10.857h804.571q14.857 0 25.714-10.857t10.857-25.714zM941.713 853.332v-73.143q0-14.857-10.857-25.714t-25.714-10.857h-804.571q-14.857 0-25.714 10.857t-10.857 25.714v73.143q0 14.857 10.857 25.714t25.714 10.857h804.571q14.857 0 25.714-10.857t10.857-25.714z"
                                          p-id="5156"></path></svg>
    </span>
            <div id="example-navbar-collapse"
                 class="header-navbar-right">
                <ul class="order">
                    <li class="go-homepage"
                        :class="getPageActive('index')">
                        <router-link to="/index">首页</router-link>
                    </li>
                    <li class="go-viewtarget"
                        :class="getPageActive('monitor')">
                        <router-link to="/monitor">遥感监测</router-link>
                    </li>
                    <li class="go-classification">
                        <a href="#/classification">作物分布</a>
                    </li>
                    <li class="go-analyze">
                        <a href="#/analyze">数据分析</a>
                    </li>
                    <li class="go-report">
                        <a href="#/report">农情报告</a>
                    </li>
                    <li class="go-weather">
                        <a href="#/weather">气象数据</a>
                    </li>
                    <li class="go-market">
                        <a href="#/market">市场信息</a>
                    </li>
                    <li class="go-planting">
                        <a href="#/planting">种植规划</a>
                    </li>
                    <li class="go-cropvaluate">
                        <a href="#/cropvaluate">作物估产</a>
                    </li>
                    <li class="go-evaluation">
                        <a href="#/evaluation">土地评估</a>
                    </li>
                    <li class="go-occupation">
                        <a href="#/occupation">耕地占用</a>
                    </li>
                    <li class="go-services">
                        <a href="#/services">农资服务</a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
</template>
<style lang="less"
       rel="stylesheet/less"
       scoped>
    .banner {
        overflow: hidden;
        width: 100%;
        height: 100%;
        margin-top: 100px;
    }

    .platform-introduction,
    .crop-reports {
        position: relative;
        background: url('~assets/images/home/bg-shading.png') repeat-x;
    }

    .platform-introduction {
        height: 384px;
    }

    .platform-function {
        height: 508px;
        background: url('~assets/images/home/bg-function.png');
        background-size: cover;
    }

    .crop-reports {
        height: 588px;
    }

    .index-footer {
        width: 100%;
        height: 156px;
        background: #d1c1a5;
    }

    .banner img {
        position: absolute;
        z-index: -1;
    }

    .banner-txt {
        top: 50%;
        left: 50%;
        width: 462px;
        height: 140px;
        margin-top: -70px;
        margin-left: -212px;
        text-align: center;
        color: #fff;
    }

    .banner-txt h3 {
        font-size: 32px;
        line-height: 76px;
    }

    .banner-txt p {
        font-size: 14px;
        line-height: 24px;
    }

    .banner span {
        font-size: 50px;
        font-weight: bold;
        position: absolute;
        top: 50%;
        width: 50px;
        height: 55px;
        margin-top: -25px;
        cursor: pointer;
        opacity: .6;
        color: #fff;
    }

    .banner .pre {
        left: 5%;
    }

    .banner .next {
        right: 5%;
    }

    .banner-click {
        bottom: 20px;
        left: 50%;
        margin-left: -45px;
        text-align: center;
    }

    .banner-click li {
        float: left;
        width: 12px;
        height: 12px;
        margin: 0 10px;
        cursor: pointer;
        border-radius: 50%;
        background: #fff;
    }

    .banner-click .active {
        font-size: 14px;
        position: relative;
        top: -4px;
        width: 12px;
        height: 12px;
        color: #fff;
        background: none;
    }

    .home-p {
        font-size: 20px;
        padding-top: 26px;
        text-align: center;
    }

    .home-p h3 {
        font: normal 20px/38px 'Microsoft YaHei';
    }

    .home-p span {
        display: block;
        width: 100px;
        height: 14px;
        margin: 18px auto 34px;
        background: url('~assets/images/home/home-icon.png') 0 0 no-repeat;
    }

    .platform-function .home-p {
        color: #5e574a;
    }

    .arrow-bottom {
        bottom: 24px;
        left: 50%;
        width: 26px;
        height: 26px;
        margin-left: -14px;
    }

    .introduction-page {
        font-size: 14px;
        line-height: 24px;
        text-align: center;
        text-indent: 2em;
        color: #956c18;
    }

    .function-ul {
        overflow: hidden;
        margin-top: 28px;
    }

    .function-ul li {
        float: left;
        width: 158px;
        margin: 0 52px 28px;
        text-align: center;
    }

    .function-ul li a {
        display: block;
        cursor: pointer;
        text-decoration: none;
    }

    .function-ul li a:hover svg {
        fill: #fff;
    }

    .function-ul li span {
        display: block;
        width: 112px;
        height: 112px;
        margin: 0 auto;
        -webkit-transition: border 1s ease-in-out;
        -moz-transition: border 1s ease-in-out;
        -ms-transition: border 1s ease-in-out;
        -o-transition: border 1s ease-in-out;
        transition: border 1s ease-in-out;
        border: 10px solid #e6e6d5;
        border-radius: 50%;
        background: #fff;
    }

    .function-ul li span:hover {
        animation: glow 1s infinite ease-in-out alternate;
    }

    @keyframes glow {
        0% {
            border-color: rgba(230, 230, 213, .6);
        }
        100% {
            border-color: #e6e6d5;
        }
    }

    .function-ul li svg {
        fill: #ba8c2f;
    }

    .function-ul li .home-svg1 {
        width: 54px;
        height: 60px;
    }

    .function-ul li .home-svg2 {
        width: 54px;
        height: 54px;
    }

    .function-ul li .home-svg3 {
        width: 58px;
        height: 54px;
    }

    .function-ul li .home-svg4 {
        width: 54px;
        height: 51px;
        margin-top: 6px;
        margin-left: 2px;
    }

    .function-ul li .home-svg5 {
        width: 70px;
        height: 58px;
    }

    .function-ul li .home-svg6 {
        width: 54px;
        height: 60px;
    }

    .function-ul li h3 {
        font-size: 12px;
        font-weight: bold;
        -webkit-user-select: none;
        -moz-user-select: none;
        -o-user-select: none;
        user-select: none;
    }

    .function-ul li a:hover span {
        background: #ba8c2f;
    }

    .function-ul li a:hover h3 {
        color: #fff;
    }

    .arrow-slide {
        margin-top: 40px;
    }

    .index-footer ul {
        height: 50px;
        padding-top: 30px;
    }

    .index-footer li {
        float: left;
        margin: 0 14px;
    }

    .index-footer .footer-icon {
        font-size: 30px;
        line-height: 46px;
        display: inline-block;
        width: 50px;
        height: 50px;
        text-align: center;
        color: #f7f4ed;
        border-radius: 50%;
        background: rgba(255, 255, 255, .4);
    }

    .index-footer .footer-address {
        display: inline-block;
        width: 172px;
        margin-left: 10px;
        color: #453f38;
    }

    .index-footer .home-footer {
        line-height: 44px;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 44px;
        text-align: center;
        color: #fff;
        background: #453f38;
    }

    #bottom-turn {
        width: 520px;
        height: 350px;
        margin: 0 auto;
    }

    #bottom-turn ul {
        overflow: hidden;
        width: 520px;
        height: 352px;
    }

    #bottom-turn li {
        position: absolute;
        z-index: 0;
        top: 146px;
        left: 377px;
        overflow: hidden;
        width: 0;
        height: 0;
        cursor: pointer;
        box-shadow: 0 3px 5px #c3c2c2;
    }

    #bottom-turn li a {
        color: #404342;
    }

    #bottom-turn li img {
        width: 100%;
        height: 100%;
        vertical-align: top;
    }

    #bottom-turn .bottom-prev,
    #bottom-turn .bottom-next {
        font-size: 24px;
        position: absolute;
        top: 50%;
        overflow: hidden;
        width: 27px;
        height: 27px;
        margin-top: -14px;
        cursor: pointer;
    }

    #bottom-turn .bottom-prev {
        left: -60px;
    }

    #bottom-turn .bottom-next {
        right: -60px;
    }

    #bottom-turn p {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 62px;
        text-indent: 12px;
        border-bottom: 12px solid #5d4e49;
        background: rgba(255, 255, 255, .4);
    }

    .turn-top {
        bottom: 24px;
        left: 50%;
        width: 14px;
        height: 18px;
        margin-left: -7px;
    }

    .turn-black {
        bottom: 24px;
        left: 50%;
        width: 26px;
        height: 26px;
        margin-left: -14px;
        background: url('~assets/images/home/turn-black.gif') no-repeat;
    }

    .header-top {
        line-height: 40px;
        width: 100%;
        height: 40px;
        color: #dab76e;
        background: #434343;
    }

    .header-top-left {
        margin-left: 102px;
    }

    .login-container {
        position: fixed;
        z-index: 101;
        top: 0;
        width: 100%;
        height: 100%;
    }

    .home-slide {
        opacity: 1;
    }
</style>
<script>
    import {mapState} from 'vuex'
    export default{
        data(){
            return {
                pageActive: {
                    active: true
                }
            }
        },
        computed: {
            ...mapState({
                userName: function (state) {
                    return state.user.userName
                },
                login: function (state) {
                    var login = state.user.login
                    if(login){
                        this.$router.push('/index');
                    }
                    return login
                }
            })
        },
        methods: {
            handleSelect: function () {
                debugger
                if(this.login){
//                    return this.$router.push('/logout')
                    return this.$store.commit('logout')
                }
                this.$router.push('/login')
            },
            getPageActive: function (path) {
                var showActive = false;
                if (this.$route.path.indexOf(path) > -1) {
                    showActive = true
                }
                return {
                    active: showActive
                }
            }
        },
        components: {}
    }
</script>
