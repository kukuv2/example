<template>
    <div class="login">
        <div class="login-bj">
            <h3>用户登录</h3>
            <form id="loginForm"
                  action=""
                  method="post"
                  class="login-form"
                  autocomplete="off">
                <ul>
                    <li>
                        <div>用户名:</div>
                        <p>
							<span>
								<svg class="icon-user"
                                     viewBox="0 0 1024 1024"
                                     version="1.1"
                                     xmlns="http://www.w3.org/2000/svg"
                                     p-id="5879"
                                     width="12"
                                     height="12"><defs></defs><path d="M511.953 597.281c164.928 0 298.65-133.7 298.65-298.642C810.603 133.7 676.881 0 511.953 0 347.038 0 213.314 133.7 213.314 298.639c0.002 164.94 133.724 298.642 298.639 298.642z m239.335-26.091c-63.852 56.082-147.563 90.103-239.232 90.103-91.661 0-175.369-34.021-239.227-90.103C110.564 657.095 0 827.623 0 1024h1024.115c0-196.377-110.571-366.905-272.827-452.81z"
                                                                    fill=""
                                                                    p-id="5880"></path></svg>
							</span>
                            <input type="text"
                                   name="account"
                                   class="u-account"
                                   v-model="name"
                                   required="required"/>
                        </p>
                    </li>
                    <li>
                        <div>密码:</div>
                        <p>
							<span>
								<svg class="icon-lock"
                                     viewBox="0 0 1024 1024"
                                     version="1.1"
                                     xmlns="http://www.w3.org/2000/svg"
                                     p-id="6675"
                                     width="14"
                                     height="14"><defs></defs><path d="M813.727 406.147l-87.369 0L726.358 299.102c0 0 19.184-213.94-214.357-213.94 0 0-211.855 0-211.855 215.191l0 105.794-89.872 0c-24.275 0-44.136 19.861-44.136 44.136l0 444.417c0 24.275 19.861 44.138 44.136 44.138l603.453 0c24.275 0 44.136-19.863 44.136-44.138L857.863 450.283C857.863 426.009 838.001 406.147 813.727 406.147zM379.382 406.147 379.382 300.353c0 0-1.668-135.12 136.788-135.12 0 0 130.533-4.17 130.533 133.452l0 107.462L379.382 406.147z"
                                                                    p-id="6676"></path></svg>
							</span>
                            <input type="password"
                                   name="password"
                                   class="u-pwd"
                                   onkeydown="Global.login.keypress()"
                                   required="required"/>
                        </p>
                    </li>
                    <li class="clear mt20">
                        <p class="fl login-error">密码输入错误，请重新输入</p>
                        <p class="login-btn fr">
                            <input type="button"
                                   class="btn btn-primary"
                                   value="登录"
                                   @click="login">
                        </p>
                    </li>
                </ul>
            </form>
            <div class="login-delete">
                <span class="login-close">&times</span>
            </div>
        </div>
    </div>
</template>
<style lang="less"
       rel="stylesheet/less">

</style>
<script>
    export default{
        data(){
            return {
                name: ''
            }
        },
        created(){
        },
        methods: {
            login: function () {
                this.$store.dispatch('login', this.name)
            }
        },
        components: {}
    }
</script>
