<template>
    <div>
        <el-menu theme="dark"
                 default-active="1"
                 class="el-menu-demo"
                 mode="horizontal"
                 @select="handleSelect">
            <el-menu-item index="/index">
                主页
            </el-menu-item>
            <el-submenu index="2">
                <template slot="title">
                    某个项目
                </template>
                <el-menu-item index="/list">
                    列表页
                </el-menu-item>
                <el-menu-item index="/action?action=add">
                    新建页
                </el-menu-item>
                <el-menu-item index="/action?action=edit&id=1">
                    编辑页
                </el-menu-item>
                <el-menu-item index="/info?id=1">
                    查看页
                </el-menu-item>
            </el-submenu>
            <el-menu-item index="/other">
                其他页面
            </el-menu-item>
        </el-menu>
    </div>
</template>
<style lang="less"
       rel="stylesheet/less"
       scoped>
    a {
        color: silver;
    }
</style>
<script>
    export default{
        data(){
            return {}
        },
        methods: {
            handleSelect: function (key) {
                this.$router.push(key);
            }
        },
        components: {}
    }
</script>
