/**
 * @Author:DPD
 * @Date: 2016/716
 * The remote monitor model
 *   
 */
Global.Monitor = function(ID) {
  if (!(this instanceof Global.Monitor)) {
    new Global.Monitor();
  } else {
    this.ID = ID ? ID : '1';
    this.endDate = new Date();
    this.startDate = new Date('2010-01-01');
    this.init();
  }
}

Global.Monitor.prototype.init = function() {
  Global.loading.show();
  Global.Map.init();
  this.fetchData();
}

Global.Monitor.prototype.fetchData = function() {
  var self = this;
  Global.Model.monitorProduct(function(products) {
    self.render(products);
  });
}

Global.Monitor.prototype.render = function(products) {
  if (products.length <= 0) {
    Global.setCenter({code: null});
    $('.no-data').show();
    $('.date-selector').hide();
    $('.product-check').hide();
    Global.loading.hide();
  } else {
    $('.no-data').hide();
    $('.date-selector').show();
    $('.product-check').show();

    var htmlTempalte = '<li data-id="{{product_id}}" data-type="{{product_key}}" data-detail="{{product_detail}}" '
      + 'data-title="{{product_title}}" data-explaination ="{{product_explanation}}">'
      + '<span class="list-n{{i}}"></span>'
      + '<div class="list-txt">'
      + '<h3>{{product_title}}<i class="tool-tip">?</i></h3>'
      + '<p>{{product_misc}}</p>'
      + '</div></li>',
      productListHtml = Global.formatData.formatHtml(htmlTempalte, products);
    $('.viewtarget-ul').html(productListHtml);
    this.bindEvents();
  } 
}

