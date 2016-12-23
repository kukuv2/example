/**
 * @Author DPD
 * @Date 2016/6/30
 * Timeline 
 * @param options:Object
 * options = {
 *   startDate: new Date('2014-01-01'),
 *   endDate: new Date('2016-08-01'),
 *   selectedDate: new Date('2016-1-21')
 * }
 * The process and funtions list
 *   initalize add html to page
 *   add mouse events 
 *   judge if there has product layers
 *   update and refresh timeline
 *   the function of date to position 
 *   the function of position to date 
 *   get current year by positon move
 *   get relative left length of the line
 *   get year-month-period
 */

Global.timeLine = Global.timeLine ? Global.timeLine : (function(options) {
  var result = {};
  var tlLength;
  var html = "";

  var monthsZH = ["一月", "二月", "三月", "四月", "五月", "六月" ,"七月", "八月", "九月", "十月", "十一月", "十二月"];
  var periodZH = ["上旬", "中旬", "下旬"];

  options.selectedDate =  options.selectedDate ? options.selectedDate : new Date();
  options.startDate = options.startDate ? options.startDate : new Date('2010-01-01');
  options.endDate = options.endDate ? options.endDate : new Date();

  var init = function() {
    addTimeline(options.startDate, options.endDate, options.existOption);
    html += '<div class="current-year">'+ options.selectedDate.getFullYear() +'<span></span></div>';
    $('.ul-period').html(html);
    
    addMouseEvents();
    if (options.selectedDate) 
      result.update(options.selectedDate);
  }

  var addMouseEvents = function() {
    var mousedownPosition ;
    $('.ul-period li').on('click', function(event) {
      event.stopPropagation();
    });

    $('.ul-period li').on('mousedown', function(event) {
      mousedownPosition = event.clientX;
    });

    $('.ul-period li').on('mouseup', function(e) {
      var mouseMoveLength = mousedownPosition - e.clientX;
      if (mouseMoveLength < 10 && mouseMoveLength > -10) {
        $(this).addClass('tl-active').siblings().removeClass('tl-active');
        var dateString = $(this).attr('data-date');
        positionToDate(dateString);
        if($(this).attr('class').toString().indexOf('no-product') < 0)
          Global.monitor.addtlLayer(options.selectedDate);
      }
      mousedownPosition = 0;
    });

    $('.ul-period li').on('mousemove', function(event) {
      if (mousedownPosition == 0) return;
      var mouseMoveLength = mousedownPosition - event.clientX;
      if (mouseMoveLength > 10 || mouseMoveLength < -10) {
        // show current year
        var dateString = $(this).attr('data-date');
        var currentDate = currentYear(dateString, mouseMoveLength, mousedownPosition);
        $('.current-year').html(currentDate +'<span></span>');
      }
    }) ;

    $('.ul-period li').on('mouseover', function(e) {
      $(this).children().eq(3).show();
    });
    $('.ul-period li').on('mouseout', function(e) {
      $(this).children().eq(3).hide();
    });
  }

  var addTimeline = function(startDate, endDate, option) {
    tlLength = 0;
    var _start = parseInt(startDate.getFullYear());
    var _end = parseInt(endDate.getFullYear());
    var years = _end - _start;
    for (var y = 0; y <= years; y++) {
      existProduct(_start + y, option);
    }
    $('.tl-container').width(tlLength * 101 + 16);
  }

  var existProduct = function (year, _option) {
    Global.Request.existProduct(_option.productType, _option.areaCode, year, year, function(data) {
      
      for (var m = 0; m < 12; m++) {
        for (var p = 0; p < 3; p++) {
          var tips = "点击查看";
          var className = '';
          var period = ((m *3) + (p+1));
          if (data.data[year]) {
            if (period < 10 && data.data[year]['0'+period] != 1) {
              className = 'no-product';
              tips = "数据暂无";
            }
            if (period >= 10 && data.data[year][period] != 1) {
              className = 'no-product';
              tips = "数据暂无";
            } 
          } 
          else {
            className = 'no-product';
            tips = "数据暂无";
          }            
          tlLength ++;
          html += '<li data-type="'+ className +'" class="period-' + ((m *3) + (p+1)) + ' ' + className 
                + '" data-date="' + year + '-' + m + '-' + p + '" data-tooltip="'+'">'
                + '<h3>' + monthsZH[m] + periodZH[p] + '</h3>'
                
          html += '<em></em>'
                + '<div>'
                  + '<span></span><span></span><span></span><span></span><span></span>'
                  + '<span></span><span></span><span></span><span></span><span></span>'
                + '</div>'
                + '<p class="date-tip">'+ tips +'</p>'
              + '</li>';
        }
      }
    });
  }

  result.reLoad = function(_option) {
    html = '';
    addTimeline(options.startDate, options.endDate, _option);
    html += '<div class="current-year">'+ options.selectedDate.getFullYear() +'<span></span></div>';
    $('.ul-period').html(html);
    addMouseEvents();
    result.update(_option.date);
  }

  result.refresh = function() {
    dateToPosition();
  }
  
  result.update = function(date) {
    options.selectedDate = date ? date : options.selectedDate;
    dateToPosition();
    $('.current-year').html(options.selectedDate.getFullYear() +'<span></span>');
    
    var currentPositon = $('#tlboder').css('left').replace($('#tlboder').css('left').substr(-2), '');
    currentPositon = parseInt(currentPositon) + 300;
    var currentPositon1 = $('#slider').css('left').replace($('#slider').css('left').substr(-2), '');
    currentPositon1 = parseInt(currentPositon) + 300;
    $('#tlboder').css('left', currentPositon + 'px');
    $('#slider').css('left', currentPositon1 + 'px');

    Global.monitor.addtlLayer(date);
  }

  // The rule of caculate positon by date.
  var dateToPosition = function() { 
    var sliderLen = parseInt($('#slider').css('left').toString().replace('px', ''));
    var tlbodyLeft = parseInt($('#tlboder').css('left').toString().replace('px', ''));
    var sliderLeft = tlbodyLeft + sliderLen;
    var relativeLength = getRelativeLeft() - sliderLen;

    var bodyWidth = $(document.body).width();
    var tlWidth = bodyWidth - $('#date-picker').width()
          - bodyWidth * 0.02 - $('.time-content-right').width();
    var boundary = - $('.tl-container').width() + tlWidth;

    if (relativeLength >= sliderLeft && parseInt(relativeLength / 101) < 5) {
      $('#slider').css('left', (sliderLen + parseInt(relativeLength / 101) * 101) + 'px');
    } else if (relativeLength < 0 && -relativeLength <= sliderLeft && parseInt(relativeLength / 101) > -5) {
      $('#slider').css('left', (sliderLen + parseInt(relativeLength / 101) * 101) + 'px');
    } else if (boundary > (- getRelativeLeft())) {
      $('#tlboder').css('left', boundary + 'px');
    } else {
      $('#tlboder').css('left', (- getRelativeLeft()) + 'px');
      $('#slider').css('left', getRelativeLeft() + 'px');
    }

    // After the needs changed. We should go here 
    // to show the selected list style instead of move slider 
    var dataDate = getYmd();
    var arr = $('.ul-period li');
    for (var i = 0; i < arr.length; i++) {
      if (arr.eq(i).attr('data-date') == dataDate) {
        arr.eq(i).click();
        arr.eq(i).addClass('tl-active').siblings().removeClass('tl-active');
        return;
      }
    }
  }

  // When click timeline we'll change date and add geo layer.
  var positionToDate = function(dateString) {
    var arrTemp = dateString;
    arrTemp = arrTemp.toString().split('-');
    var year = arrTemp[0];
    var month = arrTemp[1];
    var period = arrTemp[2];
    var day = 0;
    if (period == 0) 
      day = 1;
    else if (period == 1) 
      day = 11;
    else if (period == 2) 
      day =21;

    options.selectedDate.setFullYear(year);
    options.selectedDate.setMonth(month);
    options.selectedDate.setDate(day);
    $('#slider').css('left', getRelativeLeft() + 'px');
    Global.monitor.datePickerObject.refresh(options.selectedDate);
    console.log(options.selectedDate);
  }

  var currentYear = function(dateString, mouseMoveLength, mousedownPosition) {
    var arrTemp = dateString;
    arrTemp = arrTemp.toString().split('-');
    var year = parseInt(arrTemp[0]);
    var month = parseInt(arrTemp[1]);
    var period = parseInt(arrTemp[2]);

    var clickToStartLength = parseInt((mousedownPosition - 250) / 101);
    month = month - parseInt(clickToStartLength / 3);
    period = period - clickToStartLength % 3;

    if (mouseMoveLength >0 && mouseMoveLength < 101) 
      mouseMoveLength = 101;
    if (mouseMoveLength < 0 && mouseMoveLength > 0) 
      mouseMoveLength = -101;
    var movePeriod = parseInt(mouseMoveLength / 101);
    
    month = month + parseInt(movePeriod / 3);
    period = period + movePeriod % 3;
    
    if (period > 2) 
      month += 1;
    if (period < 0) 
      month -= 1;
    if (month > 11) 
      year += 1;
    if (month < 0) 
      year -= 1;

    return year;
  }

  var getRelativeLeft = function() {
    var year = options.selectedDate.getFullYear();
    var month = options.selectedDate.getMonth();
    var day = options.selectedDate.getDate();
    var period = Global.dateUtil.dayToPeriod(day);
    var startYear = options.startDate.getFullYear();

    var periodNum = (year - startYear) * 36 + month * 3 + period - 1;
    return periodNum * 101;
  }

  var getYmd = function() {
    var year = options.selectedDate.getFullYear();
    var month = options.selectedDate.getMonth();
    var day = options.selectedDate.getDate();
    var period = Global.dateUtil.dayToPeriod(day);
    return year + '-' + month + '-' + (period - 1);
  }

  init();
  
  return result;
});