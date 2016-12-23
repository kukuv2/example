/**
 * @Author DPD
 * @Date 2016/6/16
 * All of the HTTP requests here
 */
Global.requestOnReady = function(){ 

  Global.Request = (function() {
    var result = {};
    var cache = new Global.Cache();

    result.dlPriceExcel = function(options) {
      var url = '?farm_product_id=' + options.fpId + '&market_id=' + options.marketId + 
                '&date_type=' + options.dateType + '&filename=' + options.fileName; 
      window.open(CONF.serverBaseUrl + 'market/export_price_info' + url);
    }
    
    result.downloadExcel = function(options) {
      var url = '?start=' + options.start + '&end=' + options.end + 
                '&index=' + options.index + '&area=' + options.area + '&filename=' + options.filename; 
      window.open(CONF.serverBaseUrl + 'analyze/exportExcel' + url);
    }

    result.cropSingleLine = function(options) {
      cache.get(CONF.apiUrl + 'crop/market/'+ options.fpId +'/select-market/'+ options.marketId + '/' + options.dateType +'/price', 
        function(data) {
          options.callback(data); 
        },
        true
      );
    }

    result.sutResultInfo = function(options) {
      cache.get(CONF.apiUrl + 'suitability/'+ options.code +'/'+ options.crop +'/result-info', 
        function(data) {
          options.callback(data); 
        },
        true
      );
    }

    result.pointSutInfo = function(options) {
      cache.get(CONF.apiUrl + 'suitability/'+ options.code +'/'+ options.crop +'/point/'+ options.lon +'/'+ options.lat +'/element-info', 
        function(data) {
          options.callback(data); 
        },
        true
      );
    }

    result.marketPriceInfo = function(options) {
      cache.get(CONF.apiUrl + 'crop/market/'+ options.areaId +'/all-markets/'+ options.cropId +'/price/compare/'+ options.dateType + '/' + options.pageIndex + '/' + options.pageCount, 
        function(data) {
          options.callback(data); 
        },
        true
      );
    }

    result.lineAveragePrice = function(options) {
      cache.get(CONF.apiUrl + 'crop/market/'+ options.fpId +'/nationwide/'+ options.dateType +'/avg-price', 
        function(data) {
          options.callback(data); 
        },
        true
      );
    }

    result.barAveragePrice = function(options) {
      cache.get(CONF.apiUrl + 'crop/market/'+ options.fpId +'/areas/'+ options.dateType +'/avg-price', 
        function(data) {
          options.callback(data); 
        },
        true
      );
    }

    result.marketAreaPriv = function(callback) {
      cache.get(CONF.serverBaseUrl + 'market/user_permissions_manager', 
        function(data) {
          callback(data); 
        },
        true
      );
    }

    result.sonAreaInfo = function(options) {
      cache.get(CONF.apiUrl + 'crop/area-crop-son/list/' + options.areaCode + '/' + options.cropId + '/' + options.source + '/' + options.startDate + '/' + options.endDate, 
        function(data) {
          options.callback(data); 
        },
        true
      );
    }

    result.userOrigin = function(callback) {
      cache.get(CONF.serverBaseUrl + 'market/market_info_area', 
        function(data) {
          callback(data); 
        },
        true
      );
    }

    result.newPriceInfo = function(options) {
      cache.get(CONF.apiUrl + 'crop/actual-market-crop/newest/' + options.marketId + '/' + options.cropId, 
        function(data) {
          options.callback(data); 
        },
        true
      );
    }

    result.marketPrice = function(options) {
      cache.get(CONF.apiUrl + 'crop/actual-market-crop/list/' + options.marketId + '/' + options.cropId + '/' + options.startDate + '/' + options.endDate, 
        function(data) {
          options.callback(data); 
        },
        true
      );
    }

    result.selfAreaInfo = function(options) {
      cache.get(CONF.apiUrl + 'crop/area-crop-self/list/' + options.areaCode + '/' + options.cropId + '/' + options.startDate + '/' + options.endDate, 
        function(data) {
          options.callback(data); 
        },
        true
      );
    }

    result.marketList = function(callback) {
      cache.get(CONF.apiUrl + 'crop/market-list', 
        function(data) {
          callback(data); 
        },
        true
      );
    }

    result.originArea = function(callback) {
      cache.get(CONF.serverBaseUrl + 'market/origin_area_list', 
        function(data) {
          callback(data); 
        },
        true
      );
    }

    result.cropList = function(callback) {
      cache.get(CONF.serverBaseUrl + 'market/crop_list', 
        function(data) {
          callback(data); 
        },
        true
      );
    }

    result.statistics = function(url, callback) {
      cache.get(CONF.apiUrl + 'modis-product/statistics/' + url, 
        function(data) {
          callback(data); 
        },
        true
      );
    }

    result.homeReport = function(callback) {
      cache.get(CONF.serverBaseUrl + "home/getreport", 
        function(data) {
          callback(data); 
        },
        true
      );
    }

    result.homeCarousel = function(callback) {
      cache.get(CONF.serverBaseUrl + "home/getcarousel", 
        function(data) {
          callback(data); 
        },
        true
      );
    }

    result.dynamicDistribute = function(id, callback) {
      cache.get(CONF.apiUrl + "distribute/dcp-info/batch?ids=" + id, 
        function(data) {
          callback(data); 
        },
        true
      );
    }

    result.dynamicDistributeId = function(callback) {
      cache.get(CONF.serverBaseUrl + "classification/get_user_moving_classification", 
        function(data) {
          callback(data); 
        },
        true
      );
    }

    result.distributeList = function(callback) {
      cache.get(CONF.serverBaseUrl + "classification/getUserClassificationResult", 
        function(data) {
          callback(data); 
        },
        true,
        false
      );
    }

    result.distributeById = function(ids, callback) {
      cache.get(CONF.apiUrl + 'distribute/info/batch?ids=' + ids, 
        function(data) {
          callback(data); 
        },
        true,
        false
      );
    }

    result.getLayerName = function (options) {
      cache.get(CONF.apiUrl + 'atmos/' + options.areaCode + '/' + options.type + '/' + options.index + '/' + options.grade + '/' + options.date + '/' + options.date, 
        function(data) {
          options.callback(data); 
        },
        true
      );
    }

    result.atmosRecent = function (options) {
      cache.get(CONF.apiUrl + 'atmos/recent/' + options.areaCode + '/' + options.type + '/' + options.index + '/' + options.grade, 
        function(data) {
          options.callback(data); 
        },
        true
      );
    }

    result.weatherFeature = function(options) {
      cache.get(CONF.apiUrl + 'atmos/element/' + options.stationId + '/' + options.index + '/' + options.startDate + '/' + options.endDate, 
        function(data) {
          options.callback(data); 
        },
        true
      );
    }

    result.weatherStations = function(showAll, callback) {
      var show = showAll ? 0 :1;
      cache.get(CONF.apiUrl + 'atmos/stations/' + show, 
        function(data) {
          callback(data); 
        },
        true
      );
    }

    result.latestProduct = function(productType, code, callback) {
      cache.get(CONF.apiUrl + 'modis-product/grade/recent/' + productType + '/' + code, 
        function(data) {
          callback(data); 
        },
        true
      );
    }

    result.existProduct = function(productType, code, startYear, endYear, callback) {
      cache.get(CONF.apiUrl + 'modis-product/grade/exist/' + productType + '/' + code + '/' + startYear + '/' + endYear, 
        function(data) {
          callback(data); 
        },
        true,
        false
      );
    }

    // get average product data by API
    result.lineData = function(options, callback) {
      cache.get(CONF.apiUrl + 'modis-product/mean/' + options.url, 
        function(data) {
          callback(data, options); 
        },
        true,
        false
      );
    }

    result.barData = function(options, callback) {
      cache.get(CONF.apiUrl + 'modis-product/grade/' + options.url, 
        function(data) {
          callback(data, options); 
        },
        true,
        false
      );
    }
    
    result.areaBounds = function(code, callback) {
      cache.get(CONF.apiUrl + "geoinfo/area/" + code, 
        function(data) {
          callback(data); 
        },
        true,
        false
      );
    }

    result.cantonTree = function(callback){
      cache.get(CONF.serverBaseUrl + "monitor/areaList", 
        function(data) {
          callback(data); 
        },
        true,
        false
      );
    }

    result.productList = function(callback) {
      cache.get(CONF.serverBaseUrl + "monitor/product", 
        function(data) {
          callback(data); 
        },
        true
      );
    }

    result.reportType = function(callback){
      cache.get(CONF.serverBaseUrl + "report/specialList", 
        function(data) {
          callback(data); 
        },
        true
      );
    }

    result.getToken = function(callback){
      cache.get(CONF.serverBaseUrl + "user/get_new_child_token",
        function(data) {
          callback(data); 
        },
        false,
        false
      );
    }

    result.reportList = function(data, callback){
      cache.post(CONF.serverBaseUrl + "report/reportList", 
        data, 
        function(data) {
          callback(data); 
        }
      );
    }


    // Post method
    result.getPartAreas = function(options) {
      cache.post(CONF.apiUrl + "geoinfo/arealist/all",
        JSON.stringify(options.data), 
        function(data) {
          options.callback(data); 
        }, 
        "application/json"
      );
    }

    result.marketReport= function(options) {
      cache.post(CONF.serverBaseUrl + "market/get_section_report", 
        options.data, 
        function(data) {
          options.callback(data); 
        }
      );
    }

    result.marketNews = function(options){
      cache.post(CONF.serverBaseUrl +'market/get_market_info_news', 
        {perPage: options.pageSize, curPage: options.pageIndex}, 
        function(data) {
          options.callback(data); 
        }
      );
    }

    result.login = function(options){
      cache.post(CONF.serverBaseUrl + 'user/login', 
        options.data, 
        function(data) {
          options.callback(data); 
        }
      );
    }

    // render page when is login
    var renderPage = function(_data, callback) {
      if (typeof callback != 'function') {
          return;
      }

      document.getElementById('bodyer').innerHTML = _data; 
      callback();
    }

    // render homepage
    var renderHomePage = function(_data, callback) {
      if (typeof callback != 'function') {
          return;
      }

      callback(_data);
    }

    // get html pages using for route
    // @Refactor : should written in readable way
    result.htmlPages = function(pageUrl, callback) {
      cache.get(
        CONF.serverBaseUrl + "user/isLogin", 

        function(data) {
          var isLogin = data.is_login; 
          // Each view is unfit to use common 'requestSuccess' method.
          // Add page cache 
          pageUrl = (isLogin || pageUrl =='home/homepage') ? pageUrl : 'user/login';

          // @Refactor : this line (cache object ensuring) should move to cache module
          result.cache = result.cache ? result.cache : {};

          // @Refactor : wheather cache is used should be transparent to request logic
          if (result.cache[pageUrl]) {
            __renderPage(isLogin, pageUrl, result.cache[pageUrl], callback);

          } else {
            // @Refactor : way that how pages are loaded should be transparent to what to do with them
            $.when($.ajax({ 
              url: CONF.htmlFileUrl(pageUrl),
              dataType: "TEXT",
              type: "GET"
            }))

            .fail(
              // page request error handle
              requestError
            )

            .done(function(pageHtmlText) { 
              // cache this page
              // @Refactor : this line (caching) should move to cache module
              // 为什么缓存里有，这里还有？
              result.cache[pageUrl] = pageHtmlText;
            })

            .then(function(){
              // after page html text is cached, use cached page to render
              __renderPage(isLogin, pageUrl, result.cache[pageUrl], callback);
            });
          }

          // render page main function
          // @Refactor : this enterance function should not exist
          function __renderPage(isLogin, pageUrl, pageHtmlText, callback) {
            Global.initRoute.urlChange();

            if (isLogin) {
              renderPage(pageHtmlText, callback);

            } else if (pageUrl == 'home/homepage') {
              renderHomePage(pageHtmlText, callback);

            } else {
              Global.showLoginDialog(pageHtmlText);
            }
          }
        },

        false,

        false
      );
    }

    result.tdtPoi = function(options) {
      $.ajax({
        url: 'http://api.tianditu.com/apiserver/ajaxproxy?proxyReqUrl=http%253A%252F%252Fmap.tianditu.com%252Fquery.shtml%253FpostStr%253D%257B%2522lon%2522%253A%2522'+
          options.lon +'%2522%252C%2522lat%2522%253A%2522' + options.lat +
          '%2522%252C%2522appkey%2522%253A%25228a7b9aac0db21f9dd995e61a14685f05%2522%252C%2522ver%2522%253A%25221%2522%257D%2526type%253Dgeocode',
        success: options.callback,
        error: requestError  
      });
    }

    return result;
  })();

};

