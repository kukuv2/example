<style lang="less">
    body {
        border: 0;
        margin: 0;
        padding: 0;
    }
</style>
<template>
    <div>
        <v-header></v-header>
        <router-view></router-view>
        <v-footer v-show="showFooter"></v-footer>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                showFooter: false
            }
        },
        mounted() {
            this.appShow()
            this.$store.dispatch('getUserInfo')
        },
        methods: {
            appShow() {
                console.log('loaded');
                document.querySelector('.app-loading').className += ' app-loading-hide'
            }
        },
        watch: {
            $route: {
                handler: function ({query, path}) {
                    if (path.indexOf('monitor') > -1) {
                        this.showFooter = true
                    } else {
                        this.showFooter = false
                    }
                },
                immediate: true
            }
        },
        components: {}
    }
</script>