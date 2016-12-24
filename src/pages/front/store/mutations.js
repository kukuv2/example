import {set} from 'vue'

export default {
    initHeader (state, {isLogin, userName}) {
        state.user.login = isLogin
        state.user.userName = userName
    },
    logout(state){
        state.user = {
            login:false,
            userName:''
        }
    }
}