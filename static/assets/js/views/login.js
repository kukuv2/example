/**
 * @Author DPD
 * @Date 2016/6/16
 * Login control and location reload
 */
 Global = Global ? Global : {};

 Global.loginOnReady = function(){ 
  Global.login = (function(){
    var result = {};
    
    result.showLogin = function() {
      $('.login').show();
      $('header').addClass('bj-blur');
      $('#bodyer').addClass('bj-blur');
      $('#loginContainer').addClass('login-container');
      $('body').css('overflow', 'hidden');
    }

    result.hideLogin = function() {
      $('.login').hide();
      $('header').removeClass('bj-blur');
      $('#bodyer').removeClass('bj-blur');
      $('#loginContainer').removeClass('login-container');
      $('body').css('overflow', 'auto');

      location.hash = '#/';
      $('.go-homepage').addClass('active').siblings().removeClass('active');
    }

    result.loginEvent = function (){

      // login click
      $('.login-delete').on('click',function(event) {
        result.hideLogin();
      });
      
      $('.click-login').on('click',function(event) {
        result.showLogin();
      });
      
      $('.login-form input:eq(0)').on('focus', function() {
        $('.icon-user').css('fill','#b79048');
      });
      $('.login-form input').on('blur', function() {
        $('.login-form svg').css('fill','#a9a8a8');
      });
      $('.login-form input:eq(1)').on('focus', function() {
        $('.icon-lock').css('fill','#b79048');
      });
    }

    result.keypress = function(e) {
      e = arguments.callee.caller.arguments[0] ? arguments.callee.caller.arguments[0] : window.event;
      if((e.keyCode || e.which) === 13){
        result.checkPassword();
      }
    }

    result.checkPassword = function() {
      if(!loginForm.account.value || !loginForm.password.value){
        $('.login-error').html('用户名或密码错误，请重新输入！');
        $('.login-error').show();
        return;
      }
      var options = {
        data: {
          account: loginForm.account.value,
          password: loginForm.password.value
        },
        callback: verifyLogin
      }
      Global.Request.login(options);
    }

    var verifyLogin = function(data) {
      if(data.status === 200) {
        $.cookie("tokenID", data.token);
        $.cookie("areaCode", data.areacode);
        window.location.href = !$.cookie("login_url") ? 
        CONF.baseUrl : CONF.baseUrl + $.cookie("login_url");
        window.location.reload();
      } else if (data.status === 400 || data.status === 500) {
        $('.login-error').html('用户名或密码错误，请重新输入！');
        $('.login-error').show(); 
      } else {
        $('.login-error').html('出现异常，请联系管理员！<br/>' + data.msg);
        $('.login-error').show(); 
      }
    }
    
    return result;
  })();

 };
