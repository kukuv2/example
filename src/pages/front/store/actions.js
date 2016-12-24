
export const getUserInfo = ({ commit }) => {
    userLoginStateRequest('',commit)
}

export const login = ({ commit },name) => {
    userLoginStateRequest(name,commit)
}



var userLoginStateRequest = function(name,commit) {
    $.when(
        (function () {
            return $.ajax({
                url : CONF.serverBaseUrl + 'user/isLogin?name=' + name,
                dataType : 'json'
            });
        })()
    ).done(function(userLoginStateResponse) {
        var userLoginState = userLoginStateResponse[0];
        var isLogin = userLoginState.is_login ? true : false;
        var userName = userLoginState.username;
        commit('initHeader',{
            isLogin,
            userName
        })

    }).fail(function() {

    });
};
