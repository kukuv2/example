/**
* @Author:DPD
* @Date: 2016/11/7
* The basic requst model
*/
Global.BaseRequest = function () {};
Global.BaseRequest.prototype = {
  post: function(url, data, callback, contentType, async, dataType) {
    return $.ajax({ 
      type: "POST",
      url: url, 
      data: data,
      contentType: contentType,
      dataType: dataType,
      async : async,
      beforeSend: setHeader,
      success: function(data, status, xhr) {
        callback(data, status, xhr); 
      },
      error: requestError
    });
  },
  get: function(url, callback, async, dataType) {
    return $.ajax({ 
      type: "GET",
      url: url,
      async: async,
      dataType:  dataType,
      beforeSend: setHeader,
      success: function(data, status, xhr) {
        callback(data, status, xhr);
      },
      error: requestError
    });
  }
}