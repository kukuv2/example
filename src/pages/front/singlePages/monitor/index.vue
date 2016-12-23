<template>
    <div class="formWrap">
    </div>
</template>
<style lang="less"
       rel="stylesheet/less"
       scoped>
    .formWrap {
        margin-top: 30px;
        width: 500px;
    }
</style>
<script>
    import axios from 'axios'
    export default{
        data() {
            return {
            }
        },
        methods: {
            onSubmit() {
                debugger
                alert('submit!');
            },
            onCancel(){
                alert('cancel');
            }
        },
        watch: {
            $route: {
                handler: function ({query}) {
                },
                immediate: true
            }
        },
        components: {}
    }
</script>