Global.Monitor.prototype.bindEvents = function() {
  var self = this;

  $('.viewtarget-ul li').on('click',function (event){
    var target = $(this);
    function listClick() {
      self.type = target.attr('data-type');
      if (self.ptype && self.ptype.indexOf('-5') > 0) {
        $('.sel-right').removeClass('sel-right-active');
        $('.one-year').removeClass('one-year-active'); 
        $('.one-year').html('近一年');
        self.ptype = self.type  + '-1';
      }
      self.ptype =  self.type + '-1';
      self.areaCode = self.areaCode ? self.areaCode : $.cookie("areaCode");
      self.detail = JSON.parse(target.attr('data-detail').toString().replaceAll("'",'"'));
      self.isGrow = (Global.configData.growTarget.name.indexOf(self.type) >= 0);
      
      $('.product-title').html(target.attr('data-title'));
      
      if (!self.isGrow) {
        $('.sel-year').hide();
        $('.line-par-switch').hide();
        $('.echarts-btn span').eq(0).hide();
      } else {
        $('.sel-year').show();
        $('.line-par-switch').show();
        $('.echarts-btn span').eq(0).show();
      }

      self.recentDate(function(data) {
        var _year = new Date().getFullYear(),
          _period = '1';
        if (data.data && data.data.year) {
          _year = data.data.year;
          _period = data.data.tenday;
        }
        self.latestDate = Global.dateUtil.periodToDate(_year + _period);

        self.freshDate();
      });

      // getReport 
      if(self.isGrow){
        $('.product-check').html('查看长势报告');
        $('.product-check').attr('data-section','growing');
      }else {
        $('.product-check').html('查看旱情报告');
        $('.product-check').attr('data-section','drought');
      }
      self.currntPage = 1;
      self.perpage = 10;
      self.totalReport = 0;
    }
    var options = {
      show: true,
      speed: 230,
      callback: listClick
    }
    Global.showDetail(options);
  });

  $('.go-detail').on('click',function (){
    Global.showDetail({show: true});
    if ($('.viewtarget-right').hasClass('icon-icon')) {
      var options = {
        expand: true,
        height: 140,
        listHeight: 376,
        opacity: 1,
        text: '收起'
      };
      Global.expandList(options);
    }
  });
  $('.back-list').on('click',function (){
    Global.showDetail({show: false});
    if ($('.viewtarget-right').hasClass('icon-icon')) {
      var options = {
        expand: true,
        height: 140,
        listHeight: 376,
        opacity: 1,
        text: '收起'
      };
      Global.expandList(options);
    }
  });

  $('.expand-collapse').on('click',function(){
    if ($('.viewtarget-right').hasClass('icon-icon')) {
      var options = {
        expand: true,
        height: 140,
        listHeight: 376,
        opacity: 1,
        text: '收起'
      };
    } else if ($('.viewtarget-right').hasClass('icon-xiangshang')) {
      var options = {
        expand: false,
        height: 0,
        listHeight: 0,
        opacity: 0,
        text: '展开'
      };
    }
    Global.expandList(options);
  });

  // change recent 1 or 5 years
  $('.sel-year').on('click',function () {
    if(!$('.sel-right').hasClass('sel-right-active')){
      $('.sel-right').addClass('sel-right-active');
      $('.one-year').addClass('one-year-active');
      $('.one-year').html('近五年');
      self.ptype = self.type  + '-5';
      self.addtlLayer(self.datePickerObject.getDate());
    }else{
      $('.sel-right').removeClass('sel-right-active');
      $('.one-year').removeClass('one-year-active'); 
      $('.one-year').html('近一年');
      self.ptype = self.type  + '-1';
      self.addtlLayer(self.datePickerObject.getDate());
    }
  });

  // switch line and bar chart
  $('.echarts-btn .line').on('click',function(){
    $('.sel-year').hide();
    $('.echarts-btn .bar').removeClass('activebar');
    $(this).addClass('activeline');
    $('.shadow-cover').show();
    $('.viewtarget-popup-menu').show();
    self.loadLineChart();
    self.titleAndTip(true);
  });
  $('.echarts-btn .bar').on('click',function(){
    if (self.isGrow) {
      $('.sel-year').show();
    }
    $('.echarts-btn .line').removeClass('activeline');
    $(this).addClass('activebar');
    $('.shadow-cover').show();
    $('.viewtarget-popup-menu').show();
    self.loadBarChart();
    self.titleAndTip();
  });
  
  // set the position and content of tooltip
  $('.tool-tip').on('mouseover', function(event) {
    $('.left-offset').css('display', 'block');
    var htmlMisc = $(this).parent().parent().parent().attr('data-explaination');
    var x = $('.viewtarget-list').width() + 20;
    var y = event.clientY - 25;
    $('.left-offset').css('top', y);
    $('.left-offset').css('left', x);
    $('.left-offset li').html('<span></span>'+ htmlMisc);
  });
  $('.tool-tip').on('mouseout', function(event) {
    $('.left-offset').css('display', 'none');
  });
  $('.tool-tip').on('click', function(event) {
    event.stopPropagation();
  });
  
  // the model dialog
  $('.viewtarget-close').on('click',function() {
    $('.viewtarget-popup-menu').hide();
    $('.shadow-cover').hide();
    $('.echarts-btn .line').removeClass('activeline');
    $('.echarts-btn .bar').removeClass('activebar');
    if (self.isGrow) {
      $('.sel-year').show();
    }
  });

  $('.viewtarget-question').on('mouseover', function(event) {
    $('.viewtarget-tooltip').show();
  });

  $('.viewtarget-question').on('mouseout', function(event) {
    $('.viewtarget-tooltip').hide();
  });

  // click the product list where data-id is '1'.
  clickDefualProduct();

  var options = {
    container: $('.monitor-tree'),
    hasOKbtn: true, 
    areas: Global.cantons ? Global.cantons : [],
    callback: function(code, name, grade){
      $('.monitor-tree .tree-sel-txt').val(name);
      self.areaCode = code;
      Global.setCenter({code: self.areaCode});
      Global.addAreasLayer(self.areaCode);
      
      if (self.datePickerObject) {
        self.recentDate(function(data) {
          var _year = new Date().getFullYear();
          var _period = '1';
          if (data.data && data.data.year) {
            _year = data.data.year;
            _period = data.data.tenday;
          }
          self.latestDate = Global.dateUtil.periodToDate(_year + _period);

          self.freshDate();
        });
      }
    }
  }
  if (!self.tree) {
    self.tree = new Global.AreaTree(options);
    $('.monitor-tree .tree-ul li i').eq(0).click();
  }

  function clickDefualProduct() {
    var arr = $('.viewtarget-ul li');
    for (var i = 0, len = arr.length; i < len; i++) {
      if(arr.eq(i).attr('data-id') == self.ID) {
        arr.eq(i).click();
        return;
      }
    }
  };
  $('.product-check').on('click',function(){
    self.section = $(this).attr('data-section');
    $('.report-data').show();
    $('.check-bj').show();
    $('.report-list').scrollTop(0);
    
    getReport();
  });

  $('.report-list').scroll(function() {
    var sH = $(this).get(0).scrollHeight;
    var sT = $(this).scrollTop();
    var cH = $('.report-list').outerHeight(true);
    if(sT + cH >= sH){
      getReport(true);
    }
  });

  $('.weather-close').on('click',function(){
    $('.shadow-cover').hide();
    $('.report-data').hide();
  });

  function getReport(isScroll) {
    if(self.currntPage * self.perpage >= self.totalReport && self.totalReport){
      return;
    }
    Global.loading.show();
    if (isScroll) {
      self.currntPage += 1;
    }
    var data = {
      section: self.section,
      perPage: self.perpage, 
      curPage: self.currntPage
    };
    Global.Model.monitorReport(data, renderReport);
  }

  function renderReport(data) {
    self.totalReport = data.total;
    Global.loading.hide();
    if(self.totalReport == 0) {
      $('.report-list').html('暂无数据');
    }else {
      var htmlTem ='<li class="report-single">'
           + '<div class="report-left">'
           + '<img src="{{img_url}}" data-url="{{pdf_url}}" width="190px;">'
           + '<span class="{{report_class}}"><em>{{report_label}}</em></span>'
           + '</div>'
           + '<div class="report-content">'
           + '<p class="report-h3"><span class="report-title">{{title}}</span>'
           + '<span class="report-date">{{time}}</span></p>'
           + '<p class="report-p">{{misc}}</p>'
           + '<a href="{{pdf_url}}" target="_blank">浏览全文 &gt</a>'
           + '</div>'
           + '<h3><a>'
           + '<form action="' + CONF.serverBaseUrl + 'report/downPdf" method="post">'
           + '<input type="hidden" name="pdfUrl" value="{{pdf_url}}">'
           + '<input type="hidden" name="pdfTitle" value="{{title}}">'
           + '<input type="submit" class="animated fadeInRight"  value="点击下载" > '
           + '</form><span class="re-bj iconfont icon-xiazai1"></span>'
           + '</a></h3>'
           + '</li>',
        html = Global.formatData.formatHtml(htmlTem, data.data);

      if (self.currntPage == 1) {
        $('.report-list').html(html);
      }
      else {
        $('.report-list').append(html);
      }
    }
  }

  // (function dragBox() {
  //   var targeter = $('.echarts-tittle').get(0);
  //   var container = $('.viewtarget-popup-menu').get(0);
  //   Global.dragBox(targeter, container);
  // })();
}

