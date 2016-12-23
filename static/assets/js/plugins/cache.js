/**
* @Author:DPD
* @Date: 2016/11/7
* The cache model
* There has a problem of how to clear cache data 
* Post method is difficult to use cache, it will be done in next version 
* sizeof method is too slowly.
*/
Global.Cache = function () {
  this.baseRequest = new Global.BaseRequest();
  this.cacheData = {};
};

Global.Cache.prototype = {
  /**
   * Cache Prototype here
   */
  post: 
  function(url, postData, callback, contentType, async, dataType) {
    var self = this;
    return self.baseRequest.post(url, postData, function (data, status, xhr) {
      var _data = requestSuccess(data, status, xhr);
      if (_data && typeof callback === 'function') {
        callback(data);
      }
    }, 
    contentType ? contentType : "application/x-www-form-urlencoded", 
    typeof async === 'boolean' ? async : true,
    dataType ? dataType : 'json')
  },

  get: 
  function(url, callback, useCache, async, dataType) {
    var self = this;
    if (useCache && self.cacheData[url] && self.cacheData[url].data) {
      console.log('data from cache. ' + url);
      callback(self.cacheData[url].data);
    } else {
      return self.baseRequest.get(url, function (data, status, xhr) {
        var _data = requestSuccess(data, status, xhr);
        if (_data && typeof callback === 'function') {
          if (useCache) {
            self.cacheData[url] = {};
            self.cacheData[url].data = _data;
          }
          callback(_data);
        }
        // if(self.sizeof(self.cacheData) / 1024 / 1024 >= 5) {
        //   self.cacheData = {};
        // }
      },
      typeof async === 'boolean' ? async : true,
      dataType ? dataType : 'json');
    }
  },

  cache:
  function(url, postData, callback) {
    if (this.cacheData[url]) {
      if (Global.equalObject(this.cacheData[url].postData, postData)) {
        callback(this.cacheData[url].data);
        // if(self.sizeof(this.cacheData) / 1024 / 1024 >= 5) {
        //   this.cacheData = {};
        // }
      } else {
        callback(null);
      }
    }
  },
  
  sizeof:
  function (object){
    var objects = [object];
    var size    = 0;

    for (var index = 0; index < objects.length; index ++){
      switch (typeof objects[index]){
        case 'boolean': size += 4; break;
        case 'number': size += 8; break;
        case 'string': size += 2 * objects[index].length; break;
        case 'object':
          if (Object.prototype.toString.call(objects[index]) != '[object Array]'){
            for (var key in objects[index]) size += 2 * key.length;
          }
          for (var key in objects[index]){
            var processed = false;
            for (var search = 0; search < objects.length; search ++){
              if (objects[search] === objects[index][key]){
                processed = true;
                break;
              }
            }
            if (!processed) objects.push(objects[index][key]);

          }
      }

    }
    return size;
  }
}
