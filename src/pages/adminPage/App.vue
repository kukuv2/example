<style lang="less">
    body{
        border: 0;
        margin: 0;
        padding: 0;
    }
</style>
<template>
    <div>
        <v-header></v-header>
        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        data() {
            return {}
        },
        mounted() {
            this.appShow()
        },
        methods: {
            appShow() {
                document.querySelector('.app-loading').className += ' app-loading-hide'
            }
        }
    }
</script>