/**
 * @Author DPD
 * @Date 2016/11/18
 * These functions don't hava any dependences
 *   Define the own route, string replaceAll function
 *   Date format and exchange between date and period
 *   Copy object 
 *   Whether two objects are equal 
 */

Global = Global ? Global : {};

String.prototype.replaceAll = function (destinateStr, sourceStr) { 
  var reg = new RegExp(destinateStr, "g"),
    result = this.replace(reg, sourceStr); 
  return result; 
}
String.prototype.remove = function (removeStr, removeAll) { 
  var result;
  if (removeAll) {
    result = this.replaceAll(removeStr, "");
  } else {
    result = this.replace(removeStr, ""); 
  }
  return result; 
}

Global.Router = (function () { 

  function Router () {} 
  Router.prototype.route = function ( path, callback ) { 
    var url = location.hash.slice(1) ? location.hash.slice(1) : '/'; 
    window.addEventListener('load', function () {
      if ( url == path ) { 
        callback && callback(); 
      } 
    }, false); 
    window.addEventListener('hashchange', function () { 
      url = location.hash.slice(1) ? location.hash.slice(1) : '/'; 
      if ( url == path ) { 
        callback && callback(); 
      } 
    }, false); 
  }
  return new Router(); 
})();

Global.dateUtil = (function() {
  var result = {};

  result.timeToDate = function(time) {
    if (!time) {
      console.log('incorrect input params! ex: timeToDate(1400112321)');
      return -1;
    } else {
      var date = new Date();
      date.setTime(time);
      return date;
    }
  }

  result.dayToDate = function(year, day) {
    if (year.toString().length != 4 && !day) {
      console.log('incorrect input params! ex: dayToDate("2016","100")');
      return -1;
    } else {
      var _start = new Date(year.toString() + '-01-01');
      var _end = new Date();
      _end.setTime(_start.getTime() + (parseInt(day) - 1) * 24 * 3600 * 1000);
      return _end;
    }
  }

  result.periodToDate = function(period) {
    if (!period) {
      console.log('incorrect input params! ex: periodToDate("201613")');
      return -1;
    }

    var date;
    period = period.toString();
    
    var year = period.substr(0, 4);
    var period = period.substr(4);
    var month = parseInt(period / 3);
    var day = result.periodToDay(period % 3 - 1);
    if ((period % 3 - 1) >= 0) {
      month += 1;
    }
    month -= 1;
    date = new Date(year, month , day)
    return date;
  }

  result.periodToDay = function(period) {
    period = parseInt(period);
    
    var day = 0;
    if (period == 1) {
      day = 11;
    }
    else if (period == 2 || period == -1) {
      day = 21;
    }
    else {
      day = 1;
    }
    return day;
  }

  result.dateToDay = function(date) {
    if (!(date instanceof Date)) {
      console.log('incorrect input, correct format is Date.');
      return -1;
    }
    var firstDay = new Date(date.getFullYear()+'-01-01');
    var days = date - firstDay;
    return Math.ceil(days / (24 * 3600 * 1000));
  }

  result.dayToPeriod = function(day) {
    if (!day) {
      console.log('incorrect input params! ex: periodToDate(10)');
      return -1;
    }

    day = parseInt(day);
    if (day > 31 || day < 0) {
      console.log('incorrect input, correct format is day in a month between 1 and 31 .');
      return -1;
    }
    var period = 0;
    if ( day <= 10) {
      period = 1;
    }
    else if (day <= 20) {
      period = 2;
    }
    else {
      period = 3;
    }
    return period;
  }

  result.dateToPeriod = function(date) {
    if (!(date instanceof Date)) {
      console.log('incorrect input, correct format is Date.');
      return -1;
    }
    var period = 0;
    var month = date.getMonth();
    var period = result.dayToPeriod(date.getDate());
    period = month * 3 + period;
    if (period < 10) 
      period = '0' + period;
    return period;
  }

  result.formatDateToSecond = function(date) {
    if (!(date instanceof Date)) {
      console.log('incorrect input, correct format is Date.');
      return -1;
    }
    var month = ((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1);
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return date.getFullYear() + "-"
      + month + "-"
      + day + ' '
      + date.getHours() + ':'
      + date.getMinutes() + ':'
      + date.getSeconds();
  }

  result.formatDateZH = function(date) {
    if (!(date instanceof Date)) {
      console.log('incorrect input, correct format is Date.');
      return -1;
    }
    var month = ((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1);
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return date.getFullYear() + "年" + month + "月" + day + "日" ;
  }
  
  result.formatDate = function(date) {
    if (!(date instanceof Date)) {
      console.log('incorrect input, correct format is Date.');
      return -1;
    }
    var month = ((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1);
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return date.getFullYear() + "-" + month + "-" + day;
  }

  result.perviousYear = function(date) {
    if (!(date instanceof Date)) {
      console.log('incorrect input, correct format is Date.');
      return -1;
    }
    return new Date((date.getFullYear() - 1), date.getMonth(), date.getDate());
  }

  result.daysPerMonth = function(date) {
    if (!(date instanceof Date)) {
      console.log('incorrect input, correct format is Date.');
      return -1;
    }
    var year = date.getFullYear();
    var month = date.getMonth();
    return (32 - new Date(year, month, 32).getDate());
  }
  
  result.preTwoMonth = function(date) {
    if (!(date instanceof Date)) {
      console.log('incorrect input, correct format is Date.');
      return -1;
    }
    date = new Date(result.formatDate(date));
    var month = date.getMonth();
    if (month >1) {
      date.setMonth(month-2);
    } else if (month == 1) {
      date.setMonth(11)
      date.setFullYear(date.getFullYear() - 1);
    } else if (month == 0) {
      date.setMonth(10)
      date.setFullYear(date.getFullYear() - 1);
    }
    return date;
  } 

  return result;
})();


Global.copyObject = function(obj) {
  return (function deepCopy(source) {
        var result={};
        for (var key in source) {
          result[key] = typeof source[key] === 'object' ? 
                        deepCopy(source[key]) : 
                        source[key];
        } 
        return result; 
      })(obj);
}

Global.equalObject = function(source, dest) {
  return (function equalTo(source, dest) {
    var result;
    for (var key in source) {
      if (source[key] === dest[key]) {
        result = true;
      } else if (typeof source[key] === 'object') {
        result = equalTo(source[key], dest[key]);
        if (!result) {
          return result;
        }
      } else {
        return false;
      }
    } 
    return result;
  })(source, dest);
}
