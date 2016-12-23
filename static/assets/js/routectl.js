/**
 * @Author DPD
 * @Date 2016/6/16
 *   Route and order change events
 */
Global.routectlOnReady = function(){ 
};

/**
 * Load html code of page named viewName, and replace html code 
 * of document element named className with loaded text
 */
// @Refactor : this function should not be written here
// @Refactor : this process happens asynchronisly, and cannot
//             be controled by invoker
//TODO: footer page loading can be opmiszed, it can happy concurrently with other things in Global.Request.htmlPage(), and do replacing job sometime when document is loaded
var htmlInclude = function(className, viewName) {
  $.when(
    $.ajax({
        url : CONF.htmlFileUrl(viewName),
        dataType : 'text'
    })

  ).done(
    function(pageHtmlText) {
      $("." + className).replaceWith(pageHtmlText);
    }

  ).fail(
    function() {
      //TODO: error handling
      console.log("routectl.js::htmlInclude() : Failed!");
    }
  );

};

// show login dialog
// @Refactor : Should 'show login dialog' even appear in moduel 'route control'?
//             or say should any business login do?
//             The only reason why I 'HAVE TO' put it here is that I have no idea
//             how to put it right if I don't refactor the basic structrue, and,
//             sure, routectl.js is loaded before request.js(in which 'showLgoinDialog'
//             is used), and this remains when packing js code with gulp, otherwise
//             request.js may arise undefine error('may', I don't if the order matters,
//             it's too difficult to figure it out, for me at least).
// @Refactor : Big problem is, it's extremely difficult to tell if one function is 
//             call when decleared or not, nor if one function is initialized when
//             another function wants to invoke it.
//             The reason why this problem is arised is the use of 'Global' varable,
//             who provides cross-field-accessing, including both data and functions.
Global.showLoginDialog = function(loginHtml) {
    document.getElementById('loginContainer').innerHTML = loginHtml;
    Global.login.loginEvent();
    Global.login.showLogin();
};

Global.loadThenShowLoginDialog = function() {
    $.when($.ajax({
        url : CONF.htmlFileUrl("user/login"),
        dataType : "text"

    })).done(function(htmlText) {
        Global.showLoginDialog(htmlText);

    }).fail(function() {
        //TODO: error handling
        console.log("Failed to loadThenShowLoginDialog");
    });
};

Global.initRoute = (function() {
  var result = {};
  // when add new page, you can add configration here.
  // @Refactor : apart route & business logic
  Global.Router.route('/login', function () { 
    Global.Request.htmlPages('user/login', function(data) {
        Global.showLoginDialog(data);
    }); 
  });

  Global.Router.route('/', function () { 
    Global.Request.htmlPages('home/homepage', function(data) {
      $('.common-height').removeClass('change-header');
      if (data) {
        document.getElementById('bodyer').innerHTML = data;
      } 
      new Global.Home();

      htmlInclude("homepage-footer", "common/comfooter");
    }); 
  }); 

  Global.Router.route('/monitor', function () { 
    Global.Request.htmlPages('monitor/viewtarget', function() {
      $('.common-height').addClass('change-header');
      Global.productID = Global.productID ? Global.productID : '1';
      Global.monitor = new Global.Monitor(Global.productID);

      htmlInclude("monitor-footer", "common/footer");
    }); 
  });  

  Global.Router.route('/classification', function () { 
    Global.Request.htmlPages('classification/browse', function() {
      $('.common-height').addClass('change-header');
      new Global.Classification(); 

      htmlInclude("classification-foot", "common/footer");
    });  
  }); 

  Global.Router.route('/analyze', function () { 
    Global.Request.htmlPages('analyze/analyze', function() {
      $('.common-height').addClass('change-header');
      new Global.Analyze();
    });  
  }); 

  Global.Router.route('/report', function () { 
    Global.Request.htmlPages('report/report', function() {
      $('.common-height').addClass('change-header');
      Global.reportID = Global.reportID ? Global.reportID : '';
      Global.reportType = new Global.ReportType(Global.reportID);

      htmlInclude("report-footer", "common/footer");
    }); 
  }); 

  Global.Router.route('/weather', function () { 
    Global.Request.htmlPages('weather/browse', function() {
      $('.common-height').addClass('change-header');
      new Global.Weather();

      htmlInclude("weather-footer", "common/footer");
    }); 
  });

  Global.Router.route('/market', function () { 
    Global.Request.htmlPages('market/market', function() {
      $('.common-height').addClass('change-header');
      Global.market = new Global.MarketInfo();

      htmlInclude("market-footer", "common/comfooter");
    });  
  }); 

  Global.Router.route('/planting', function () { 
    Global.Request.htmlPages('planting/planting', function() {
      $('.common-height').addClass('change-header');
      Global.planting = new Global.Planting();

      htmlInclude("planting-footer", "common/footer");
    });
  });

  Global.Router.route('/cropvaluate', function () { 
    Global.Request.htmlPages('cropvaluate/cropvaluate', function() {
      $('.common-height').addClass('change-header');

      htmlInclude("cropvaluate-footer", "common/comfooter");
    });
  });

  Global.Router.route('/evaluation', function () { 
    Global.Request.htmlPages('land_evaluation/evaluation', function() {
      $('.common-height').addClass('change-header');
      
      htmlInclude("land-evaluation-footer", "common/comfooter");
    });
  }); 

  Global.Router.route('/occupation', function () { 
    Global.Request.htmlPages('land_occupation/occupation', function() {
      $('.common-height').addClass('change-header');
      
      htmlInclude("occupation-footer", "common/comfooter");
    });
  });

  Global.Router.route('/services', function () { 
    Global.Request.htmlPages('agricultural_services/services', function() {
      $('.common-height').addClass('change-header');
      
    });
  });

  //add order class here
  result.urlChange = function() {
    $(window).unbind();
    
    // @Refactor : bad apple here because of usage of global varable and lack of structure for logic flow
    Global.productID = 1;

    var router = "#" + (location.hash.slice(1) ? location.hash.slice(1) : '/');
    var list = $('.order li');
    for (var i = 0; i < list.length; i++) {
      if(list.eq(i).children().attr('href') == router) {
        list.eq(i).click();
        list.eq(i).addClass('active');
        $.cookie("login_url",router);
        break;
      }
    }
    
  }

  return result;
})();
