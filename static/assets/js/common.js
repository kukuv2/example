/**
 * @Author DPD
 * @Date 2016/6/16
 * Common params or functions here
 *   Add canton tree
 *   Add area layers
 *   Basic map control 
 *   Set the center of the map by area code 
 *   Format data in our own way(API data to echart, formathtml template)
 *   Loading modal 
 *   Message box
 *   Get css value by property name
 *   Drag element horizontal
 */

// Define Global common Object or prototype


Global.commonOnDocumentReady = function(){ 
  
  Global.showDetail = function(options) {
    options.animSpeed = options.animSpeed ? options.animSpeed : 230;
    if (options.show) {
      $('.viewtarget-list').stop().animate({'width':0,'opacity':0}, options.animSpeed,'linear',function (){
        $('.viewtarget-list').addClass('sel-active');
      });
      $('.viewtarget-pic').removeClass('sel-active').css({'width': 0, 'left' : 338, 'opacity' : 0});
      $('.viewtarget-pic').stop().animate({'left':10,'width':328,'opacity':1}, options.animSpeed,'linear', options.callback);
    } else {
      $('.viewtarget-pic').stop().animate({'left':328,'width':0,'opacity':0}, options.animSpeed, 'linear', function(){
        $('.viewtarget-pic').addClass('sel-active')
      });
      $('.viewtarget-list').removeClass('sel-active').css({'width': 0, 'left' : 10, 'opacity' : 0});
      $('.viewtarget-list').stop().animate({'width':328,'opacity':1}, options.animSpeed, 'linear');
    }
  }

  Global.expandList = function(option) {
    if (option.expand) {
      $('.viewtarget-right').removeClass('icon-icon').addClass('icon-xiangshang');
      $('.height-out').show();
    } else {
      $('.viewtarget-right').removeClass('icon-xiangshang').addClass('icon-icon');
    }
    $('.height-out').stop().animate({height: option.height, opacity: option.opacity}, function () {
      $('.expand-collapse').html(option.text);
      $('.viewtarget-list').css('height', option.listHeight);
      if (!option.expand) 
        $('.height-out').hide();
    });
  }

  Global.addAreaLayers = function(code, cantons) {
    
    Global.areaLayers = Global.areaLayers ? Global.areaLayers : [];
    var layersName;
    for (var i = 0; i < cantons.length; i++) {
      if(cantons[i].area_id == code) {
        layersName = 'map:area_' + cantons[i].area_id;
        addSingleLayer(cantons[i].bounds, layersName, "outer");
        if (cantons[i].contain) {
          for (var j = 0; j < cantons[i].contain.length; j++) {
            layersName = 'map:area_' + cantons[i].contain[j].area_id
            addSingleLayer(cantons[i].contain[j].bounds, layersName, 'inner');
          }
        }
        return;
      } 
      if(cantons[i].area_id != code && cantons[i].contain) {
        Global.addAreaLayers(code, cantons[i].contain);
      }
    }
    
    function addSingleLayer(bounds, layerName, lineType) {
      var layer, extent, bounds, layerOptions;
      lineType = lineType ? lineType : 'outer';
      bounds = bounds;
      extent = ol.extent.applyTransform(
        [bounds.lb_lon, bounds.lb_lat, bounds.rt_lon, bounds.rt_lat], 
        ol.proj.getTransform("EPSG:4326", "EPSG:3857"));
      layerOptions = {
        serverUrl: CONF.mapUrl,
        visible: true,
        extent: extent,
        layerName: layersName,
        sld: getAreaSld(lineType),
        removeAll: false,
        callback: function(layer) {
          layer.setZIndex(1);
          Global.areaLayers.push(layer);
        }
      }
      Global.Map.addGeoLayer(layerOptions);
    }

    function getAreaSld(type) {
      var sld = '<StyledLayerDescriptor version="1.0.0" '+
               'xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" '+
               'xmlns="http://www.opengis.net/sld" '+
               'xmlns:ogc="http://www.opengis.net/ogc" '+
               'xmlns:xlink="http://www.w3.org/1999/xlink" '+
               'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
                '<NamedLayer>'+
                  '<Name>default_polygon</Name>'+
                  '<UserStyle>'+
                    '<Title>Default Polygon</Title>'+
                    '<Abstract>A sample style that draws a polygon</Abstract>'+
                    '<FeatureTypeStyle>'+
                      '<Rule>'+
                        '<Name>rule1</Name>'+
                        '<Title>Gray Polygon with Black Outline</Title>'+
                        '<Abstract>A polygon with a gray fill and a 1 pixel black outline</Abstract>';

      sld += '<PolygonSymbolizer>'+
                '<Fill>'+
                  '<CssParameter name="fill">'+ Global.configData.sld[type].fill +'</CssParameter>'+
                   '<CssParameter name="fill-opacity">'+ Global.configData.sld[type].fillOpacity +'</CssParameter>'+
                '</Fill>'+
                '<Stroke>'+
                  '<CssParameter name="stroke">'+ Global.configData.sld[type].stroke +'</CssParameter>'+
                  '<CssParameter name="stroke-width">10</CssParameter>';
      if (type == 'inner') {
        sld += '</Stroke>'+
          '</PolygonSymbolizer>';
      }   
      else if (type == "outer") {
        sld += '<CssParameter name="stroke-linecap">'+ Global.configData.sld[type].strokeLinecap +'</CssParameter>'+
            '</Stroke>'+
          '</PolygonSymbolizer>';
      } else if (type == "selected") {
        sld += '</Stroke>'+
            '</PolygonSymbolizer>'+
            '<PolygonSymbolizer>'+
              '<Fill>'+
                '<CssParameter name="fill">'+ Global.configData.sld[type].fill1 +'</CssParameter>'+
                 '<CssParameter name="fill-opacity">'+ Global.configData.sld[type].fillOpacity1 +'</CssParameter>'+
              '</Fill>'+
              '<Stroke>'+
                '<CssParameter name="stroke">'+ Global.configData.sld[type].stroke1 +'</CssParameter>'+
                '<CssParameter name="stroke-width">'+ Global.configData.sld[type].strokeWidth1 +'</CssParameter>'+
              '</Stroke>'+
            '</PolygonSymbolizer>'+
           '<PerpendicularOffset>'+ Global.configData.sld[type].perpendicularOffset +'</PerpendicularOffset>';
      }
      sld += '</Rule>'+
            '</FeatureTypeStyle>'+
          '</UserStyle>'+
        '</NamedLayer>'+
      '</StyledLayerDescriptor>';
      return sld;
    }
  }

  Global.mapControl = function() {
    //layer visibility control
    $('.layer-ctl img').on('click', function(){
      $(this).removeClass('active').siblings().addClass('active');
      Global.Map.layerVisibility(Global.Map.tdtImgLayer,!$('.img-layer').hasClass('active'));
      Global.Map.layerVisibility(Global.Map.tdtVecLayer,$('.img-layer').hasClass('active'));
    });

    $('.tdtcva-layer-ctl, #cvaCtl').on('click', function(){
      cvaCtl.checked = !cvaCtl.checked;
      Global.Map.layerVisibility(Global.Map.tdtCvaLayer,cvaCtl.checked)
    })

    $('.center-bounds').on('click', function() {
      Global.setCenter();
    })
  }

  
  Global.setCenter = function(options) {
    options = options ? options : {};
    options.code = options.code ? options.code : $.cookie("areaCode");

    Global.Model.getBounds(options.code, function(bounds) {
      Global.extent = ol.extent.applyTransform(bounds, ol.proj.getTransform("EPSG:4326", "EPSG:3857"));
      Global.Map.centerTo(bounds);

      if (options.addAreaLayer) 
        Global.addAreaLayer(options.code);
    });
  }

  Global.addAreasLayer = function(code, areaList) {
    if (Global.areaLayers) {
      for (var i = 0; i < Global.areaLayers.length; i++) {
        Global.Map.map.removeLayer(Global.areaLayers[i]);
      }  
      Global.areaLayers = [];
    }
    areaList = areaList ? areaList : Global.cantons
    Global.addAreaLayers(code, areaList);
  }

  Global.addAreaLayer = function(code) {
    if (Global.areaLayers) {
      for (var i = 0; i < Global.areaLayers.length; i++) {
        Global.Map.map.removeLayer(Global.areaLayers[i]);
      }  
      Global.areaLayers = [];
    }
    code = code ? code : $.cookie("areaCode");
    var layersName = 'map:area_' + code,
        layerOptions = {
          serverUrl: CONF.mapUrl,
          visible: true,
          extent: Global.extent,
          layerName: layersName,
          callback: function(layer) {
            Global.areaLayers = Global.areaLayers ? Global.areaLayers : [];
            Global.areaLayers.push(layer);
            layer.setZIndex(3);
          }
        }
    Global.Map.addGeoLayer(layerOptions);
  }


  Global.layerOpacityCtl = function(layer, container, slider) {
    Global.singleSlider(container, slider, function(value) {
      $('.viewtarget-slide-txt').html((value * 100).toFixed(0) + '%');
      if (layer) {
        layer.setOpacity(value);
      }
    });
  }

  Global.singleSlider = function(container, slider, callback) {
    var _width = container.width() - slider.width();
    container.unbind();
    slider.unbind();
    slider.mousedown(function (ev) {
      var mouseEvent = ev ? ev : event;
      var disX = mouseEvent.clientX - slider.position().left;
      $(document).mousemove(moveSlider);
      $(document).mouseup(mouseUp)
      function moveSlider(ev) {
        var mouseEvent = ev ? ev : event;
        var sliderLeft = mouseEvent.clientX - disX;
        if(sliderLeft <= 0){ sliderLeft = 0 ;} 
        if(sliderLeft > container.width() - slider.width()){
          sliderLeft =  container.width() - slider.width();
        }
        slider.css({left:sliderLeft});
        if (typeof callback === 'function') {
          callback((sliderLeft / _width).toFixed(2));
        }
      }
      function mouseUp() {
        $(document).unbind('mousemove',moveSlider);
        $(document).unbind('mouseUp',mouseUp);
      }
    });
    container.click(function(ev) {
      var mouseEvent = ev ? ev : event;
      var sliderLeft = mouseEvent.clientX - container.offset().left;
      if(sliderLeft <= 0){ sliderLeft = 0 ;} 
      if(sliderLeft > container.width() - slider.width()){
        sliderLeft =  container.width() - slider.width();
      }
      slider.css({left: sliderLeft});
      if (typeof callback === 'function') {
        callback((sliderLeft / _width).toFixed(2));
      }
    });
  }

  Global.doubleSlider = function(container, firstSlider, secondSlider, callback) {
    var _width = container.width() - firstSlider.width();
    firstSlider.mousedown(function (ev) {
      var mouseEvent = ev ? ev : event;
      var disX = mouseEvent.clientX - firstSlider.position().left;
      $(document).mousemove(moveSlider);
      $(document).mouseup(mouseUp)
      function moveSlider(ev) {
        var mouseEvent = ev ? ev : event;
        var sliderLeft = mouseEvent.clientX - disX;
        if(sliderLeft <= 0){ sliderLeft = 0 ;} 
        if(sliderLeft > container.width() - firstSlider.width()){
          sliderLeft =  container.width() - firstSlider.width();
        }
        firstSlider.css({left:sliderLeft});
        if (typeof callback === 'function') {
          callback({first: (sliderLeft / _width).toFixed(2)}, firstSlider, secondSlider);
        }
      }
      function mouseUp() {
        $(document).unbind('mousemove',moveSlider);
        $(document).unbind('mouseUp',mouseUp);
      }
    });
    secondSlider.mousedown(function (ev) {
      var mouseEvent = ev ? ev : event;
      var disX = mouseEvent.clientX - secondSlider.position().left;
      $(document).mousemove(moveSlider);
      $(document).mouseup(mouseUp)
      function moveSlider(ev) {
        var mouseEvent = ev ? ev : event;
        var sliderLeft = mouseEvent.clientX - disX;
        if(sliderLeft <= 0){ sliderLeft = 0 ;} 
        if(sliderLeft > container.width() - secondSlider.width()){
          sliderLeft =  container.width() - secondSlider.width();
        }
        secondSlider.css({left:sliderLeft});
        if (typeof callback === 'function') {
          callback({second: (sliderLeft / _width).toFixed(2)}, firstSlider, secondSlider);
        }
      }
      function mouseUp() {
        $(document).unbind('mousemove',moveSlider);
        $(document).unbind('mouseUp',mouseUp);
      }
    });
  }

  Global.autoPlaySlider = function(container, slider, player, time, callback) { 
    var _width = container.width() - slider.width();
    Global.timer = Global.timer ? Global.timer : {};
    slider.mousedown(function (ev) {
      var mouseEvent = ev ? ev : event;
      var disX = mouseEvent.clientX - slider.position().left;
      $(document).mousemove(moveSlider);
      $(document).mouseup(mouseUp)
      function moveSlider(ev) {
        var mouseEvent = ev ? ev : event;
        var sliderLeft = mouseEvent.clientX - disX;
        if(sliderLeft <= 0){ sliderLeft = 0 ;} 
        if(sliderLeft > container.width() - slider.width() / 2){
          sliderLeft =  container.width() - slider.width() / 2;
        }
        slider.css({left:sliderLeft});
        if (typeof callback === 'function') {
          callback((sliderLeft / _width).toFixed(2));
        }
      }
      function mouseUp() {
        $(document).unbind('mousemove',moveSlider);
        $(document).unbind('mouseUp',mouseUp);
      }
    });
    container.click(function(ev) { 
      var mouseEvent = ev ? ev : event;
      var sliderLeft = mouseEvent.clientX - container.offset().left;
      if(sliderLeft <= 0){ sliderLeft = 0 ;} 
      if(sliderLeft > container.width() - slider.width() / 2){
        sliderLeft =  container.width() - slider.width() / 2;
      }
      slider.css({left: sliderLeft});
      if (typeof callback === 'function') {
        callback((sliderLeft / _width).toFixed(2));
      }
      if (player.hasClass('icon-kaishi')) {
        clearInterval(Global.timer.stopAutoPlay);
        player.removeClass('icon-kaishi').addClass('icon-kaishi1');
      }
    });

    player.click(function(evt) {
      evt.stopPropagation();
      var atEnd = (parseInt(slider.css('left').toString().slice(0, -2)) >= container.width() - slider.width());
      if (atEnd) {
        slider.css({left: 0});
      }
      if (player.hasClass('icon-kaishi')) {
        clearInterval(Global.timer.stopAutoPlay);
        player.removeClass('icon-kaishi').addClass('icon-kaishi1');
      } else {
        player.addClass('icon-kaishi').removeClass('icon-kaishi1');
        autoPlay(time);
      } 
    });

    var autoPlay = function (time, reset) {
      if (reset) {
        slider.css({left: 0});
      }
      speed = Math.ceil((container.width() - slider.width()) / time);
      var _time = 0,
        step = 1.5;
      clearInterval(Global.timer.stopAutoPlay);
      Global.timer.stopAutoPlay = setInterval(function() {
        var sliderLeft = parseInt(slider.css('left').toString().slice(0, -2)) + speed * step;
        _time += step;

        if (_time >= time || sliderLeft > container.width() - slider.width() / 2) {
          sliderLeft =  container.width() - slider.width() / 2;
          clearInterval(Global.timer.stopAutoPlay);
          player.removeClass('icon-kaishi').addClass('icon-kaishi1');
        }
        slider.css({left: sliderLeft});
        callback((sliderLeft / _width).toFixed(2));
      }, step);
    }
    player.addClass('icon-kaishi').removeClass('icon-kaishi1');
    slider.css({left: 0});
    autoPlay(time);
    return autoPlay;
  }

  // format data functions
  Global.formatData = (function() {
    var result = {};

    // translate api data into echart data format, used in weather( and monitor)
    result.apiDataToDay = function(options) {
      var _data = {},
          _startYear = parseInt(options.startDate.getFullYear()),
          _endYear = parseInt(options.endDate.getFullYear()),
          _startDay = parseInt(Global.dateUtil.dateToDay(options.startDate)),
          _endDay = parseInt(Global.dateUtil.dateToDay(options.endDate));

      _data.Y = [];
      _data.X = [];

      // set xaxis data form selected date
      var setDayxAxis = function(year, day) {
        var date = Global.dateUtil.dayToDate(year, day);
        return Global.dateUtil.formatDate(date)
      } 

      var isEnd = function() {
        if (_startYear > _endYear ) 
          return false;
        if (_startYear == _endYear && _startDay == _endDay) 
          return false;
        var days = (_startYear % 4 == 0 && _startYear % 100 !=0) ||
                  (_startYear % 100 == 0 && _startYear % 400 == 0) ? 366 : 365;
        if( (_startDay + 1) > days ) {
          _startYear += 1;
          _startDay = 0;
        } else {
          _startDay += 1;
        }
        return true;
      }

      while(isEnd()) {
        var keyOfDay;
        if(_startDay < 10) {
          keyOfDay = "00" + _startDay;
        } else if (_startDay < 100) {
          keyOfDay = "0" + _startDay;
        } else 
          keyOfDay = _startDay
        
        if (options.data[_startYear] && options.data[_startYear][keyOfDay]) {
          _data.Y.push(options.data[_startYear][keyOfDay]);
        } else if (options.data[_startYear] && options.data[_startYear][keyOfDay] == "0.0") {
          _data.Y.push(0);
        } else
          _data.Y.push(null);
        _data.X.push(setDayxAxis(_startYear, keyOfDay));
      }

      if (typeof options.callback =="function") {
        options.callback(_data);
      }
    }

    // translate api data into echart data format, used in weather( and monitor)
    result.apiDataToPeriod = function(options) {
      var _data = {},
          _startYear = parseInt(options.startDate.getFullYear()),
          _endYear = parseInt(options.endDate.getFullYear()),
          _startPeriod = parseInt(Global.dateUtil.dateToPeriod(options.startDate)) - 1,
          _endPeriod = parseInt(Global.dateUtil.dateToPeriod(options.endDate));

      _data.Y = [];
      _data.X = [];

      // set xaxis data form selected date
      var setPeriodxAxis = function(year, period) {
        var periodContent, dateStr;
        if ( parseInt(period) < 10 ) {
          if (options.CN) {
            periodContent = Global.configData.dateItem.period[(parseInt(period) - 1)];
            periodContent = periodContent['0' + parseInt(period)];
            dateStr = year + '年' + periodContent;
          } else if(options.ENCN) {
            periodContent = Global.configData.dateItem.periodENCN[(parseInt(period) - 1)];
            periodContent = periodContent['0' + parseInt(period)];
            dateStr = year + '年' + periodContent;
          } else {
            periodContent = Global.configData.dateItem.periodEN[(parseInt(period) - 1)];
            periodContent = periodContent['0' + parseInt(period)];
            dateStr = year + '-' + periodContent;
          }
        } else {
          if (options.CN) {
            periodContent = Global.configData.dateItem.period[(parseInt(period) - 1)];
            periodContent = periodContent[parseInt(period)];
            dateStr = year + '年' + periodContent;
          } else if(options.ENCN) {
            periodContent = Global.configData.dateItem.periodENCN[(parseInt(period) - 1)];
            periodContent = periodContent[parseInt(period)];
            dateStr = year + '年' + periodContent;
          } else {
            periodContent = Global.configData.dateItem.periodEN[(parseInt(period) - 1)];
            periodContent = periodContent[parseInt(period)];
            dateStr = year + '-' + periodContent;
          }
        }

        return dateStr;
      }

      var isEnd = function() {
        if (_startYear > _endYear ) 
          return false;
        if (_startYear == _endYear && _startPeriod == _endPeriod) 
          return false;

        if( (_startPeriod + 1) > 36 ) {
          _startYear += 1;
          _startPeriod = 1;
        } else {
          _startPeriod += 1;
        }
        return true;
      }

      while(isEnd()) {
        var keyOfPeriod = (_startPeriod < 10) ? "0" + _startPeriod : _startPeriod;
        if (options.data[_startYear] && options.data[_startYear][keyOfPeriod]) {
          _data.Y.push(options.data[_startYear][keyOfPeriod]);
        } else 
          _data.Y.push(null);
        _data.X.push(setPeriodxAxis(_startYear, keyOfPeriod));
      }

      if (typeof options.callback =="function") {
        options.callback(_data);
      }
    } 

    // because the chart date title is to long, cut it
    // dateArr ＝ ["2016年01上旬","2016年02上旬","2017年04上旬","2017年04上旬"];
    result.cutDateFootnote = function(dateArr) {
      var year = dateArr[0].substr(0,4);
      for (var i = 0; i < dateArr.length; i++) {
        if(i>0 && year==dateArr[i].substr(0,4))
          dateArr[i] = dateArr[i].substr(5);
        else
          year = dateArr[i].substr(0,4)
      }
      return dateArr;
    }
    // using object property to replace "{{variable}}" string in html
    result.formatHtml = function(htmlTep, arrayObject) {
      var html = '', _htmlTem;
      for(var i = 0, len = arrayObject.length; i < len; i++) {
        for(var key in arrayObject[i]) {
          if (htmlTep.indexOf("{{"+key+"}}") > 0) {
            _htmlTem = arrayObject[i].htmlTempalte ? arrayObject[i].htmlTempalte : htmlTep;
            arrayObject[i].htmlTempalte = _htmlTem.replaceAll("{{"+key+"}}", arrayObject[i][key]);
          }
          else 
            continue;
        }
        html += arrayObject[i].htmlTempalte;
      }
      return html;
    }

    return result;
  })();

  // Global.loading.show()
  // Global.loading.hide()
  Global.loading = (function() {
    var result = {};

    result.show = function(options) {
      options = options ? options : {};
      
      options.isModal = !options.isModal ? "modal" : options.isModal;
      options.width = !options.width ? "100%" : options.width + 'px';
      options.height = !options.height ? "100%" : options.height + 'px';
      options.left = !options.left ? "0" : options.left + 'px';
      options.top = !options.top ? "0" : options.top + 'px';
      
      $('.loading').css('width', options.width);
      $('.loading').css('height', options.height);
      $('.loading').css('left', options.left);
      $('.loading').css('top', options.top);
      
      
      $('.loading').addClass(options.isModal);
    }
    result.hide = function() {
      if($('.loading').hasClass("modal"))
        $('.loading').removeClass("modal")
      else if($('.loading').hasClass("nomodal"))
        $('.loading').removeClass("nomodal")
    }
    return result;
  })();
   
  // Drag element horizontally
  Global.dragElement = function(options) {
    var params = {
      left: 0,
      currentX: 0,
      flag: false
    };
    // Get the element's CSS value by property name
    function getCssValue(element, propertyName) {
      return element.currentStyle ? 
             element.currentStyle[propertyName] : 
             document.defaultView.getComputedStyle(element ,false)[propertyName]; 
    };

    if(getCssValue(options.container, "left") !== "auto") {
      params.left = getCssValue(options.container, "left");
    }

    options.targeter.onmousedown = function(event){
      params.flag = true;
      if(getCssValue(options.container, "left") !== "auto") {
        params.left = getCssValue(options.container, "left");
      }
      if(!event){
        event = window.event;
        options.targeter.onselectstart = function(){
          return false;
        }  
      }
      var e = event;
      params.currentX = e.clientX;
    };

    document.onmouseup = function(){
      params.flag = false;  
      if(getCssValue(options.container, "left") !== "auto"){
        params.left = getCssValue(options.container, "left");
      }
      if (typeof options.callback == "function") {
        options.callback();
      }
    };

    options.container.onmouseup = function(){
      params.flag = false;  
      if(getCssValue(options.container, "left") !== "auto"){
        params.left = getCssValue(options.container, "left");
      }
      if (typeof options.callback == "function") {
        options.callback();
      }
    };

    options.container.onmousemove = function(event){
      var e = event ? event: window.event;
      if(params.flag){
        var nowX = e.clientX;
        var disX = nowX - params.currentX;
        if(typeof options.stepLength == "number") {
          if (disX % options.stepLength == 0) {
            options.container.style.left = parseInt(params.left) + disX + "px";
          }
        }
        else {
          if (typeof options.rightBoundary == "number" && parseInt(params.left) + disX <= options.rightBoundary) {
            options.container.style.left = options.rightBoundary+ "px";
          } else if(typeof options.leftBoundary == "number" && parseInt(params.left) + disX >= options.leftBoundary ) {
            options.container.style.left = options.leftBoundary + "px";
          }
          else 
            options.container.style.left = parseInt(params.left) + disX + "px";
        }
      }
    } 
  };

  Global.AreaTree = function(options) {
    if (this instanceof Global.AreaTree) {
      this.init(options);
    } else {
      var err = {
        error_msg: 'Global.AreaTree is a constructor not a funciton'
      }
      console.log(err.error_msg);
      throw err;
    }
  } 
  Global.AreaTree.prototype = {
    init: function(options) {
      if (!options.container) {
        var err = {
          error_msg: 'Global.AreaTree need a jquery object "container"'
        }
        console.log(err.error_msg);
        throw err;
      }
      
      var self = this;
      if (!options.areas || options.areas.length == 0) {
        Global.Request.cantonTree(function(data) {
          options.areas = Global.cantons = data;
          self.render(options);
        });
      } else {
        this.render(options);
      }
    },
    render: function(options) {
      var container = options.container;
      if (options.width && options.height) {
        container.css('width', options.width);
        container.css('height', options.height);
      } 

      var html = '<div class="tree-head no-select">'+
                   '<img src="assets/images/analyze/canton.png" width="14px"/>' +
                   '<input type="text" readonly class="tree-sel-txt no-select"/>' +
                 '</div>' + 
                 '<div class="tree-body no-select">';
      html += addNodes(options.areas);
      if (options.hasOKbtn) {
        html += '<div class="tree-btn-OK">确定</div>';
      }
      html += '</div>';

      container.html(html);

      function addNodes(areas) {
        var _html = '';
        _html += '<ul class="tree-ul">'
        for (var i = 0; i < areas.length; i++) {
          _html += '<li>' + 
              '<p><i data-grade="'+ areas[i].grade +
              '" data-code="'+ areas[i].area_id +'">' + 
              areas[i].area_name + '</i>' ;
          if (areas[i].contain) {
            _html += '<span>+</span></p>';
            _html += addNodes(areas[i].contain);
          }
          _html += "</li>"
        }

        return _html + '</ul>';
      }
      this.bindEvents(options);
    },
    bindEvents: function(options) {
      options.container.unbind();
      options.container.on('click', '.tree-sel-txt', function(event) {
        event.stopPropagation();
        $('.tree-body').show();
      });
      options.container.on('click', '.tree-ul li i', function(event) {
        event.stopPropagation();
        $('.tree-ul li').removeClass('active');
        options.callback($(this).attr('data-code'), $(this).html(), $(this).attr('data-grade'));
        $(this).parent().parent().addClass('active');
        if (!options.hasOKbtn) {
          $('.tree-body').hide();
        }
      });
      options.container.on('click', '.tree-ul li span', function(event) {
        event.stopPropagation();
        var _childUl = $(this).parent().next();
        _childUl.toggle();
        $(this).html() == '+' ? $(this).html('-') : $(this).html('+');
      });
      options.container.on('click', '.tree-btn-OK', function(event) {
        $('.tree-body').hide();
      });
      $(document.body).on('click',function() {
        $('.tree-body').hide();
      });
    }
  }

  Global.MenuList = function(options) {
    if (this instanceof Global.MenuList) {
      this.init(options);
    } else {
      var err = {
        error_msg: 'Global.MenuList is a constructor not a funciton'
      }
      console.log(err.error_msg);
      throw err;
    }
  } 
  Global.MenuList.prototype = {
    init: function(options) {
      if (!options.container) {
        var err = {
          error_msg: 'Global.MenuList need a jquery object "container"'
        }
        console.log(err.error_msg);
        throw err;
      }
      
      if (options.data || options.data.length !== 0) {
        this.render(options);
        this.bindEvents(options);
      }
    },
    render: function(options) {
      var container = options.container;
      if (options.width && options.height) {
        container.css('width', options.width);
        container.css('height', options.height);
      } 
      options.className = options.className ? options.className : 'switcher-item';
      options.openText = options.openText ? options.openText : '显示';
      options.closeText = options.closeText ? options.closeText : '关闭';
      var html = '';
      for (var i = 0; i < options.data.length; i++) {
        var htmlC = '<div class="show-params-content clear">';
        for (var j = 0; j < options.data[i].child.length; j++) {
          htmlC += '<div class="show-params-wrap clear">'+
                      '<h3 class="fl show-params-txt">' + options.data[i].child[j].name +'</h3>'+
                      '<div class="cf-layer-ctl cf-layer-close clear fr '+ options.className +'">'+
                        '<span class="params-item cf-layer-text fl" data-value="'+ options.data[i].child[j].value +'">'+ options.closeText +'</span>'+
                        '<i class="cf-layer-switch iconfont icon-reorder fl"></i>'+
                      '</div>'+
                    '</div>';
        }
        htmlC +='</div>';
        html += '<li class="toogle-menu">'+ 
                  '<p><span class="triangle-switcher triangle-right"></span>'+ options.data[i].name + htmlC +'</p>'
                '</li>';
        
      }

      container.html(html);
    },
    bindEvents: function(options) {
      var self = this;
      self.closeOther = options.closeOther;
      self.className = options.className;
      self.closeText = options.closeText;
      options.container.on('click', '.toogle-menu', function(event) {
        if ($(this).children().children().eq(0).hasClass('triangle-right')) {
          $(this).children().children().eq(0).removeClass('triangle-right').addClass('triangle-bottom');
        } else {
          $(this).children().children().eq(0).removeClass('triangle-bottom').addClass('triangle-right');
        }
        $(this).children().eq(1).toggle();
      });
      options.container.on('click', '.cf-layer-ctl', function(event) {
        event.stopPropagation();
        if ($(this).hasClass('cf-layer-close')) {
          self.closeAll();
          $(this).removeClass('cf-layer-close');
          $(this).children().eq(0).html(options.openText);
        } else {
          $(this).addClass('cf-layer-close');
          $(this).children().eq(0).html(options.closeText);
        }
        options.callback($(this).children().eq(0));
      });
      options.container.on('click', '.show-params-content', function(event) {
        event.stopPropagation();
      });
    },
    closeAll: function () {
      if (this.closeOther) {
        $(('.' + this.className)).addClass('cf-layer-close');
        $(('.' + this.className + ' span')).html(this.closeText);
      }
    }
  }

  Global.dragBox = function (targeter, container) {
    var beginDrag = false,
      disX,
      disY;
    targeter.onmousedown = function (event) { 
      var event = event || window.event; 
      beginDrag = true; 
      disX = event.clientX - container.offsetLeft; 
      disY = event.clientY - container.offsetTop; 
      this.setCapture && this.setCapture();
      return false 
    };
    document.onmousemove = function (event) { 
      if (!beginDrag) return; 
      var event = event || window.event; 
      var iL = event.clientX - disX; 
      var iT = event.clientY - disY; 
      var maxL = document.documentElement.clientWidth - container.offsetWidth; 
      var maxT = document.documentElement.clientHeight - container.offsetHeight; 
      iL = iL < 0 ? 0 : iL; 
      iL = iL > maxL ? maxL : iL; 
      iT = iT < 0 ? 0 : iT; 
      iT = iT > maxT ? maxT : iT; 

      container.style.marginTop = container.style.marginLeft = 0; 
      container.style.left = iL + "px"; 
      container.style.top = iT + "px"; 
      return false 
    }; 
    document.onmouseup = window.onblur = targeter.onlosecapture = function () { 
      beginDrag = false; 
      targeter.releaseCapture && targeter.releaseCapture(); 
    }; 
  }

}

