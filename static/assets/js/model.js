/*
 * Data from server will filter and format here.
 * Add some judgement when data is empty.
 */ 

Global.Model = (function () {
  var result = {};

  result.homeData = function (callback) {
    Global.Request.homeCarousel(function(carouselData) {
      var carousel = {};
      if (carouselData.length > 0) {
        carousel.text = carouselData[0].text;
        carousel.carousel_img = carouselData[0].carousel_img;
      } else {
        carousel.text = '{"1": {"title": "全天候数据在线更新","content":"系统已实现遥感数据、气象数据的自动在线更新。保证分析数据及时更新，满足用户对指导农业生产时效性的需求。"},"2": {"title": "全自动化的处理模式","content":"系统从数据的获取，处理和信息提取，到专题产品的展现实现全自动化，在正常情况下不需要进行人工干预，保证的分析结果的快速客观。"},"3": {"title": "全部计算模型的高精度","content":"系统所采用的农作物分布模型、农作物旱情模型、农作物长势模型、单产模型等均为经过实践检验的成熟计算模型，保证计算分析结果符合实际使用精度要求。"}}';
        carousel.carousel_img = "http://dev-temp.oss-cn-beijing.aliyuncs.com/test/rscloud-offline/user-content/images/banner/banner/Topbanner.jpg";
      }
      Global.Request.homeReport(function(reportData) {
        var report = [],
          reportTitle = [];
        if (reportData && reportData.data && reportData.data.length > 0) {
          report = reportData.data;
          for (var i = 0; i < report.length; i++) {
            reportTitle.push(report[i].title);
          }
        }
        callback(carousel, report, reportTitle);
      });
    });
  }

  result.monitorProduct = function (callback) {
    Global.Request.productList(function(data) {
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          data[i].i = i + 1;
        }
      } else {
        data = [];
      }
      callback(data);
    });
  }

  result.monitorReport = function (data, callback) {
    var options = {
      data: data,
      callback: function (data) {
        callback(organize(data));
      }
    }
    Global.Request.marketReport(options);

    function organize(data) {
      if (data.total == 0) {
        return data;
      } else {
        var reportList = data.data;
        var reportListHtml = '';
        for(var  i = 0;i < reportList.length; i++){
          reportList[i].time = reportList[i].content_time.split(' ')[0];
          reportList[i].report_class = '';
          reportList[i].report_label = '';
          if(reportList[i].is_new){
            reportList[i].report_class = "re-orange";
            reportList[i].report_label = "新";
          }else if(reportList[i].is_hot){
            reportList[i].report_class = "re-red";
            reportList[i].report_label = "热";
          }
        }
        data.data = reportList;
        return data;
      }
    }
  }

  result.monitorBar = function (options, callback) {
    var bar = {};
    Global.Request.barData(options, function(data, options) {
      if (data.status != 0) {
        callback(null);
        console.log('monitor bar data err' + data.error_msg);
      } else {
        processData(data, options);
        callback(bar);
      }
    });

    function processData (data, options) {
      data = data.data;
      bar.legend = options.legend;
      var dayPeriod = function(_data) {
        bar.parxAxis = _data.X;

        bar.data1 = [];
        bar.data2 = [];
        bar.data3 = [];
        bar.data4 = [];
        bar.data5 = [];
        bar.data6 = [];

        var _width = $('#viewtarget-echarts').width() - 80;
        var _index = _width / 60;
        bar.parStart = (1 - (_index / _data.X.length).toFixed(2)) * 100;

        for (var i = 0; i < _data.Y.length; i++) {
          if (_data.Y[i]) {
            bar.data1.push(_data.Y[i]['1'].p);
            bar.data2.push(_data.Y[i]['2'].p);
            bar.data3.push(_data.Y[i]['3'].p);
            bar.data4.push(_data.Y[i]['4'].p);
            bar.data5.push(_data.Y[i]['5'].p);
            bar.data6.push(_data.Y[i]['6'].p);
          }
          else {
            bar.data1.push('');
            bar.data2.push('');
            bar.data3.push('');
            bar.data4.push('');
            bar.data5.push('');
            bar.data6.push('');
          } 
        }
      }

      var option = {
        startDate: options.startDate,
        endDate: options.endDate,
        data: data,
        CN: true,
        callback: dayPeriod
      };
      Global.formatData.apiDataToPeriod(option);
    }
  }

  result.monitorLine = function (options, callback) {
    var line = {};
    Global.Request.lineData(options, function(data, options) {
      if (data.status != 0) {
        callback(null);
        console.log('monitor line data err' + data.error_msg);
      } else {
        processData(data, options);
        callback(line);
      }
    });
    
    // foreach the data when initalize line chart
    function processData(data, options) {
      data = data.data;

      line.years = [], line.current = [], line.previous = [], 
      line.max = [], line.min = [], line.average = [], line.lineColor = line.lineColor ? line.lineColor : [];

      for(var key in data) {
        line.years.push(key);
      }
      line.years.sort(function() {return -1});

      function getAllPeriod() {
        var arrPeriod = [];
        
        for (var y = 0; y < 5; y++) {
          var _year = line.years[y + 5].substr(2);
          var _month;
          for (var i = 0; i < 36; i++) {
            var periodEn = Global.configData.dateItem.periodENCN[i];
            if (i + 1 < 10) {
              arrPeriod.push(_year + '-' + periodEn['0' + (i + 1)]);
            }
            else {
              arrPeriod.push(_year + '-' + periodEn[(i + 1)]);
            }
          }
          if (!line.initalize && y % 2 != 0) {
            var _period = Global.configData.dateItem.periodENCN[0]['01'];
            var _start = (_year - 1) + '-' + _period;
            var _end = _year + '-' + _period;
            var _arr = [{xAxis: _start}, {xAxis: _end}];
            line.lineColor.push(_arr); 
          }
        }

        line.initalize = true;
        line.linexAxis = arrPeriod;
        lineDifColor(line.years.slice(5));
      }

      function dayPeriod(datas) {
        getAllPeriod();
        line.lineStart = (1 - 1 / 5).toFixed(2) * 100 + 0.5;

        for (var i = 0; i < 5; i++) {
          var _data = datas.Y.slice(36 * i, (36 * 6) * (i + 1));
          var eachFiveYears = getFiveYears(_data);
          line.current = line.current.concat(eachFiveYears.current);
          line.previous = line.previous.concat(eachFiveYears.previous);
          line.max = line.max.concat(eachFiveYears.max);
          line.min = line.min.concat(eachFiveYears.min);
          line.average = line.average.concat(eachFiveYears.average);
        }
      }

      function getFiveYears(_data) {
        var fiveYearsResult = {};

        fiveYearsResult.current = [], fiveYearsResult.previous = [], fiveYearsResult.max = [], fiveYearsResult.min = [], fiveYearsResult.average = [], fiveYearsResult.data = [];
        fiveYearsResult.data[0] = _data.slice(0,36);
        fiveYearsResult.data[1] = _data.slice(36,72);
        fiveYearsResult.data[2] = _data.slice(73,108);
        fiveYearsResult.data[3] = _data.slice(109,144);
        fiveYearsResult.data[4] = fiveYearsResult.previous = toFixed2(_data.slice(144,180));
        fiveYearsResult.current = toFixed2(_data.slice(180,216));

        for (var i = 0; i < 36; i++) {
          fiveYearsResult.max[i] = -Infinity;
          fiveYearsResult.min[i] = Infinity;
          fiveYearsResult.average[i] = '';
          var averageNum = 0;
          for (var y = 0; y < 5; y++) {
            var _value = parseInt(fiveYearsResult.data[y][i]);
            if (!!_value) {
              fiveYearsResult.max[i] = (_value > fiveYearsResult.max[i]) ? Number(_value).toFixed(2) : fiveYearsResult.max[i];
              fiveYearsResult.min[i] = (_value < fiveYearsResult.min[i]) ? Number(_value).toFixed(2) : fiveYearsResult.min[i];
              fiveYearsResult.average[i] = Number(fiveYearsResult.average[i]) + Number(Number(_value).toFixed(2));
              averageNum ++;
            }
          }
          fiveYearsResult.max[i] = (fiveYearsResult.max[i] == -Infinity) ? '-' : fiveYearsResult.max[i];
          fiveYearsResult.min[i] = (fiveYearsResult.min[i] == Infinity) ? '-' : fiveYearsResult.min[i];
          fiveYearsResult.average[i] = fiveYearsResult.average[i] ? Number(fiveYearsResult.average[i] / averageNum).toFixed(2) : '-';
        }
        return fiveYearsResult;
      }

      var _endYear = parseInt(options.endDate.getFullYear()) - 9
      var params = {
        startDate: new Date( _endYear + '-01-01'),
        endDate: new Date(options.endDate.getFullYear() + '-12-31'),
        data: data,
        callback: dayPeriod
      };
      Global.formatData.apiDataToPeriod(params);
    }

    function toFixed2(array) {
      for (var i = 0; i < array.length; i++) {
        if (!array[i]) {
          array[i] = '-'
        } else {
          array[i] = Number(array[i]).toFixed(2);
        }
      }
      return array;
    }

    function lineDifColor(years) {
      if (!line.lineYearColor) {
        line.lineYearColor = [];
        for (var i = 0; i < 5; i++) {
          var cy = years[i].substr(2,2);
          if (i % 2 != 0) {
            var arr = [{xAxis: cy + '-1月上旬'}, {xAxis: (parseInt(cy) + 1) + '-1月上旬'}];
            line.lineYearColor.push(arr);
          } 
        }
      }
    }
  }

  result.getCpList = function (callback) {
    Global.Request.distributeList(function(data) {
      if (data.length == 0) {
        callback(data);
      } else {
        for (var i = 0; i < data.length; i++) {
          data[i].publish_time = data[i].publish_time.split(' ')[0];
        }
        callback(data);
      }
    });
  }

  result.getDcp = function (code, callback) {
    var dynamicData = {};

    Global.Request.dynamicDistributeId(getId);

    function getId(data) {
      if (data && data.length > 0) {
        dynamicData.id = data[0].only_result;
        dynamicData.title = data[0].title;
        dynamic(dynamicData.id);
      }
    };

    function dynamic(id) {
      Global.Request.dynamicDistribute(id, function (data) {
        if (data.status == 0) {
          var len = data.data[id].length;
          if (len > 2) {
            dynamicData.layerArr = [];
            dynamicData.dates = [];
            dynamicData.data = data.data[id];

            for (var i = len - 1; i >= 0; i--) {
              for(var j = 0; j < dynamicData.data[i].scp_list.length; j++) {
                if (code == dynamicData.data[i].scp_list[j].code) {
                  dynamicData.scp = dynamicData.data[i].scp_list[j];

                  var area_code = dynamicData.data[0].area_code;
                  getArea(area_code);
                  break;
                }
              }

              var dateStr = dynamicData.data[i].target_time;
              dateStr = dateStr.split(' ')[0];
              dynamicData.layerArr.unshift(dynamicData.data[i].scp_list);
              dynamicData.dates.unshift(new Date(dateStr));
            }
          } else {
            console.log("接口返回:" + data.error_msg);
            callback(null);
          }
        };
      });
    }

    function getArea(area_code) {
      var options = {
        data: {
          arealist: [{"grade": '4', "area_code": area_code}]
        },
        callback: function(data) {
          if (data.status != '0') {
            dynamicData.tlAreaList = [];
            console.log("接口返回:" + data.error_msg); 
          } else {
            dynamicData.tlAreaList = data.data;
          }
          callback(dynamicData);
        }
      }
      Global.Request.getPartAreas(options);
    }
  }

  result.getCp = function (id, callback, code) {
    Global.Request.distributeById(id, function(data) {
      if (data.status != 0) {
        console.log('distribute API went wrong!');
        callback(null); 
        Global.loading.hide();
      } else {
        code = code ? code : data.data[id].area_code;
        var cp = areaCpData(data.data[id].scps, code);
        if (!cp) {
          console.log('Do not have id is '+ id +' layer data.');
        } 
        callback(cp, data.data[id].area_list); 
      }
    });

    function areaCpData(data, code) {
      for (var i = 0; i < data.length; i++) { 
        if (code == data[i].code) {
          return data[i];
        }
      }
      return null;
    }
  }


  result.reportType = function (callback) {
    Global.Request.reportType(function(data) {
      if (data && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          data[i].special_class = "report-common";
          data[i].special_label = "";
          if(data[i].is_new) {
            data[i].special_class = "report-new";
            data[i].special_label = "新";
          }else if(data[i].is_hot) {
            data[i].special_class = "report-hot";
            data[i].special_label = "热";
          }
        }
        callback(data);
      } else {
        console.log('There is something wrong with report type data.');
        callback([]);
      }
    });
  }

  result.reportList = function (data, callback) {
    Global.Request.reportList(data, function(reports) {
      var reportList = reports.data;
      if (reportList && reportList.length > 0) {
        for (var i = 0; i < reportList.length; i++) {
          reportList[i].report_class = "";
          reportList[i].report_label = "";
          reportList[i].vertical = "";
          reportList[i].content_time = reportList[i].content_time.split(' ')[0]; 
          if($('.report-single').hasClass('vertical') || $('.vertical-btn').attr('class').indexOf('active') > 0) {
            reportList[i].vertical = ' vertical';
          }
          if(reportList[i].is_new){
            reportList[i].report_class = "re-orange";
            reportList[i].report_label = "新";
          }
          else if(reportList[i].is_hot){
            reportList[i].report_class = "re-red";
            reportList[i].report_label = "热";
          }
        }
        var data = {};
        data.data = reportList;
        data.total = reports.total;
        callback(data);
      } else {
        console.log('There is something wrong with report data.');
        callback([]);
      }
    });
  }

  result.analyzeData = function (options) {
    Global.Request.statistics(options.url,  function(data) {
      if (data.error_msg) {
        console.log(data.error_msg);
        Global.loading.hide();
        options.callback(null);
      }
      var _options = {
        startDate: options.startDate,
        endDate: options.endDate,
        data: data.data,
        ENCN: true,
        callback: processData
      };
      Global.formatData.apiDataToPeriod(_options);
    });

    function processData(data) {
      var analyze = {};
      analyze.tbData = [];
      analyze.pieData = data.Y;
      analyze.sum = data.X.length - 1;
      analyze.pageIndex = 0;
      analyze.totalPage = Math.ceil(analyze.sum / options.pageSize);

      var index = '', level, isGrow;

      for (var i = 0; i < data.X.length; i++) {
        options.anIndex = options.anIndex.remove('-1');
        options.anIndex = options.anIndex.remove('-5');
        
        index = options.anIndex;

        // data.Y[i] dosen't exist 
        if (!data.Y[i]) {
          analyze.tbData[i] = {};
          analyze.tbData[i].date = data.X[i];
          analyze.tbData[i].level = '－';
          analyze.tbData[i].levelClass = 'no-data';
          analyze.tbData[i].compare = '－';
          analyze.tbData[i].pieKey = index 
          analyze.tbData[i].pieIndex = "－";
          continue;
        }
        if (data.Y[i].misc.p == -9999) {
          data.Y[i].misc.p = '－';
        }

        level = data.Y[i].misc.lv;
        level = Global.configData.productLegendConf[index][level]['name'];
        isGrow = (Global.configData.growTarget.name.indexOf(index) >= 0);

        analyze.tbData[i] = {};
        analyze.tbData[i].date = data.X[i];
        analyze.tbData[i].level = level;
        analyze.tbData[i].levelClass = (data.Y[i].misc.lv + '-' + isGrow);
        analyze.tbData[i].compare = data.Y[i].misc.p;
        analyze.tbData[i].pieKey = index 
        analyze.tbData[i].pieIndex = i;

        // add class name
        analyze.tbData[i].className = 'evaluat-top';
        analyze.tbData[i].compare = analyze.tbData[i].compare.remove('%');
        if (analyze.tbData[i].compare == '－') {
          analyze.tbData[i].className = 'no-data';
        }
        else if (analyze.tbData[i].compare > 10) {
          analyze.tbData[i].compare += '%';
          analyze.tbData[i].className = 'evaluat-top';
        } else if (analyze.tbData[i].compare < -10) {
          analyze.tbData[i].compare += '%';
          analyze.tbData[i].className = 'evaluat-bottom';
        } else{
          analyze.tbData[i].compare += '%';
          analyze.tbData[i].className = 'evaluat-level';
        } 
      }
      options.callback(analyze);
    }
  }

  result.atmosStation = function (showAll, callback) {
    Global.Request.weatherStations(showAll, function(data) {
      if(data.status != 0) {
        console.log(data.error_msg);
        callback([]);
      } else {
        callback(data.data);
      }
    });
  }

  result.getWeatherFeature = function (options) {
    var params = {
      stationId: options.stationId,
      index: options.index,
      startDate: options.startDate,
      endDate: options.endDate,
      callback: function(data) {
        if(data.status != 0) {
          console.log(data.error_msg);
          Global.loading.hide();
          options.callback([]);
        } else {
          options.callback(data.data);
        }
      }
    }
    Global.Request.weatherFeature(params);
  }

  result.getRecentWP = function (options) {
    var params = {
      areaCode: options.areaCode,
      type: options.type,
      index: options.index,
      grade: options.grade,
      callback: function(data) {
        if (data.status != '0') {
          console.log(data.error_msg);
          Global.loading.hide();
          options.callback(null);
        }
        var recent = Global.dateUtil.dayToDate(data.data.year, data.data.day);
        options.callback(recent);
      }
    }
    Global.Request.atmosRecent(params);
  }

  result.getWPLayerName = function (options) {
    var params = {
      areaCode: options.areaCode,
      type: options.type,
      index: options.index,
      grade: options.grade,
      date: options.date,
      callback: function(data) {
        if (data.status != '0') {
          console.log(data.error_msg);
          Global.loading.hide();
          options.callback(null);
        } else {
          for(var year in data.data) {
            for(var day in data.data[year]) {
              options.callback(data.data[year][day].tif_name);
              return;
            }
          }
          options.callback(null);
        }
      }
    }
    Global.Request.getLayerName(params);
  }

  result.getCropAndArea = function (options) {
    var market = {};
    Global.Request.cropList(getAreas);

    function getAreas(data) {
      if (data.status == '0') {
        market.crop = data.data;
      } else {
        market.crop = null;
        console.log(data.error_msg); 
      }

      var params = { 
        data: options.data,
        callback: function(data) {
          if (data.status == '0') {
            market.area = data.data[0];
          } else {
            market.area = null;
            console.log(data.error_msg); 
          }
          options.callback(market);
        }
      }
      Global.Request.getPartAreas(params);
    }
  }

  result.getMarketBar = function (options) {
    var bar = {};
    var params = {
      fpId: options.fpId,
      dateType: options.dateType,
      callback: function(data) {
        if (data.status == '0') {
          var _data = data.data;
          bar.xAxis = []; 
          bar.yAxis = [];
          for(var code in _data) {
            bar.xAxis.push(_data[code].area_name);
            bar.yAxis.push(_data[code].price);
          }
          options.callback(bar);

        } else {
          options.callback(null);
          console.log(data.error_msg); 
        }
      }
    }

    Global.Request.barAveragePrice(params);
  }

  result.getMarketLine = function (options) {
    var line = {};
    var params = {
      fpId: options.fpId,
      dateType: options.dateType,
      callback: function(data) {
        Global.loading.hide();

        if (data.status != '0') {
          options.callback(null);
          console.log(data.error_msg);

          return;
        }

        var _data = data.data;

        line.xAxis = [];
        line.yAxis = [];
        line.maxPrice = Number.NEGATIVE_INFINITY;

        for (var i = 0; i < _data.length; i++) {
          var point = _data[i];
          if (!point) {
            continue;
          }
          if (!point.date || !point.price) {
            console.log('API data format is very wrong!');
            continue;
          }

          var date = point.date.split(' ')[0];
          var price = point.price;

          if (line.maxPrice < price) {
            line.maxPrice = price;
          }
          if (price < 0) {
            price = '-';
          }

          line.yAxis.push(price);
          line.xAxis.push(date);
        }

        if (line.maxPrice < 0) {
          line.maxPrice = 0;
        }

        options.callback(line);
      }
    }
    Global.loading.show();
    Global.Request.lineAveragePrice(params);
  }

  result.getPriceDetail = function (options) {
    var price = {};
    var params = {
      fpId: options.fpId,
      marketId: options.marketId,
      dateType: options.dateType,
      callback: function(data) {
        Global.loading.hide();
        if (data.status != '0') {
          options.callback(null);
          console.log(data.error_msg);
        } else {
          var _data = data.data;
          price.data = _data.prices,
          price.maxPrice = 0,
          price.startDate = Global.dateUtil.formatDateZH(new Date( _data.start_date.split(' ')[0])),
          price.endDate = Global.dateUtil.formatDateZH(new Date( _data.end_date.split(' ')[0]));

          price.xAxis = [];
          price.yAxis = [];
          for (var i = 0; i < price.data.length; i++) {
            var date = price.data[i].date.split(' ')[0];
            if (price.maxPrice < price.data[i].price) {
              price.maxPrice = price.data[i].price;
            }
            if (price.data[i].price < 0) {
              price.data[i].price = '-';
            }
            price.yAxis.push(price.data[i].price);
            price.xAxis.push(date);
          }
          options.callback(price);
        }
      }
    }
    Global.loading.show();
    Global.Request.cropSingleLine(params);
  }

  result.getMarketsInfo = function (options) {
    var markets = {};
    var params = {
      areaId: options.areaId,
      cropId: options.cropId,
      dateType: options.dateType,
      pageIndex: options.pageIndex,
      pageCount: options.pageCount,
      callback: function(data) { 
        if (data.status != '0') {
          options.callback(null);
          console.log(data.error_msg);
        } else {
          processData(data.data)
          options.callback(markets);
        }
      }
    }
    Global.Request.marketPriceInfo(params);

    function processData(data) {
      if (data.total_page == 0) {
        markets = null;
      } else {
        var _data = data.market_datas;
        markets.totalPage = data.total_page;
        markets.data = [];

        for (var i = 0; i < _data.length; i++) {
          markets.data[i] = {};
          markets.data[i].market_id = _data[i].market_id;
          markets.data[i].market_name = _data[i].market_name;
          markets.data[i].market_name = _data[i].market_name;
          markets.data[i].farm_product_name = data.farm_product_name;


          markets.data[i].rateFlag = Global.configData.market.rateFlag[_data[i].date_flag];
          if (!_data[i].cur_price) {
            markets.data[i].cur_price = '<span class="no-cur-data">-暂无-</span>';
            markets.data[i].desc = '<span class="no-cur-data">-暂无-</span>';
            markets.data[i].color = 'market-gray';
          } else { 
            markets.data[i].price = _data[i].cur_price.toFixed(2) + '</b>元/kg';
            if (_data[i].cur_price - _data[i].pre_price == 0) {
              markets.data[i].color = 'market-blue';
              markets.data[i].desc = '持平';
              markets.data[i].image = '';
              markets.data[i].delta = '';
            } else if (_data[i].cur_price - _data[i].pre_price > 0) {
              markets.data[i].color = 'market-red';
              markets.data[i].image = 'market-evaluat-top';
              markets.data[i].desc = '上升' + Number(_data[i].ratio).toFixed(2) + '%';
              markets.data[i].delta = (_data[i].cur_price - _data[i].pre_price).toFixed(2) + '<i class="rate-unit">元/kg</i>';
            } else {
              markets.data[i].color = 'market-green';
              markets.data[i].image = 'market-evaluat-bottom';
              markets.data[i].desc = '下降' + Number(_data[i].ratio).toFixed(2) + '%';
              markets.data[i].delta = (_data[i].pre_price - _data[i].cur_price).toFixed(2) + '<i class="rate-unit">元/kg</i>';
            }
          }
        }
      }
    }
  }

  result.getMarketNews = function (options) {
    var news = {};
    var params = {
      pageSize: options.pageSize,
      pageIndex: options.pageIndex,
      callback: function(data){
        if(data.total == 0){
          options.callback(null);
        } else {
          news.total = data.total;
          news.sumPage = Math.ceil(news.total / options.pageSize);
          processData(data.data);
          options.callback(news);
        }
        
      }
    }
    Global.Request.marketNews(params);

    function processData(data) {
      news.data = [];
      news.content = [];
      for(var i = 0;i < data.length; i++){
        var publish_time = new Date(data[i].publish_time).getTime(),
          timestamp = new Date().getTime(),
          paragraph = data[i].main_body.replace(/<\/?.+?>/g,"");

        news.data[i] = {};
        news.data[i].news_img = data[i].news_img;
        news.data[i].title = data[i].title;
        news.data[i].publish_time = getTimeToNow(timestamp, publish_time, data[i].publish_time);
        news.data[i].paragraph = paragraph;
        news.data[i].i = i;

        news.content[i] = data[i];
        news.content[i].label = data[i].label ? data[i].label : "";
        news.content[i].source = data[i].source ? data[i].source : "";
      }
    }

    function getTimeToNow(timestamp, publishtamp, publishTime) {
      var time ,
        second = parseInt(timestamp - publishtamp) / 1000,
        day = parseInt(second / 60 / 60 / 24),
        hour = parseInt(second / 60 / 60),
        minute = parseInt(second / 60);

      if (day < 7 && day >= 1){
        time = day + '天前';
      } else if (hour < 24 && hour >= 1){
        time = hour + '小时前';
      } else if (minute < 60 && second >= 60){
        time = minute + '分钟前';
      } else if (second < 60){
        time = '1分钟前';
      } else {
        time = publishTime.split(' ')[0].replace('-','年').replace('-','月') + '日';
      }
      return time;
    }
  }


  result.getPointInfo = function (options) {
    var point = {};
    var params = {
      code: options.code,
      crop: options.crop,
      lon: options.lon,
      lat: options.lat,
      callback: function (data) {
        if (data.status != 0) {
          console.log(data.error_msg);
          options.callback(null);
        } else {
          point.data = data.data;
          point.lonlat = ol.proj.toLonLat([options.lon, options.lat]);
          getPoi(point.lonlat)
        }
      }
    }
    Global.Request.pointSutInfo(params);


    function getPoi(lonlat) {
      var params = {
        lon: lonlat[0],
        lat: lonlat[1],
        callback: function(result) {
          var begin = result.indexOf('{');
          var end = result.lastIndexOf('}') + 1;
          var text = result.substring(begin, end);
          var object = JSON.parse(text);

          if (object.status == 0) {
            point.poi = object.result;
            options.callback(point);
          } else {
            point.poi = null;
            options.callback(point);
          }
        }
      }
      Global.Request.tdtPoi(params);
    }
  }

  result.getCropLayer = function (options) {
    var params = {
      code: options.code,
      crop: options.crop,
      callback: function (data) {
        if (data.status != 0) {
          options.callback(null);
          console.log(data.error_msg);
        } else {
          options.callback(data.data);
        }
      }
    }
    Global.Request.sutResultInfo(params);
  }


  result.getBounds = function (code, callback) {
    Global.Request.areaBounds(code, function(data) {
      if (data.status != 0) {
        console.log('Area bounds data wrong!' + data.error_msg);
        callback(null);
      } else {
        var bounds = data.data.bounds;
        bounds = [bounds.lb_lon, bounds.lb_lat, bounds.rt_lon, bounds.rt_lat];
        callback(bounds);
      }
    });
  }

  return result;
})();