Global.Monitor.prototype.recentDate = function(callback) { 
  var type = this.isGrow ? this.ptype : this.type;
  Global.Request.latestProduct(type, this.areaCode, callback);
}

Global.Monitor.prototype.freshDate = function() {
  Global.loading.hide();

  if (!this.initDatepicker) {
    this.initDatepicker = true;
    this.datePicker();
  } 
  else {
    var option = {
      date: this.latestDate,
      productType: this.isGrow ? this.ptype : this.type,
      areaCode: this.areaCode
    }
    this.timelineObject.reLoad(option);
    this.datePickerObject.refresh(this.latestDate);
  }
}

Global.Monitor.prototype.setLegend = function() {
  this.legend = Global.configData.productLegendConf[this.type];
  var targetArray = [];
  for(var key in this.legend) {
    var i = 5 - parseInt(key);
    targetArray[i] = {};
    targetArray[i].name = this.legend[key].name;
    targetArray[i].start = this.legend[key].up;
    targetArray[i].end = this.legend[key].down;
    targetArray[i].color = this.legend[key].color;
    targetArray[i].fontColor = this.legend[key].fontColor;
  }
  
  var htmlTempalte = '<li style="background-color: {{color}};"><span style="color:{{fontColor}};">{{name}}</span>'
    + '<div class="tooltip-legend">'
    + '<p class="drought-top">{{start}}</p><em class="legend-to">至</em>'
    + '<p class="drought-bottom">{{end}}</p>'
    + '</div></li>';
  var html = Global.formatData.formatHtml(htmlTempalte, targetArray);
  
  if(this.isGrow) {
    $('.growth-ul').html(html);
    $('.growth-ul h3').addClass('none');
    $('.drought-legend').hide();
    $('.growth-legend').show();
  } else {
    $('.drought-ul').html(html);
    $('.drought-ul h3').addClass('none');
    $('.growth-legend').hide();
    $('.drought-legend').show();
  }
}


