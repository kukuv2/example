/**
 * @Author DPD
 * @Date 2016/6/16
 * All of the map operation here 
 *   Init map and layer 
 *   Add TDT layers to map
 *   Layer visible control
 *   Add and remove geoserver layer function 
 */

Global.Map = (function(){
  var result = {};
  result.init = function() {
    result.tdtVecLayer = new ol.layer.Tile({
      title: "矢量数据",
      source: new ol.source.XYZ({
        urls: defineUrl("vec")
      })
    });

    result.tdtImgLayer = new ol.layer.Tile({
      visible:false,
      title: "影像数据",
      source: new ol.source.XYZ({
        urls: defineUrl("img")
      })
    });

    result.tdtCvaLayer = new ol.layer.Tile({
      title: "文字注记",
      source: new ol.source.XYZ({
        urls: defineUrl("cva")
      })
    });

    result.map = new ol.Map({
      target: 'map',
      layers: [result.tdtVecLayer, result.tdtImgLayer, result.tdtCvaLayer],
      controls: ol.control.defaults().extend([
        new ol.control.ScaleLine({
          target: document.getElementById('scaleline')
        }),
        new ol.control.MousePosition({
          coordinateFormat: ol.coordinate.toStringHDMS,
          projection: 'EPSG:4326'
        })
      ]),
      view: new ol.View({
        center: ol.proj.fromLonLat([104.48, 39.85]),
        zoom: 4,
        minZoom: 2,
        maxZoom: 18
      })
    });

    // set the annotation layer on the topest 
    result.tdtCvaLayer.setZIndex(5);
    if (typeof Global.mapControl == 'function') Global.mapControl();
  }
  
  result.centerTo = function(bounds) {
    var extent = ol.extent.applyTransform(bounds, ol.proj.getTransform("EPSG:4326", "EPSG:3857"));
    Global.Map.map.getView().fit(extent, Global.Map.map.getSize());
  }

  result.layerVisibility = function(layerName,visibility) {
    layerName.setVisible(visibility);
  };
  var layerNameArray = [];
  var layersListByName = {};

  result.addGeoLayer = function(options) {
    var _size = Global.Map.map.getSize(),
        _extent = Global.Map.map.getView().calculateExtent(_size);

    var tiled = new ol.layer.Tile({
      visible: options.visible,
      extent: options.extent ? options.extent : _extent,
      opacity: options.opacity ? options.opacity : 1,
      source: new ol.source.TileWMS({
        url: options.serverUrl,
        params: {
          FORMAT: "image/png",
          'VERSION': '1.1.1',
          tiled: true,
          STYLES: options.styles ? options.styles : '',
          LAYERS: options.layerName,
        }
      })
    });

    result.map.addLayer(tiled);

    if(options.removeAll){
      result.removeAllLayers();
    }
    if (options.inRemoveList) {
      layersListByName[options.layerName] = tiled;
      layerNameArray.push(options.layerName);
    }

    if (options.sld) {
      if(tiled.getSource().getParams().SLD_BODY){
        delete tiled.getSource().getParams().SLD_BODY;
      }
      tiled.getSource().updateParams({SLD_BODY: options.sld});
    }

    if (options.zIndex && typeof options.zIndex ==='number') {
      tiled.setZIndex(options.zIndex);
    }

    if(typeof options.callback == 'function')
      options.callback(tiled); 
  }
  
  result.removeLayerByName = function(layerName) {
    result.map.removeLayer(layersListByName[layerName]);
  }

  result.removeAllLayers = function() {
    for (var i = 0, len = layerNameArray.length; i < len; i++) {
      result.removeLayerByName(layerNameArray[i]);
    }
    layerNameArray = [];
  }

  var defineUrl = function(layerType) {
    var urlArr = [];
    for (var i = 0; i < 8; i++) {
      var url = "http://t" + i + ".tianditu.com/DataServer?T=" + layerType + "_w&x={x}&y={y}&l={z}";
      urlArr.push(url);
    }
    return urlArr;
  }
  
  return result;
})();

