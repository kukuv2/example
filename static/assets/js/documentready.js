$(document).ready(function() {
    // common
    Global.commonOnDocumentReady();
    // routectl
    // Global.routectlOnReady();
    // request
    Global.requestOnReady();
    // login
    Global.loginOnReady();

    // query user's login status & load header static page & redner header
    // initHeader();
});

// init header 
// @Refactor : should be in file : views/header.js
var initHeader = function() {
    $.when(
        userLoginStateRequest()/*, headerPageRequest()*/

    ).done(function(userLoginStateResponse, headerPageResponse) {
        var userLoginState = userLoginStateResponse[0];
        // var htmlText = headerPageResponse[0];

        // CAUTION: data format checking for interface<user/isLogin> is implicit here,
        // error occured when 'is_login' cannot be found is regard 
        // as 'not yet login', the same as 'resp.is_login === false'
        var isLogin = userLoginState.is_login ? true : false;
        var userName = userLoginState.username;

        // renderHeader(htmlText, isLogin, userName);
        renderHeader(isLogin, userName);
        initHeaderEvtAndStyle();

    }).fail(function() {
        onInitHeaderFailed();
    });

};

// query user's login status as json data, and return deferred object for this request
// @Refactor : should be in file userRequest.js, it is the very request moduale thing
var userLoginStateRequest = function() {
    return $.ajax({
        url : CONF.serverBaseUrl + 'user/isLogin',
        dataType : 'json'
    });
};

// load header page's html code as text, and return deferred object for this request
// @Refactor : should be in file views/header.js, it is the very request moduale thing
var headerPageRequest = function() {
    return $.ajax({
        url : CONF.htmlFileUrl('common/header'),
        dataType : 'text'
    });
};

// after header page's html text and user's login information is successly responsed, render it
// @Refactor : should be in file view/header.js
var renderHeader = function(isLogin, userName) {
    // $(".index-header").replaceWith(headerPage);
    if (isLogin) {
        $(".header-username").text(userName);
        $(".header-login-href")
            .attr("href", "javascript:void(0)")
            .removeClass("click-login")
            .text("注销");

        // register logout handler
        $(".header-login-href").on("click", onLogout);

    } else {
        $(".header-username").text("用户名");
        $(".header-login-href")
            .attr("href", "#/login")
            .addClass("click-login")
            .text("登录");
    }
};

var initHeaderEvtAndStyle = function() {
  $('.order li').on('click', function(){
    $(this).addClass('active').siblings().removeClass('active');
    $(document).scrollTop(0);
    
    if ($('.header-navbar-right').hasClass('header-navbar-list')) {
      $('.header-navbar-right').addClass('hide');
    }
  });

  $(window).resize(function() {
    headWidth();
  });

  function headWidth(){
    var setWidth = 830;
    if($(window).width() <= setWidth){
      $('.header-navbar-icon').show();
      $('.header-navbar-right').addClass('header-navbar-list');
      $('.header-navbar-right').addClass('hide');

      if (!Global.initHeadEvt) {
        Global.initHeadEvt = true;
        $('.header-navbar-icon').on('click',function() {
          if ($('.header-navbar-right').hasClass('hide')) {
            $('.header-navbar-right').removeClass('hide');
          } else {
            $('.header-navbar-right').addClass('hide');
          }
        });
      }
    }else{
      $('.header-navbar-right').removeClass('hide');
      $('.header-navbar-icon').hide();
      $('.header-navbar-right').removeClass('header-navbar-list');
    }
  }
  headWidth();
};

// do logout
var onLogout = function() {
    $.when($.ajax({
        url: CONF.serverBaseUrl + "user/logout"
    }))

    .always(function() {
       window.location.href = CONF.baseUrl; 
    });
}

//TODO: error handling when any erro ocurred when init header
var onInitHeaderFailed = function() {
    console.log('documentready.js: cannot get user/isLogin or views/common/header.html, fucked!');
};