Global.Monitor.prototype.addtlLayer = function(date) {
  var self = this;
  self.setLegend();
  var productType = self.isGrow ? self.ptype : self.type;
  var layerName = "map:" + productType + "_" + date.getFullYear() 
        + Global.dateUtil.dateToPeriod(date)
        + "_MASK"  + "." + self.areaCode + "_GRADE";

  var layerOptions = {
    serverUrl: CONF.mapUrl,
    visible: true,
    extent: Global.extent ? Global.extent : '',
    layerName: layerName,
    sld: getRasterSld(layerName),
    removeAll: true,
    inRemoveList: true,
    callback: function(layer) {
      // layer opacity controler
      var container = $('#viewtarget-slide-bg'); 
      var slider = $('.viewtarget-slide-block'); 
      slider.css('left', '186px');
      $('.viewtarget-slide-txt').html('100%');
      Global.layerOpacityCtl(layer, container, slider);
    }
  }
  Global.Map.addGeoLayer(layerOptions);

  function getRasterSld(layerName) {
    var colorList;
    for(var key in self.legend) {
      if (key == '0') {
        colorList += '<ColorMapEntry color="' +
        self.legend[key].color +'" quantity="'+ key +
        '" label="'+ self.legend[key].name +
        '" opacity="0" />';
      } else {
        colorList += '<ColorMapEntry color="' +
        self.legend[key].color +'" quantity="'+ key +
        '" label="'+ self.legend[key].name +
        '" opacity="1" />';
      }
    }
    var sld = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">' +
    '<NamedLayer>' +
    '<Name>' + layerName + '</Name>' +
    '<UserStyle>' +
    '<Title>SLD Cook Book: Discrete colors</Title>' +
    '<FeatureTypeStyle>' +
    '<Rule>' +
    '<RasterSymbolizer>' +
    '<ColorMap extended="true" type="values">' +
    colorList +
    '</ColorMap>' +
    '</RasterSymbolizer>' +
    '</Rule>' +
    '</FeatureTypeStyle>' +
    '</UserStyle>' +
    '</NamedLayer>' +
    '</StyledLayerDescriptor>';
    return sld;
  }
}


