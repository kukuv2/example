/**
* @Author:DPD
* @Date: 2016/7/20
* The home model
*/
Global.Home = function() {
  if (this instanceof Global.Home) {
    this.init();
  } else {
    new Global.Home();
  }
}
Global.Home.prototype.init = function() {
  this.titleOfBanner = [];
  this.contentOfBanner = [];
  this.reportTitle = [];
  this.fetchData();
}
Global.Home.prototype.fetchData = function() {
  var self = this;
  Global.Model.homeData(function(carousel, report, reportTitle) {
    self.reportTitle = reportTitle;
    self.render(carousel, report);
  });
}
Global.Home.prototype.render = function(carousel, report) {
  var self = this;
  var titleObject = JSON.parse(carousel.text);
  for(var key in titleObject) {
    self.titleOfBanner.push(titleObject[key].title);
    self.contentOfBanner.push(titleObject[key].content);
  }
  $('.banner-img').attr('src', carousel.carousel_img);
  
  var htmlTempalte = '<li><a  href="#/report"><img src="{{img_url}}" /><p>{{title}}</p></a></li>',
    reportsHtml = Global.formatData.formatHtml(htmlTempalte, report);
  $('.home-report-list').html(reportsHtml);
  this.bindEvents();
}
Global.Home.prototype.bindEvents = function() {
  var self = this;
  $('.growth-link').on('click', function() {
    Global.productID = '1';
    window.location.href = CONF.baseUrl + "#/viewtarget";
  });
  $('.drought-link').on('click', function() {
    Global.productID = '4';
    window.location.href = CONF.baseUrl + "#/viewtarget";
  });
  initCarouse();
  reportSlider();
  function initCarouse() {
    var arrTitle = self.titleOfBanner;
    var arrContent = self.contentOfBanner;
    var isnow = 0;
    Global.timer = Global.timer ? Global.timer : {};
    Global.timer.homeTimer = Global.timer.homeTimer ? Global.timer.homeTimer : null;
    $('.banner-txt h3').html(arrTitle[0]);
    $('.banner-txt P').html(arrContent[0]);

    var slide = function(){
      $('.banner-click li').each(function (index){
        if(isnow != index){
          $('.banner-click li').eq(index).removeClass('iconfont icon-yuandian active');
        }else{
          $('.banner-click li').eq(index).addClass('iconfont icon-yuandian active');
        }
        $('.banner-txt h3').html(arrTitle[isnow]);
        $('.banner-txt P').html(arrContent[isnow]);
      })
    }

    var autoPlay = function(){
      clearInterval(Global.timer.homeTimer);
      Global.timer.homeTimer = setInterval(function (){
        isnow++;
        if(isnow >= arrContent.length){
          isnow = 0;
        }
        slide();  
      },2000);
    }

    autoPlay();
    $('.banner-click li').click(function (){
      isnow = $(this).index();
      slide();
    });
    $('.banner .next').click(function (){
      isnow++;
      if(isnow >= arrContent.length){
        isnow = 0;
      }
      slide();
    });
    $('.banner .pre').click(function (){
      isnow--;
      if(isnow < 0){
        isnow = arrContent.length-1;
      }
      slide();
    });
  }
  function reportSlider() {
    function ImageSlider () {
      this.initialize.apply(this, arguments);  
    }
    ImageSlider.prototype = {
      initialize : function (id) {
        var _this = this;
        this.wrap = typeof id === "string" ? document.getElementById(id) : id;
        this.oUl = this.wrap.getElementsByTagName("ul")[0];
        this.aLi = this.wrap.getElementsByTagName("li");
        this.oP = this.wrap.getElementsByTagName("p");
        this.prev = this.wrap.getElementsByTagName("span")[0];
        this.next = this.wrap.getElementsByTagName("span")[1];
        this.oldMsg = [];
        Global.timer.homeReportTimer = null;
        this.aSort = [];
        this.iCenter = 1;
        var oTxt = self.reportTitle;
        for(var i = 0; i < this.oP.length; i++){
          this.oP[i].innerHTML = oTxt[i];
        }
        this._doPrev = function () {return _this.doPrev.apply(_this)};
        this._doNext = function () {return _this.doNext.apply(_this)};
        this.options = [
        {width:285, height:240, top:61, left:234, zIndex:1},
        {width:285, height:240, top:61, left:0, zIndex:2},
        {width:285, height:308, top:37, left:110, zIndex:3},
        ]; 
        for (var i = 0; i < this.aLi.length; i++) this.aSort[i] = this.aLi[i];
        this.aSort.unshift(this.aSort.pop());
        this.setUp();
        this.addEvent(this.prev, "click", this._doPrev);
        this.addEvent(this.next, "click", this._doNext);
        this.doImgClick();    
        clearInterval(Global.timer.homeReportTimer);
        Global.timer.homeReportTimer = setInterval(function ()
        {
          _this.doNext()  
        }, 3000);   
        this.wrap.onmouseover = function ()
        {
          clearInterval(Global.timer.homeReportTimer)  
        };
        this.wrap.onmouseout = function ()
        {
          clearInterval(Global.timer.homeReportTimer);
          Global.timer.homeReportTimer = setInterval(function ()
          {
            _this.doNext()  
          }, 3000); 
        }
      },
      doPrev : function () {
        this.aSort.unshift(this.aSort.pop());
        this.setUp()
      },
      doNext : function () {
        this.aSort.push(this.aSort.shift());
        this.setUp()
      },
      doImgClick : function () {
        var _this = this;
        for (var i = 0; i < this.aSort.length; i++)
        {
          this.aSort[i].onclick = function ()
          {
            if (this.index > _this.iCenter)
            {
              for (var i = 0; i < this.index - _this.iCenter; i++) _this.aSort.push(_this.aSort.shift());
                _this.setUp()
            }
            else if(this.index < _this.iCenter)
            {
              for (var i = 0; i < _this.iCenter - this.index; i++) _this.aSort.unshift(_this.aSort.pop());
                _this.setUp()
            }
          }
        }
      },
      // try{}catch(){}
      setUp : function () {
        var _this = this;
        var i = 0;
        for (i = 0; i < this.aSort.length; i++) {
          this.oUl.appendChild(this.aSort[i]);
        }
        for (i = 0; i < this.aSort.length; i++) {
          this.aSort[i].index = i;
          if (i < 7) {
            this.css(this.aSort[i], "display", "block");
            this.doMove(this.aSort[i], this.options[i], function ()
            {
              _this.doMove(_this.aSort[_this.iCenter].getElementsByTagName("img")[0],function ()
              {
                _this.doMove(_this.aSort[_this.iCenter].getElementsByTagName("img")[0],function ()
                {
                  _this.aSort[_this.iCenter].onmouseover = function ()
                  {
                    _this.doMove(this.getElementsByTagName("div")[0], {bottom:0})
                  };
                  _this.aSort[_this.iCenter].onmouseout = function ()
                  {
                    _this.doMove(this.getElementsByTagName("div")[0], {bottom:-100})
                  }
                })
              })
            });
          }
          else {
            this.css(this.aSort[i], "display", "none");
            this.css(this.aSort[i], "width", 0);
            this.css(this.aSort[i], "height", 0);
            this.css(this.aSort[i], "top", 37);
            this.css(this.aSort[i], "left", this.oUl.offsetWidth / 2)
          }
          if (i < this.iCenter || i > this.iCenter) {
            this.css(this.aSort[i].getElementsByTagName("img")[0], 100)
            this.aSort[i].onmouseover = function ()
            {
              _this.doMove(this.getElementsByTagName("img")[0]) 
            };
            this.aSort[i].onmouseout = function ()
            {
              _this.doMove(this.getElementsByTagName("img")[0])
            };
            this.aSort[i].onmouseout();
          }
          else {
            this.aSort[i].onmouseover = this.aSort[i].onmouseout = null
          }
        }   
      },
      addEvent : function (oElement, sEventType, fnHandler)
      {
        return oElement.addEventListener ? oElement.addEventListener(sEventType, fnHandler, false) : oElement.attachEvent("on" + sEventType, fnHandler)
      },
      css : function (oElement, attr, value)
      {
        if (arguments.length == 2)
        {
          return oElement.currentStyle ? oElement.currentStyle[attr] : getComputedStyle(oElement, null)[attr]
        }
        else if (arguments.length == 3)
        {
          switch (attr)
          {
            case "width":
            case "height":
            case "top":
            case "left":
            case "bottom":
            oElement.style[attr] = value + "px";
            break;
            case "opacity" :
            oElement.style.filter = "alpha(opacity=" + value + ")";
            oElement.style.opacity = value / 100;
            break;
            default :
            oElement.style[attr] = value;
            break
          } 
        }
      },
      doMove : function (oElement, oAttr, fnCallBack)
      {
        var _this = this;
        clearInterval(oElement.timer);
        oElement.timer = setInterval(function ()
        {
          var bStop = true;
          for (var property in oAttr)
          {
            var iCur = parseFloat(_this.css(oElement, property));
            property == "opacity" && (iCur = parseInt(iCur.toFixed(2) * 100));
            var iSpeed = (oAttr[property] - iCur) / 5;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

            if (iCur != oAttr[property])
            {
              bStop = false;
              _this.css(oElement, property, iCur + iSpeed)
            }
          }
          if (bStop)
          {
            clearInterval(oElement.timer);
            fnCallBack && fnCallBack.apply(_this, arguments)  
          }
        }, 30)
      }
    };
    new ImageSlider("bottom-turn");
  }
  $(window).on('scroll',function(){
    var sT;
     myFn();
  })
  function myFn(){
    sT = $(window).scrollTop();
    if(!$('.home-slide')){return false};
    if(sT >=  $('.home-slide').eq(2).offset().top - 1000){
       $('.home-slide').eq(2).css('opacity',1);
       $('.index-footer').addClass('animated flipInX');
    }else if(sT >=  $('.home-slide').eq(1).offset().top - 800){
       $('.home-slide').eq(1).css('opacity',1);
       $('.crop-reports .home-p, #bottom-turn').addClass('animated fadeInRight');
    }else if(sT >= $('.home-slide').eq(0).offset().top - 800){
      $('.home-slide').eq(0).css('opacity',1);
      $('.platform-introduction .home-p').addClass('animated fadeInDown');
      $('.platform-introduction .introduction-page').addClass('animated fadeInDown');
    }
  }
}