/**
 * request user data interfaces, if 403, show login dialog
 */
function requestUserData(url, callback) {
    $.when(
        $.ajax({
            url : url,
            dataType : 'json'
        })

    ).done(function(resp, status, xhr) {
        callback(resp);

    }).fail(function(resp) {
        if (resp.status == 403) {
            Global.loadThenShowLoginDialog();

        } else {
            //TODO: error handling here
            console.log("Cannot get :" + url);
        }
    });
}

function setHeader(xhr) {
  if ($.cookie("tokenID")) {
    xhr.setRequestHeader('tokenID', $.cookie("tokenID"));
  }
}

function requestSuccess(data, status, xhr) {
  Global.loading.hide();
  if (xhr.status == 200) {
    if (typeof data === 'object') {
      return data;

    } else {
      //FIXME: not-yet-login error changed
      document.getElementById('loginContainer').innerHTML = data;
      Global.login.loginEvent();
      Global.login.showLogin();
      return null;
    }
  } else {
    console.log("status:"+ xhr.status);
    return null;
  }
}

function requestError(data, status, xhr) {
  Global.loading.hide();
  if (data.status == '403') {
    Global.Request.getToken(function(data){
      if (data.status == '200') {
        $.cookie("tokenID", data.token);
        window.location.reload();
        window.location.href = !$.cookie("login_url") ? 
        CONF.serverBaseUrl : CONF.serverBaseUrl + $.cookie("login_url");
      }
    });
  } else {
    console.log("status:"+  data.status +", statusText:" + 
      data.statusText + ", readyState:" + 
      data.readyState);
  }
}