Global.Monitor.prototype.datePicker = function() {
  var self = this;
  var options = {
    jdom: $('#date-picker'),
    grade: 'period',
    startDate: self.startDate,
    selectedDate: self.latestDate
  }
  self.datePickerObject = Global.datePicker(options);

  options = {
    startDate: self.startDate,
    selectedDate: self.latestDate,
    existOption: {
      productType: self.isGrow ? self.ptype : self.type,
      areaCode: self.areaCode
    }
  }
  self.timelineObject = Global.timeLine(options);

  (function bindEvent() {
    $('.time-content-right').on('click', function() {
      var bodyWidth = $(document.body).width();
      var ltContainer = $('.tl-container').width();
      var tlWidth = bodyWidth - $('#date-picker').width()
      - bodyWidth * 0.02 - $('.time-content-right').width();
      var tlBody = tlWidth + $('#date-picker').width();
      if ($('.date-selector').hasClass('shrink')) {
        $('.time-content-right').html('&lt;');
        $('.current-year').show();
        $('.current-year').animate({width: '45px'}, 700);
        $('#tlboder').animate({width: tlWidth +'px'}, 700, null, function() {
          $('#tlboder').css('width', ltContainer + 'px');
          self.timelineObject.refresh();
          $('.date-selector').removeClass('shrink');
        });
        $('.tl-footer').animate({right: '0'}, 700);
      } else {
        $('.time-content-right').html('&gt;');
        $('.date-selector').addClass('shrink');
        $('#tlboder').css('left', '-20px');
        $('#tlboder').css('width', tlWidth +'px');
        $('.current-year').animate({width: '0px'}, 700,null, function() {$('.current-year').hide();});
        $('#tlboder').animate({width: '0px'}, 700);
        $('.tl-footer').animate({right: tlWidth +'px'}, 700);
      }
    });
  })();
}

