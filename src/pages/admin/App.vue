<style lang="less">
    body{
        border: 0;
        margin: 0;
        padding: 0;
    }
</style>
<template>
    <div>
        <admin-header></admin-header>
        <router-view></router-view>
    </div>
</template>
<script>
    import adminHeader from 'bComponents/admin/header'
    export default {
        data() {
            return {}
        },
        mounted() {
            this.appShow()
        },
        methods: {
            appShow() {
                console.log('loaded');
                document.querySelector('.app-loading').className += ' app-loading-hide'
            }
        },
        components:{
            adminHeader
        }
    }
</script>