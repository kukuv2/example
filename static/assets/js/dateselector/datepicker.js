/**
 * @Author DPD
 * @Date 2016/6/30
 * Scroll date picker 
 * @params options:Object; 
 * options = {
 *   jdom: $('#date-picker'), // Container of the datepicker
 *   grade: 'period', // The grade of the datepicker, it maybe "day, period, month, year"
 *   startDate: new Date('2014-01-01'),
 *   endDate: new Date('2016-08-01'),
 *   selectedDate: new Date('2016-01-21')
 * }
 *   There has some bugs in mouse wheel event and day change by month
 * 
 */
Global.datePicker = Global.datePicker ? Global.datePicker : (function(options) {
  var result ={};

  var html = "";
  
  var years = 0,
      days = 0;

  // Initalize options and render the datepicker to page
  var init = function() {
    if(!options || !options.jdom) {
      console.log('datePicker need options or DOM object.');
      return;
    }

    options.grade = options.grade ? options.grade : "day";  // year month period day
    options.startDate = options.startDate ? options.startDate : new Date("1970-01-01");
    options.endDate = options.endDate ? options.endDate : new Date();
    options.selectedDate = options.selectedDate ? options.selectedDate : new Date();

    render();
    // Initalize current date.
    result.refresh();
    // Global.timelineObject = Global.timeLine(options);
    setTimeout(events, 100);
  }

  var render = function() {
    switch(options.grade) {
      case "year":
        setYear();
        break;
      case "month":
        setMonth();
        break;
      case "period":
        setPeriod();
        break;
      case "day":
        setDay();
        break;
      default :
        setDay();
        break;
    }
  }
  
  // Append elements to DOM
  var setYear = function() {
    html += '<div class="date-year-slider">'
            + '<div class="data-year-container">'
            + '<span class="selected-bg"></span>'
            + '<ul class="date-year">';
    years = options.endDate.getFullYear() - options.startDate.getFullYear();
    
    for (var i = 0; i <= years; i++) {
      html += '<li value="' + (options.startDate.getFullYear() + i) + '">' + (options.startDate.getFullYear() + i) + '</li>';
    }
    html += '</ul></div>'
              + '<a class="arrow up aleft"><i class="iconfont icon-icon1460361798771"></i></a>'
              + '<a class="arrow down aright"><i class="iconfont icon-jiantou-copy-copy-copy-copy-copy"></i></a>'
            + '</div>';
    options.jdom.append(html);
    html='';
  }

  var setMonth = function() {
    setYear();
    html += '<div class="date-month-slider">'
            + '<div class="data-month-container">'
            + '<span class="selected-bg"></span>'
            + '<ul class="date-month">';
    for (var i = 1; i <= 12; i++) {
      html += '<li value="' + i + '">' + i + '</li>';
    }
    html += '</ul></div>'
              + '<a class="arrow up aleft"><i class="iconfont icon-icon1460361798771"></i></a>'
              + '<a class="arrow down aright"><i class="iconfont icon-jiantou-copy-copy-copy-copy-copy"></i></a>'
            + '</div>';
    options.jdom.append(html);
    html='';
  }

  var setPeriod = function() {
    setMonth();
    html += '<div class="date-period-slider">'
            + '<div class="data-period-container">'
            + '<span class="selected-bg"></span>'
              + '<ul class="date-period">'
                + '<li value="1">上旬</li>'
                + '<li value="2">中旬</li>'
                + '<li value="3">下旬</li>'
              + '</ul></div>'
            + '<a class="arrow up aleft"><i class="iconfont icon-icon1460361798771"></i></a>'
            + '<a class="arrow down aright"><i class="iconfont icon-jiantou-copy-copy-copy-copy-copy"></i></a>'
          + '</div>';
    options.jdom.append(html);
    html='';
  }

  var setDay = function() {
    setMonth();
    days = Global.dateUtil.daysPerMonth(options.selectedDate);
    html += '<div class="date-day-slider">'
            + '<div class="data-day-container">'
            + '<span class="selected-bg"></span>'
          + '<ul class="date-day">'
    for (var i = 1; i <= days; i++) {
      html += '<li value="' + i + '">' + i + '</li>';
    }
    html += '</ul></div>'
          + '<a class="arrow up aleft"><i class="iconfont icon-icon1460361798771"></i></a>'
          + '<a class="arrow down aright"><i class="iconfont icon-jiantou-copy-copy-copy-copy-copy"></i></a>'
        + '</div>';
    options.jdom.append(html);
    html='';
  }

  // days will change when chooses month
  var resetDay = function() {
    var dayhtml = ''
    for (var i = 1; i <= days; i++) {
      dayhtml += '<li value="' + i + '">' + i + '</li>';
    }
    $('.date-day').html(dayhtml);
    // Fixme: 改变DOM 后 事件出问题
    
  }

  // when choose different month we have different days
  var changeDays = function() {
    if (options.grade != "day") return;
    days = Global.dateUtil.daysPerMonth(options.selectedDate);
    resetDay();

    if (options.selectedDate.getDate() > days) 
      options.selectedDate.setDate('01');
    showDay(options.selectedDate.getDate());
  }

  // change date by user click buttons
  result.changeDateEvent = function(grade, step) {
    switch(grade) {
      case "year":
        changeYear(step);
        break;
      case "month":
        changeMonth(step);
        break;
      case "period":
        changePeriod(step);
        break;
      case "day":
        changeDay(step);
        break;
      default :
        console.log('something wrong with the grade!');
        break;
    }
    result.updateTimeline(options.selectedDate); 
    console.log(options.selectedDate);
  }

  // It'll go fun when current month days longer than choosing month days
  var fixSelectedDay = function(currentDate, choosingDate) {
    if (options.grade != "day") return;
    if (Global.dateUtil.daysPerMonth(currentDate) > Global.dateUtil.daysPerMonth(choosingDate)) 
      options.selectedDate.setDate('01');
  }

  // judged by step wheather it is forward or reverse to change year
  var changeYear = function(step) {
    var currentYear = $('.date-year-slider ul').children(":first").next();
    if (step > 0) {
      if (currentYear.val() != options.endDate.getFullYear()) {
        fixSelectedDay(options.selectedDate, 
          new Date((options.selectedDate.getFullYear() + step), 
            (options.selectedDate.getMonth()),
            (options.selectedDate.getDate())));
        options.selectedDate.setFullYear(options.selectedDate.getFullYear() + step);
      }
      else {
        fixSelectedDay(options.selectedDate, 
          new Date(options.startDate.getFullYear(), 
            (options.selectedDate.getMonth()),
            (options.selectedDate.getDate())));
        options.selectedDate.setFullYear(options.startDate.getFullYear());
      }
    }
    else {
      if (currentYear.next().val() != options.startDate.getFullYear()) {
        fixSelectedDay(options.selectedDate, 
          new Date((options.selectedDate.getFullYear() + step), 
            (options.selectedDate.getMonth()),
            (options.selectedDate.getDate())));
        options.selectedDate.setFullYear(options.selectedDate.getFullYear() + step);
      }
      else {
        fixSelectedDay(options.selectedDate, 
          new Date(options.endDate.getFullYear(), 
            (options.selectedDate.getMonth()),
            (options.selectedDate.getDate())));
        options.selectedDate.setFullYear(options.endDate.getFullYear());
      }
    }
    changeDays();
  }

  // judged by step wheather it is forward or reverse to change month
  var changeMonth = function(step) {
    var currentMonth = $('.date-month-slider ul').children(":first").next();
    if (step > 0) {
      if(currentMonth.val() != 12) {
        fixSelectedDay(options.selectedDate, 
          new Date(options.selectedDate.getFullYear(), 
            (options.selectedDate.getMonth() + step),
            (options.selectedDate.getDate())));
        options.selectedDate.setMonth(options.selectedDate.getMonth() + step);   
      }
      else {
        fixSelectedDay(options.selectedDate, 
          new Date(options.selectedDate.getFullYear(), '01',
            (options.selectedDate.getDate())));
        options.selectedDate.setMonth("0");
      }
    }
    else {
      if (currentMonth.next().val() != 1) {
        fixSelectedDay(options.selectedDate, 
          new Date(options.selectedDate.getFullYear(), 
            (options.selectedDate.getMonth() + step),
            (options.selectedDate.getDate())));
        options.selectedDate.setMonth(options.selectedDate.getMonth() + step);
      }
      else {
        fixSelectedDay(options.selectedDate, 
          new Date(options.selectedDate.getFullYear(), '12',
            (options.selectedDate.getDate())));
        options.selectedDate.setMonth('11');
      }
    }
    changeDays();
  }

  // judged by step wheather it is forward or reverse to change period
  var changePeriod = function(step) {
    var currentPeriod =  $('.date-period-slider ul').children(":first").next();
    if (step > 0) {
      if (currentPeriod.val() != 3)
        options.selectedDate.setDate(options.selectedDate.getDate() + 10);
      else 
        options.selectedDate.setDate('01');
    }
    else {
      if (currentPeriod.next().val() != 1)
        options.selectedDate.setDate(options.selectedDate.getDate()-10);
      else
        options.selectedDate.setDate('21');
    }

  }

  // judged by step wheather it is forward or reverse to change day
  var changeDay = function(step) {
    var currentDay = $('.date-day-slider ul').children(":first").next();
    if(step > 0) {
      if (currentDay.val() != days) 
        options.selectedDate.setDate(options.selectedDate.getDate() + step);
      else
        options.selectedDate.setDate('01');
    }
    else {
      if(currentDay.next().val() != 1)
        options.selectedDate.setDate(options.selectedDate.getDate() + step);
      else
        options.selectedDate.setDate(days);
    }
  }

  // when change date we can refresh the datepicker anyway
  result.refresh = function(date) {
    date = date ? date : options.selectedDate;
    options.selectedDate = date;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    showYear(year);
    if(options.grade == 'month' || options.grade == 'period' || options.grade == 'day')
      showMonth(month);
    if (options.grade == 'period')
      showPeriod(day);
    if (options.grade == 'day')
      showDay(day);
  }

  result.getDate = function() {
    return options.selectedDate;
  }

  // Initalize current date to page
  var showYear = function(year) {
    var currentYear;
    for (var i = 0; i < years; i++) {
      currentYear = parseInt($('.date-year-slider ul li').eq(1).val());
      if (currentYear == year) return;
      var li = $('.date-year-slider ul').children(":first");
      $('.date-year-slider ul').append(li);
    }
  }

  var showMonth = function(month) {
    var currentMonth;
    for (var i = 0; i < 12; i++) {
      currentMonth = parseInt($('.date-month-slider ul li').eq(1).val());
      if (currentMonth == month) return;
      var li = $('.date-month-slider ul').children(":first");
      $('.date-month-slider ul').append(li);
    }
  }

  var showPeriod = function(day) {
    var period = Global.dateUtil.dayToPeriod(day);
    var currentPeriod;
    for (var i = 0; i < 3; i++) {
      currentPeriod = $('.date-period-slider ul li').eq(1).val();
      if (currentPeriod == period) return;
      var li = $('.date-period-slider ul').children(":first");
      $('.date-period-slider ul').append(li);
    }
  }

  var showDay = function(day) {
    var currentDay;
    for (var i = 0; i < days; i++) {
      currentDay = parseInt($('.date-day-slider ul li').eq(1).val());
      if (currentDay == day) return;
      var li = $('.date-day-slider ul').children(":first");
      $('.date-day-slider ul').append(li);
    }
  }

  // You can use this method to refresh timeline
  result.updateTimeline = function(date) {
    // use append or remove to change days
    Global.monitor.timelineObject.update(date);
  }

  // DOM events and something init must add after all nodes in page 
  var events = function() {
    $(".date-year-slider").Xslider({
      unitdisplayed: 3,
      numtoMove: 1,
      loop: "cycle",
      scrollobjSize: 80,
      viewedSize: 72,
      speed: 100,
      dir: "V"
    });

    $(".date-month-slider").Xslider({
      unitdisplayed: 3,
      numtoMove: 1,
      loop: "cycle",
      scrollobjSize: 80,
      viewedSize: 72,
      speed: 100,
      dir: "V"
    });

    $(".date-period-slider").Xslider({
      unitdisplayed: 3,
      numtoMove: 1,
      loop: "cycle",
      scrollobjSize: 80,
      viewedSize: 72,
      speed: 100,
      dir: "V"
    });

    $(".date-day-slider").Xslider({
      unitdisplayed: 3,
      numtoMove: 1,
      loop: "cycle",
      scrollobjSize: 80,
      viewedSize: 72,
      speed: 100,
      dir: "V"
    });
    
    var timeFn = null;
    $("a.aleft").on('click', function(event) {
      clearTimeout(timeFn);
      var className = $(this).parent().attr('class');
      timeFn = setTimeout(function(){
        result.changeDateEvent(checkGrade(className), -1);
      },100);
    });

    $("a.aright").on('click', function(event) {
      clearTimeout(timeFn);
      var className = $(this).parent().attr('class');
      timeFn = setTimeout(function(){
        result.changeDateEvent(checkGrade(className), 1);
      },100);
    });

    // still has problem
    // options.jdom.mousewheel(function(event, detal) {
    //   // TODO: How to control mouse wheel speed
    //   var target = event.target ? event.target : event.srcElement;
    //   var className = target.parentNode.parentNode.parentNode.className;
    //   if (detal > 5) {
    //     setTimeout(result.changeDateEvent(checkGrade(className), 1), 250);
    //   } else if (detal < -5) {
    //     setTimeout(result.changeDateEvent(checkGrade(className), -1), 250);
    //   }

    //   console.log(detal);
    //   result.refresh();
    // })

    // Init time line
    var bodyWidth = $(document.body).width();
    var tlWidth = bodyWidth - $('#date-picker').width()
          - bodyWidth * 0.02 - $('.time-content-right').width();
    var boundary = - $('.tl-container').width() + tlWidth;

    var tlcontainer = $("#tlboder").get(0);
    var tltarget = $("#tlcontainer").get(0);
    
    var options = {
      targeter: tltarget, 
      container: tlcontainer,
      leftBoundary: 0, 
      rightBoundary: boundary,
      stepLength: null, 
      callback: null
    }
    
    Global.dragElement(options);

    

  }
  // check grade by class name
  var checkGrade = function(className) {
    var grade = "";
    switch(className) {
      case "date-year-slider":
        grade = "year";
        break;
      case "date-month-slider":
        grade = "month";
        break;
      case "date-period-slider":
        grade = "period";
        break;
      case "date-day-slider":
        grade = "day";
        break;
      default :
        console.log('function checkGrade went wrong!')
        break;
    }
    return grade;
  }

    
  init();
  return result;
});