Global.Monitor.prototype.loadBarChart = function() {
  var _end = Global.dateUtil.formatDate(this.endDate),
      _start = Global.dateUtil.formatDate(this.startDate),
      _url = this.isGrow ? this.ptype : this.type;

  _url +=  '/' + this.areaCode + '/' + _start + '/' + _end;
  
  var options = {
    url: _url,
    legend: this.legend,
    startDate: this.startDate,
    endDate: this.endDate
  }

  Global.Model.monitorBar(options, initChart);
  function initChart(data) {
    if (!data) {
      $('.monitor-none-data').html('-暂无数据！-');
      return;
    }
    var barLegend = data.legend;
    var myCharts = echarts.init(document.getElementById('viewtarget-echarts'));
    var option = {
      tooltip : {
        position: ['80%', '50'],
        trigger: 'axis',
        axisPointer : {            
          type : 'shadow'        
        },
        formatter:'{b}<br>{a5} : {c5}%<br>{a4} : {c4}%<br>{a3} : {c3}%<br>{a2} : {c2}%<br>{a1} : {c1}%<br>{a0} : {c0}%'
      },
      legend: {
        show: false,
        data: [barLegend['6'].name, barLegend['5'].name, barLegend['4'].name, barLegend['3'].name, barLegend['2'].name, barLegend['1'].name]
      },
      toolbox: {  
        show: true,
        top: '5%',
        feature: { 
          magicType: { 
                      show: false
                    },
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        yAxis:  {
          type: 'value', 
          axisLabel: {
            show: true,
            interval: 'auto',
            formatter: '{value} %'
          },
          min: 0,
          max: 100
        },
        xAxis: {
          type: 'category',
          data: data.parxAxis
        },
        animation: false,
        dataZoom: [{ 
          type: 'slider', 
          start: data.parStart,
          end: 100
        }],
        series: [
          {
            name: barLegend['1'].name,
            type: 'bar',
            stack: '总量',
            barWidth: 30,
            data: data.data1,
            itemStyle:{
              normal:{color: barLegend['1'].color}
            }
          },
          {
            name: barLegend['2'].name,
            type: 'bar',
            stack: '总量',
            barWidth: 30,
            itemStyle:{
              normal:{color: barLegend['2'].color}
            },
            data: data.data2
          },
          {
            name: barLegend['3'].name,
            type: 'bar',
            stack: '总量',
            barWidth: 30,
            itemStyle:{
              normal:{color: barLegend['3'].color}
            },
            data: data.data3
          },
          {
            name: barLegend['4'].name,
            type: 'bar',
            stack: '总量',
            barWidth: 30,
            itemStyle:{
              normal:{color: barLegend['4'].color}
            },
            data: data.data4
          },
          {
            name: barLegend['5'].name,
            type: 'bar',
            stack: '总量',
            barWidth: 30,
            itemStyle:{
              normal:{color: barLegend['5'].color}
            },
            data: data.data5
          },
          {
            name: barLegend['6'].name,
            type: 'bar',
            stack: '总量',
            barWidth: 30,
            itemStyle:{
              normal:{color: barLegend['6'].color}
            },
            data: data.data6
          }
        ]
    };
    myCharts.setOption(option);
  }
}

Global.Monitor.prototype.loadLineChart = function() {
  var _end = (new Date()).getFullYear(),
      _url = this.type + '/' + this.areaCode + '/' + _end + '/9';
  var options = {
    url: _url,
    startDate: this.startDate,
    endDate: this.endDate
  }
  
  Global.Model.monitorLine(options, initChart);

  function initChart(data) {
    if (!data) {
      $('.monitor-none-data').html('-暂无数据！-');
      return;
    }
    var myCharts = echarts.init(document.getElementById('viewtarget-echarts'));
    var option = {
      tooltip: {
        position: ['80%', '60'],
        trigger: 'axis'
      },
      color:['#3ac1c3','#f7cc9b','#a1c7ee','#add985','#e5adc8'],
      legend: {
        data:['当年','去年','最高','最低','平均'],
        right: 50,
        top: '10%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '14%',
        top: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.linexAxis
      },
      yAxis: {
        type: 'value'
      },
      dataZoom: [{ 
        type: 'slider', 
        start: data.lineStart,
        end: 100
      }],
      series: [
      {
        name: '当年',
        lineStyle: {
          normal: {
            width: 2
          }
        },
        symbol: 'none',
        symbolSize: 10,
        type:'line',
        data: data.current,
        markArea: 
        {
          silent: true,
          itemStyle:
          {
            normal:
            {
              color:'#eef6fa',
              opacity: 0.8
            }
          },
          data: data.lineYearColor
        }
      },
      {
        name: '去年',
         lineStyle: {
              normal: {
                  width: 1,
              }
          },
        symbol: 'none',
        symbolSize: 10,
        type:'line',
        data: data.previous
      },
      {
        name: '最高',
        lineStyle: {
              normal: {
                  width: 1,
              }
          },
        symbol: 'none',
        symbolSize: 10,
        type:'line',
        data: data.max
      },
      {
        name: '最低',
        lineStyle: {
              normal: {
                  width: 1,
              }
          },
        symbol: 'none',
        symbolSize: 10,
        type:'line',
        data: data.min
      },
      {
        name: '平均',
        lineStyle: {
              normal: {
                  width: 1,
              }
          },
        symbol: 'none',
        symbolSize: 10,
        type:'line',
        data: data.average
      }
      ]
    };
    myCharts.setOption(option);
  }
}

// set title and tips in detail page
Global.Monitor.prototype.titleAndTip = function(isLine) {
  if (isLine || !this.isGrow) {
    $('.viewtarget-txt').html(this.detail[this.type].title);
    var _html = '<span></span>';
    _html += this.detail[this.type].help;
    $('.viewtarget-tooltip').html(_html);
  } else {
    $('.viewtarget-txt').html(this.detail[this.ptype].title);
    var _html = '<span></span>';
    _html += this.detail[this.ptype].help;
    $('.viewtarget-tooltip').html(_html);
  } 
}


